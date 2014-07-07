from django.conf.urls import patterns, include, url

urlpatterns = patterns('game.views',
    url(r'^challenge/(?P<challenge_id>\d+)/play$', 'challenge_play'),
)
