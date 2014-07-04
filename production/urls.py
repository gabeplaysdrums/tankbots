from tankbots.urls import *
from django.conf.urls import patterns, include, url
import dbindexer

handler500 = 'djangotoolbox.errorviews.server_error'

# search for dbindexes.py in all INSTALLED_APPS and load them
dbindexer.autodiscover()

urlpatterns += patterns('',
    url('^_ah/warmup$', 'djangoappengine.views.warmup'),
)
