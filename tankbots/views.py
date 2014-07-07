from django.shortcuts import render_to_response

def home(request):
    return render_to_response('game/main.html', {
        'controller_class': 'TankBots.Game.SampleGameController',
    })
