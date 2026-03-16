from django.http import JsonResponse, HttpResponse
import urllib.request
import urllib.parse
from .models import Theme
import os

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

import edge_tts, asyncio, io

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