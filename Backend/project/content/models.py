from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

class Theme(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    image = models.ImageField(blank=True, upload_to='themes/')

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    theme = models.ForeignKey(Theme, related_name='subcategories', on_delete=models.CASCADE)
    slug = models.SlugField()
    name = models.CharField(max_length=200)
    image = models.ImageField(blank=True, upload_to='subcategories/')
    video = models.FileField(blank=True, upload_to='subcategories/videos/')
    voice = models.FileField(blank=True, upload_to='subcategories/voices/')
    hidden_by = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='hidden_subcategories')
    hidden = models.BooleanField(default=False)

    class Meta:
        unique_together = ('theme', 'slug')

    def __str__(self):
        return f"{self.theme.name} - {self.name}"

class User(AbstractUser):
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=10)
    age = models.IntegerField(null=True, blank=True)
    specialist_name = models.CharField(max_length=255, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
