from django.http import JsonResponse
from .models import Theme

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
