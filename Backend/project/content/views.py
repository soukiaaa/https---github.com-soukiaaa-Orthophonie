import base64
import json
import os
import urllib.request
import urllib.parse
from django.conf import settings
from django.http import JsonResponse, HttpResponse
import edge_tts, asyncio, io
from django.utils.text import slugify
from rest_framework import generics
from .models import User, Theme, Subcategory
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


def get_media_url(request, media_field):
    if not media_field:
        return ''
    media_url = getattr(media_field, 'url', media_field)
    if media_url.startswith('http://') or media_url.startswith('https://'):
        return media_url
    return request.build_absolute_uri(media_url)


def save_generated_image(action, image_data):
    folder_name = 'actions'
    target_dir = os.path.join(settings.MEDIA_ROOT, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    action_slug = slugify(action) or 'action'
    filename = f"{action_slug}-{int(round(__import__('time').time() * 1000))}.png"
    file_path = os.path.join(target_dir, filename)
    with open(file_path, 'wb') as f:
        f.write(image_data)
    return os.path.join(folder_name, filename)


def generate_image_from_openai(prompt):
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY is not set')

    request_data = json.dumps({
        'model': 'gpt-image-1',
        'prompt': prompt,
        'size': '512x512',
        'response_format': 'b64_json',
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/images/generations',
        data=request_data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
    )

    with urllib.request.urlopen(req) as res:
        response_body = res.read().decode('utf-8')
    response_json = json.loads(response_body)
    b64_json = response_json['data'][0]['b64_json']
    return base64.b64decode(b64_json)


def generate_action_image(request):
    action = request.GET.get('action', '').strip()
    if not action:
        return JsonResponse({'error': 'Action parameter is required.'}, status=400)

    prompt = (
        f"A colorful cartoon-style icon showing a child performing the action '{action}', "
        "with simple shapes and a friendly animated look suitable for a speech therapy app."
    )

    try:
        image_bytes = generate_image_from_openai(prompt)
        relative_path = save_generated_image(action, image_bytes)
        image_url = request.build_absolute_uri(settings.MEDIA_URL + relative_path)
        return JsonResponse({'action': action, 'image_url': image_url})
    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=500)

def themes_list(request):
    themes = []
    for theme in Theme.objects.all():
        themes.append({
            'id': theme.slug,
            'name': theme.name,
            'image': get_media_url(request, theme.image),
            'subcategories': [
                {
                    'id': sub.slug,
                    'name': sub.name,
                    'image': get_media_url(request, sub.image),
                    'video': get_media_url(request, sub.video)
                }
                for sub in theme.subcategories.all()
            ]
        })
    return JsonResponse(themes, safe=False)

def theme_detail(request, slug):
    try:
        theme = Theme.objects.get(slug=slug)
        data = {
            'id': theme.slug,
            'name': theme.name,
            'image': get_media_url(request, theme.image),
            'subcategories': [
                {
                    'id': sub.slug,
                    'name': sub.name,
                    'image': get_media_url(request, sub.image),
                    'video': get_media_url(request, sub.video)
                }
                for sub in theme.subcategories.all()
            ]
        }
        return JsonResponse(data)
    except Theme.DoesNotExist:
        return JsonResponse({'error': 'Theme not found'}, status=404)

def tts(request):
    text = request.GET.get('text', '')
    lang = request.GET.get('lang', 'ar')
    if not text:
        return HttpResponse('No text provided', status=400)
    
    try:
        # Fetch from Google TTS (using ar-DZ for Algerian Daridja)
        tts_url = f'https://translate.google.com/translate_tts?ie=UTF-8&tl=ar-DZ&client=tw-ob&q={urllib.parse.quote(text)}'
        with urllib.request.urlopen(tts_url) as response:
            audio_data = response.read()
            return HttpResponse(audio_data, content_type='audio/mpeg')
    except Exception as e:
        return HttpResponse(f'Error: {str(e)}', status=500)

def tts_edge(request):
    text  = request.GET.get('text', '')
    voice = request.GET.get('voice', 'ar-MA-JamalNeural')
    if not text:
        return HttpResponse('No text', status=400)
    try:
        async def _synthesize():
            buf = io.BytesIO()
            async for chunk in edge_tts.Communicate(text, voice).stream():
                if chunk["type"] == "audio":
                    buf.write(chunk["data"])
            buf.seek(0)
            return buf.read()
        
        audio = asyncio.run(_synthesize())
        return HttpResponse(audio, content_type='audio/mpeg')
    except Exception as e:
        return HttpResponse(f'Error: {str(e)}', status=500)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'email': user.email,
                'first_name': user.first_name,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
