var ANGLE_MARGIN = 5 * Math.PI/180;
var DISTANCE_MARGIN = 2.0;

var world;
var targets = {};

function getTarget(id, reset)
{
    if (!targets[id] || reset)
    {
        targets[id] = {
            "x": 5 + Math.random() * (world.width - 5),
            "y": 5 + Math.random() * (world.height - 5),
        };
    }
    
    return targets[id];
}

function dist(pos1, pos2)
{
    var dx = pos2.x - pos1.x;
    var dy = pos2.y - pos1.y;
    
    return {
        "dist": Math.sqrt(dx*dx + dy*dy),
        "angle": Math.atan2(dy, dx)
    };
}

function fixAngle(a)
{
    while (a > Math.PI)
    {
        a -= 2 * Math.PI;
    }
    
    while (a < -Math.PI)
    {
        a += 2 * Math.PI;
    }
    
    return a;
}

/* 
 * called once when the simulation is initialized 
 * @param world - info about the world
 * @param friends - array of friendly tanks in the world
 */
function __init__(world_, friends)
{
    console.info("world: " + JSON.stringify(world, undefined, 2));
    console.info("friends: " + JSON.stringify(friends, undefined, 2));
    world = world_;
}

/*
 * called on each step of the simulation
 * @param step - step count
 * @param friends - array of friendly tanks in the world
 * @param enemies - array of enemy tanks in the world
 * @param bullets - array of bullets in the world
 * @param collisions - collisions that happened in this step
 */
function __update__(step, friends, enemies, bullets, collisions)
{
    // use the __watch__ function to display values in the watch list
    __watch__("step", step);
    __watch__("friends", friends);
    __watch__("enemies", enemies);
    
    for (var i=0; i < collisions.length; i++)
    {
        var c = collisions[i];
        console.log(c[0].class + " collided with " + c[1].class + "!");
    }
}

/*
 * called on each step of the simulation for each tank you control
 * @param step - step count
 * @param tank - the tank to command
 */
function __command__(step, tank)
{
    var target = getTarget(tank.id);
    __watch__("target id=" + tank.id, target);

    // draw the target on the simulation canvas for debugging purposes
    __rect__(target.x - 1, target.y - 1, target.x + 1, target.y + 1);
    
    var d = dist(tank.position, target);
    var d_angle = fixAngle(d.angle - tank.angle);
    var actions = {};
    
    if (d.dist < DISTANCE_MARGIN)
    {
        getTarget(tank.id, true);
        return;
    }
    
    if (Math.abs(d_angle) < ANGLE_MARGIN)
    {
        actions.accel = "forward";
    }
    else if (d_angle < -ANGLE_MARGIN)
    {
        actions.steer = "left";
    }
    else if (d_angle > ANGLE_MARGIN)
    {
        actions.steer = "right";
    }
    
    actions.turret = (step % 2 === 0) ? "fire" : "left";
    
    __watch__("actions id=" + tank.id, actions);
    return actions;
}
