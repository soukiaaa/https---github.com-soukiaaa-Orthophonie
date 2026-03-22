from django.http import JsonResponse, HttpResponse
import urllib.request
import urllib.parse
import edge_tts, asyncio, io
from rest_framework import generics
from .models import User, Theme, Subcategory
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

def themes_list(request):
    themes = []
    for theme in Theme.objects.all():
        themes.append({
            'id': theme.slug,
            'name': theme.name,
            'image': theme.image,
            'subcategories': [
                {'id': sub.slug, 'name': sub.name, 'image': sub.image}
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
            'image': theme.image,
            'subcategories': [
                {'id': sub.slug, 'name': sub.name, 'image': sub.image}
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
