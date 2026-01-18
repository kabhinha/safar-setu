from django.db import models

class FeatureFlag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_global_enabled = models.BooleanField(default=False)
    # enabled_districts = models.ManyToManyField('geography.District') # TODO Link
    rollout_percentage = models.IntegerField(default=0)
    
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({'ON' if self.is_global_enabled else 'OFF'})"
