from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tags = models.JSONField(default=list, help_text="List of tag strings, e.g. ['React', 'Django']")
    github_url = models.URLField(max_length=500, blank=True, default="https://github.com")
    demo_url = models.URLField(max_length=500, blank=True, default="#")

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} ({self.email}) at {self.created_at}"
