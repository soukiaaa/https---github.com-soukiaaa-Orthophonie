from django.db import models

class Theme(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    theme = models.ForeignKey(Theme, related_name='subcategories', on_delete=models.CASCADE)
    slug = models.SlugField()
    name = models.CharField(max_length=200)
    image = models.URLField(blank=True)

    class Meta:
        unique_together = ('theme', 'slug')

    def __str__(self):
        return f"{self.theme.name} - {self.name}"
