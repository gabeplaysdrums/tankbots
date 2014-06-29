var ANGLE_MARGIN = 10 * Math.PI/180;
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

function rayCast(pos, angle, dist, bounds)
{
    var pos2 = {
        "x": pos.x + dist * Math.cos(angle),
        "y": pos.y + dist * Math.sin(angle)
    };
    
    __rect__(pos2.x - 0.1, pos2.y - 0.1, pos2.x + 0.1, pos2.y + 0.1);
    
    return (
        bounds.left <= pos2.x && pos2.x <= bounds.right &&
        bounds.top <= pos2.y && pos2.y <= bounds.bottom
        );
}

/* 
 * called once when the simulation is initialized 
 * @param world - info about the world
 * @param friends - array of friendly tanks in the world
 */
function __init__(world_, friends)
{
    world = world_;
}

/*
 * called on each step of the simulation for each tank you control
 * @param step - step count
 * @param tank - the tank
 * @param friends - array of friendly tanks in the world
 * @param enemies - array of enemy tanks in the world
 */
function __update__(step, tank, friends, enemies)
{
    // use the __watch__ function to display values in the watch list
    __watch__("step", step);
    __watch__("tank id=" + tank.id, tank);
    
    var target = getTarget(tank.id);
    __watch__("target id=" + tank.id, target);

    // draw the target on the simulation canvas for debugging purposes
    __rect__(target.x - 1, target.y - 1, target.x + 1, target.y + 1);
    
    var d = dist(tank.position, target);
    var d_angle = fixAngle(d.angle - tank.angle);
    __watch__("dist id=" + tank.id, d);
    __watch__("d_angle id=" + tank.id, d_angle);
    
    __rect__(
        tank.bounds.left,
        tank.bounds.top,
        tank.bounds.right,
        tank.bounds.bottom
        );
    
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
    
    if (actions.accel === "forward")
    {
        for (var i=0; i < friends.length; i++)
        {
            if (rayCast(tank.position, tank.angle, 6.0, friends[i].bounds))
            {
                actions.steer = "right";
            }
        }
    }
    
    __watch__("actions id=" + tank.id, actions);
    return actions;

    //return {
        //TODO: return action(s) to do in this step:
        // "accel": /* "forward" or "reverse" */,
        // "steer": /* "left" or "right" */,
        // "turret": /* "left", "right", or "fire" */,
    //};
}
