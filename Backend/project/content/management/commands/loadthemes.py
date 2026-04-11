from django.core.management.base import BaseCommand
from content.models import Theme, Subcategory
import json, os

class Command(BaseCommand):
    help = 'Load themes and subcategories into database from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_path', nargs='?', default=None, help='Path to themes JSON file')

    def handle(self, *args, **options):
        path = options['json_path']
        if not path:
            self.stdout.write('Provide path to JSON file')
            return
        if not os.path.exists(path):
            self.stdout.write(self.style.ERROR(f'File not found: {path}'))
            return
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for theme_data in data:
            theme, created = Theme.objects.get_or_create(slug=theme_data['id'], defaults={'name': theme_data['name'], 'image': theme_data.get('image','')})
            if not created:
                theme.name = theme_data['name']
                theme.image = theme_data.get('image','')
                theme.save()
            for sub in theme_data.get('subcategories',[]):
                Subcategory.objects.update_or_create(
                    theme=theme, slug=sub['id'],
                    defaults={
                        'name': sub['name'],
                        'image': sub.get('image',''),
                        'video': sub.get('video','')
                    }
                )
        self.stdout.write(self.style.SUCCESS('Themes loaded'))
