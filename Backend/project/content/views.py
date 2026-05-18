import base64
import json
import os
import urllib.request
import urllib.parse
from django.conf import settings
from django.http import JsonResponse, HttpResponse
import edge_tts, asyncio, io
from django.utils.text import slugify
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from .models import User, Theme, Subcategory
from .serializers import RegisterSerializer, LoginSerializer, SubcategorySerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


def get_media_url(request, media_field):
    if not media_field:
        return ''
    media_url = getattr(media_field, 'url', media_field)
    if media_url.startswith('http://') or media_url.startswith('https://'):
        return media_url
    return request.build_absolute_uri(media_url)


def serialize_subcategory(request, sub):
    is_hidden = False
    if request.user.is_authenticated:
        is_hidden = sub.hidden_by.filter(pk=request.user.pk).exists()
    return {
        'id': sub.slug,
        'name': sub.name,
        'image': get_media_url(request, sub.image),
        'video': get_media_url(request, sub.video),
        'voice': get_media_url(request, sub.voice),
        'hidden': is_hidden,
    }


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

@api_view(['GET'])
def themes_list(request):
    themes = []
    for theme in Theme.objects.all():
        subs_data = []
        for sub in theme.subcategories.all():
            subs_data.append(serialize_subcategory(request, sub))
        
        themes.append({
            'id': theme.slug,
            'name': theme.name,
            'image': get_media_url(request, theme.image),
            'subcategories': subs_data
        })
    
    response = JsonResponse(themes, safe=False)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@api_view(['GET'])
def theme_detail(request, slug):
    try:
        theme = Theme.objects.get(slug=slug)
        
        subs_data = []
        for sub in theme.subcategories.all():
            subs_data.append(serialize_subcategory(request, sub))
        
        data = {
            'id': theme.slug,
            'name': theme.name,
            'image': get_media_url(request, theme.image),
            'subcategories': subs_data
        }
        response = JsonResponse(data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
    except Theme.DoesNotExist:
        response = JsonResponse({'error': 'Theme not found'}, status=404)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response

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
    permission_classes = [AllowAny]
    authentication_classes = []


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class CreateSubcategoryView(generics.CreateAPIView):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # No authentication required for this endpoint

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def perform_create(self, serializer):
        theme_slug = self.kwargs.get('theme_slug')
        try:
            theme = Theme.objects.get(slug=theme_slug)
        except Theme.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Theme not found')
        
        # Generate unique slug
        from django.utils.text import slugify
        base_slug = slugify(serializer.validated_data.get('name', ''))
        slug = base_slug
        counter = 1
        
        while Subcategory.objects.filter(theme=theme, slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        serializer.save(theme=theme, slug=slug, hidden=False)


from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated

class SubcategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subcategory.objects.all()
    lookup_field = 'slug'
    serializer_class = SubcategorySerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if 'hidden' in request.data:
            hidden_value = request.data.get('hidden')
            if isinstance(hidden_value, str):
                hidden_value = hidden_value.lower() in ['true', '1', 'yes']

            if hidden_value:
                instance.hidden_by.add(request.user)
            else:
                instance.hidden_by.remove(request.user)

            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        return super().update(request, *args, **kwargs)

@csrf_exempt
def create_theme(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        image = request.FILES.get('image')

        if not name:
            return JsonResponse({'detail': 'Name is required'}, status=400)

        theme = Theme.objects.create(
            name=name,
            slug=slugify(slug),
            image=image
        )

        return JsonResponse({'message': 'Theme created'}, status=201)