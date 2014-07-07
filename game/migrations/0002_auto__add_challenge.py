# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Challenge'
        db.create_table(u'game_challenge', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length='128')),
            ('description', self.gf('django.db.models.fields.TextField')(default='')),
            ('controller_class', self.gf('django.db.models.fields.CharField')(default='TankBots.Game.GameController', max_length=128)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'game', ['Challenge'])


    def backwards(self, orm):
        # Deleting model 'Challenge'
        db.delete_table(u'game_challenge')


    models = {
        u'game.challenge': {
            'Meta': {'object_name': 'Challenge'},
            'controller_class': ('django.db.models.fields.CharField', [], {'default': "'TankBots.Game.GameController'", 'max_length': '128'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "''"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': "'128'"})
        }
    }

    complete_apps = ['game']