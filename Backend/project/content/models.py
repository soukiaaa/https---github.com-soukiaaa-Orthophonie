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

    class Meta:
        unique_together = ('theme', 'slug')

    def __str__(self):
        return f"{self.theme.name} - {self.name}"

class CustomSubcategory(models.Model):
    theme = models.ForeignKey(Theme, related_name='custom_subcategories', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='custom_subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    image = models.ImageField(blank=True, upload_to='custom_subcategories/')
    video = models.FileField(blank=True, upload_to='custom_subcategories/videos/')
    voice = models.FileField(blank=True, upload_to='custom_subcategories/voices/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.theme.name} - {self.name} (by {self.user.email})"

class User(AbstractUser):
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=10)
    age = models.IntegerField(null=True, blank=True)
    specialist_name = models.CharField(max_length=255, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
