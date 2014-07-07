from django.db import models

class Challenge(models.Model):
    name = models.CharField(max_length='128')
    description = models.TextField(default='')
    controller_class = models.CharField(max_length=128, default='TankBots.Game.GameController')
    is_active = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name
