(function() {

    /**
     * Alters the simulation and controls when missions begin and end.
     * @summary Base game controller class
     * @classdesc
     */
    var GameController = Class.create({

        /**
         * @constructor
         * @param {TankBots.Sim.World} world - the world
         * @param {GameController~Options} [options] - optional parameters
         */
        initialize: function(world, options) {
            this.world = world;
            this.options = options;
        },

        /**
         * Called on every step of the simulation
         */
        step: function() {
        },

        /**
         * Call to signal missionBegin callback
         * @protected
         * @see GameController~missionBeginCallback
         */
        _missionBegin: function() {

            if (this.options && this.options.missionBegin)
            {
                this.options.missionBegin();
            }
        },

        /**
         * Call to signal missionEnd callback
         * @protected
         * @see GameController~missionEndCallback
         */
        _missionEnd: function(success, score) {

            if (this.options && this.options.missionEnd)
            {
                this.options.missionEnd(success, score);
            }
        },

        /**
         * Call to log a message that is visible to the player
         * @protected
         * @see GameController~logCallback
         */
        _log: function(message) {

            if (this.options && this.options.log)
            {
                this.options.log(message);
            }
        },

    });

    /**
     * @typedef {Object} GameController~Options
     * @property {GameController~missionBeginCallback} missionBegin - called when a new mission has started
     * @property {GameController~missionEndCallback} missionEnd - called when a mission has ended
     * @property {GameController~logCallback} log - called when the controller logs a message to the player
     */

    /**
     * @callback GameController~missionBeginCallback
     */

    /**
     * @callback GameController~missionEndCallback
     * @param {boolean} success - mission was completed successfully by the player
     * @param {number} score - the score for this mission
     */

    /**
     * @callback GameController~logCallback
     * @param {string} message - message to log
     */

    /**
     * Initially adds 3 friendly tanks to the world at random locations.  If a
     * tank is destroyed, a new one spawns at a random location.
     * Mission: Survive 1000 steps with no tanks dying.
     * @summary Sample game controller implementation
     */
    var SampleGameController = Class.create(GameController, {
    
        initialize: function($super, world, options) {
            $super(world, options);

            var worldWidth = world.info().width;
            var worldHeight = world.info().height;

            for (var i=0; i < 3; i++)
            {
                world.createTank(
                    Math.random() * worldWidth, 
                    Math.random() * worldHeight,
                    Math.random() * 2 * Math.PI
                );
            }

            this._kills = 0;
        },

        step: function() {

            // detect if any tanks have been destroyed

            var destroyed = false;

            for (var i=0; i < this.world.collisions.length; i++)
            {
                var coll = this.world.collisions[i];

                for (var j=0; j < coll.length; j++)
                {
                    var obj = coll[i];
                    
                    if (obj instanceof TankBots.Sim.Tank && !obj.isAlive())
                    {
                        this._log("Tank " + obj.id() + " has been destroyed!");
                        destroyed = true;
                    }
                }
            }

            if (destroyed)
            {
                this._kills++;

                // add a new tank to the world

                var worldWidth = this.world.info().width;
                var worldHeight = this.world.info().height;

                this.world.createTank(
                    Math.random() * worldWidth, 
                    Math.random() * worldHeight,
                    Math.random() * 2 * Math.PI
                );
            }

            var stepCount = this.world.stepCount();

            if (stepCount === 0)
            {
                this._missionBegin();
            }
            else if (stepCount % 1000 === 0)
            {
                var success = this._kills === 0;
                this._missionEnd(success, 100 - 10 * this._kills);
                this._kills = 0;
                this._missionBegin();
            }
        },

    });

    // exports
    {
        window.TankBots = window.TankBots || {};
        window.TankBots.Game = window.TankBots.Game || {};
        window.TankBots.Game.GameController = GameController;
        window.TankBots.Game.SampleGameController = SampleGameController;
    }

})();
