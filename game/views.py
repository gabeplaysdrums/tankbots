from django.shortcuts import render_to_response, get_object_or_404
from game.models import *

def challenge_play(request, challenge_id):
    challenge = get_object_or_404(Challenge, pk=challenge_id)
    controller_class = challenge.controller_class
    return render_to_response('game/main.html', locals())
