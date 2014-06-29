window.requestAnimFrame = (function(){
    return (
        window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

(function() {

    // aliases
    var b2AABB = Box2D.Collision.b2AABB;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2Color = Box2D.Common.b2Color;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
    var b2World = Box2D.Dynamics.b2World;

    // constants
    var SCALE = 30;

    // translate from window to world coordinates
    function coord(x)
    {
        return x / SCALE;
    }

    // get bounds from a body list
    function getBounds(bodyList)
    {
        var aabb = null;

        for (var i=0; i < bodyList.length; i++)
        {
            for (
                var fixture = bodyList[i].GetFixtureList();
                fixture != null; fixture = fixture.GetNext()
            )
            {
                var ab = fixture.GetAABB();

                if (!aabb)
                {
                    aabb = ab;
                }
                else
                {
                    aabb = b2AABB.Combine(aabb, ab);
                }
            }
        }

        return {
            "left": aabb.lowerBound.x,
            "top": aabb.lowerBound.y,
            "right": aabb.upperBound.x,
            "bottom": aabb.upperBound.y,
        };
    }

    // forward declare
    var World, Tank;

    World = Class.create({

        initialize: function(width, height, onstep) {

            if (onstep === undefined)
            {
                onstep = function(){};
            }

            this._width = width;
            this._height = height;
            this._running = false;
            this._onstep = onstep;
            this._stepCount = 0;
            this._obstacles = [];
            this.tanks = [];
            this.debugRects = [];
            this.debugOverlaysEnabled = true;

            // create the world
            this._world = new b2World(new b2Vec2(0, 0), true);

            // create walls
            {
                var self = this;

                function addWall(width, height, x, y)
                {
                    var fixDef = new b2FixtureDef();
                    fixDef.density = 1.0;
                    fixDef.friction = 0.5;
                    fixDef.restitution = 0.2;
                    fixDef.shape = new b2PolygonShape();
                    fixDef.shape.SetAsBox(coord(width / 2), coord(height / 2));
    
                    var bodyDef = new b2BodyDef();
                    bodyDef.type = b2Body.b2_staticBody;
                    bodyDef.position.x = coord(x);
                    bodyDef.position.y = coord(y);
    
                    var body = self._world.CreateBody(bodyDef);
                    body.CreateFixture(fixDef);
                    self._obstacles.push({ "bounds": getBounds([ body ]) });
                }

                addWall(this._width, 10, this._width / 2, this._height);
                addWall(this._width, 10, this._width / 2, 0);
                addWall(10, this._height, 0, this._height / 2);
                addWall(10, this._height, this._width, this._height / 2);
            }
        },

        createDebugDraw: function($canvas) {

            this._debugDraw = new b2DebugDraw();
            this._debugDraw.SetSprite($canvas.get(0).getContext("2d"));
            this._debugDraw.SetDrawScale(SCALE);
            this._debugDraw.SetFillAlpha(0.3);
            this._debugDraw.SetLineThickness(1.0);
            this._debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this._world.SetDebugDraw(this._debugDraw);
            this._worldWidth = $canvas.prop("width") / SCALE;
            this._worldHeight = $canvas.prop("height") / SCALE;
        },

        start: function() {

            var self = this;

            function update()
            {
                if (self._running)
                {
                    self.step(); 
                    requestAnimFrame(update);
                }
            }

            self._running = true;
            update();
        },

        stop: function() {
            this._running = false;
        },

        running: function() {
            return this._running;
        },

        step: function() {

            this._world.Step(
                1 / 60,   // frame-rate
                10,       // velocity iterations
                10        // position iterations
            );

            this._world.DrawDebugData();

            if (this.debugOverlaysEnabled && this.debugRects)
            {
                for (var i=0; i < this.debugRects.length; i++)
                {
                    var r = this.debugRects[i];
                    this._debugDraw.DrawPolygon(
                        [
                            new b2Vec2(r.left, r.top),
                            new b2Vec2(r.left, r.bottom),
                            new b2Vec2(r.right, r.bottom),
                            new b2Vec2(r.right, r.top),
                        ],
                        4,
                        new b2Color(1, 1, 0)
                    );
                }
            }

            this._onstep();

            this._world.ClearForces();
            this._stepCount++;
        },

        stepCount: function() {
            return this._stepCount;
        },

        createTank: function(x, y, angle) {
            var tank = new Tank(this._world, x, y, angle);
            this.tanks.push(tank);
            return tank;
        },

        info: function() {
            return {
                "width": this._worldWidth,
                "height": this._worldHeight,
                "obstacles": this._obstacles,
            };
        },

    });

    Tank = Class.create({

        initialize: function(world, x, y, angle) {

            this._id = Math.floor(100000 * Math.random());

            var FRICTION = 0.5;
            var pos = new b2Vec2(coord(x), coord(y));

            // create the tank body
            {
                var fixDef = new b2FixtureDef();
                fixDef.density = 1.0;
                fixDef.friction = FRICTION;
                fixDef.restitution = 0.01;
                fixDef.shape = new b2PolygonShape();
                fixDef.shape.SetAsBox(coord(70 / 2), coord(50 / 2));

                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position = pos;
                bodyDef.angle = angle;

                this._body = world.CreateBody(bodyDef)
                this._body.SetLinearDamping(2.5);
                this._body.SetAngularDamping(4.0);

                this._body.CreateFixture(fixDef);
            }

            // create the tank turret
            {
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position = pos;
                bodyDef.angle = angle;

                this._turret = world.CreateBody(bodyDef)
                this._turret.SetAngularDamping(40.0);

                {
                    var fixDef = new b2FixtureDef();
                    fixDef.density = 0.01;
                    fixDef.friction = FRICTION;
                    fixDef.restitution = 0.01;
                    fixDef.shape = new b2PolygonShape();
    
                    fixDef.shape.SetAsBox(coord(40 / 2), coord(30 / 2));
                    this._turret.CreateFixture(fixDef);
                }

                {
                    var fixDef = new b2FixtureDef();
                    fixDef.density = 0.01;
                    fixDef.friction = FRICTION;
                    fixDef.restitution = 0.01;
                    fixDef.shape = new b2PolygonShape();

                    fixDef.shape.SetAsOrientedBox(
                        coord(30 / 2), coord(10 / 2),
                        new b2Vec2(coord(40 / 2 + 30 / 2), coord(0)),
                        0
                    );

                    this._turret.CreateFixture(fixDef);
                }

            }

            // create turret joint
            {
                var jointDef = new b2RevoluteJointDef();
                jointDef.Initialize(this._body, this._turret, this._body.GetWorldCenter());
                this._joint = world.CreateJoint(jointDef);

                this._joint.EnableMotor(true);
            }
        
        },

        info: function() {
            var pos = this._body.GetWorldCenter();
            var vel = this._body.GetLinearVelocity();

            var bodyList = [
                this._body,
                this._turret,
            ];

            var aabb = null;

            for (var i=0; i < bodyList.length; i++)
            {
                for (
                    var fixture = bodyList[i].GetFixtureList();
                    fixture != null; fixture = fixture.GetNext()
                )
                {
                    var ab = fixture.GetAABB();

                    if (!aabb)
                    {
                        aabb = ab;
                    }
                    else
                    {
                        aabb = b2AABB.Combine(aabb, ab);
                    }
                }
            }

            return {
                "id": this._id,
                "position": { "x": pos.x, "y": pos.y },
                "angle": this._body.GetAngle(),
                "turretAngle": this._turret.GetAngle(),
                "velocity": { "x": vel.x, "y": vel.y },
                "angularVelocity": this._body.GetAngularVelocity(),
                "bounds": getBounds([ this._body, this._turret ]),
            }
        },

        applyActions: function(actions) {

            if (!actions)
            {
                return;
            }

            if (actions["accel"])
            {
                var d = actions["accel"];
                var a = this._body.GetAngle();
                var f = 0;

                var FORCE = 150;

                switch (d)
                {
                    case "forward":
                        f = FORCE;
                        break;
                    case "reverse":
                        f = -FORCE;
                        break;
                }

                this._body.ApplyForce(new b2Vec2(
                    f * Math.cos(a),
                    f * Math.sin(a)
                ), this._body.GetWorldCenter());
            }

            if (actions["steer"])
            {
                var d = actions["steer"];
                var t = 0;

                var TORQUE = 20;

                switch (d)
                {
                    case "left":
                        t = -TORQUE;
                        break;
                    case "right":
                        t = TORQUE;
                        break;
                }

                this._body.ApplyTorque(t);
            }

        },

    });

    // exports
    {
        window.TankBots = {};
        window.TankBots.Sim = {};
        window.TankBots.Sim.World = World;
        window.TankBots.Sim.Tank = Tank;
    }

})();
