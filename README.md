Tankbots
========
Command tanks with Javascript.

Version Numbers
---------------
Each deployment of the site has a version number in the form `X.Y.Z.W`.
* W - new deployment (bugfix)
* Z - changes to public APIs or simulation rules
* Y - new features (weapons, vehicles, etc.)
* X - major rewrite

Glossary
--------
* Users:
  * user - a person who uses the site
  * player - a user who writes code against the TankBots API
  * administrator - a user who manages the site and its contents
  * spectator - a user who views results, scores, statistics, etc.
* Developer Experience:
  * TankBots API - javascript library that player scripts leverage to command tanks
  * player script - javascript code written by a player that commands tanks in the simulation
* Internal:
  * simulation - physics engine, entities (tanks and obstacles) in the world, and basic rules about how they interact
  * game controller - initializes and controls the simulation; listens to changes and modifies the world as it chooses
