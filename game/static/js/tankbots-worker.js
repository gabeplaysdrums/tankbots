var __watch__;
var __get_watch_list__;
var __log__;
var __get_log_messages__;
var __clear_log_messages__;
var __rect__;
var __get_rect_list__;
var __clear_rect_list__;

function __dispatch_init__(data)
{
    if (typeof "__init__" !== "undefined")
    {
        try 
        {
            return __init__(data.world, data.friends);
        }
        catch(ex)
        {}
    }

    return null;
}

function __step__(data)
{
    var results = {
        "command": {},
    };

    if (typeof "__update__" !== "undefined")
    {
        try 
        {
            __update__(
                data.step, 
                data.friends, 
                data.enemies, 
                data.bullets, 
                data.collisions
            );
        }
        catch(ex)
        {}
    }

    if (typeof "__command__" !== "undefined")
    {
        for (var i=0; i < data.friends.length; i++)
        {
            var tank = data.friends[i];

            try
            {
                results["command"][tank.id] = __command__(data.step, tank);
            }
            catch(ex)
            {}
        }
    }

    results["watch"] = __get_watch_list__();
    results["logs"]  = __clear_log_messages__();
    results["rects"] = __clear_rect_list__();

    return results;
}

(function() {

    var watch = {};

    __watch__ = function(key, value) {
        watch[key] = value;
    };

    __get_watch_list__ = function() {
        return watch;
    }

})();

(function() {

    var messages = [];

    function join(args)
    {
        var x = [];

        for (var i=0; i < args.length; i++)
        {
            x.push(args[i]);
        }

        return x.join(" ");
    }

    function addMessage(s, className)
    {
        if (className === undefined)
        {
            className = "";
        }

        messages.push({
            "message": s,
            "className": className,
        });
    }

    __log__ = function() {
        addMessage(join(arguments), "");
    };

    __get_log_messages__ = function() {
        return messages;
    };

    __clear_log_messages__ = function() {
        var m = messages;
        messages = [];
        return m;
    };

    console.__log = console.log;
    console.log = function() { __log__.apply(this, arguments); }

    console.__warn = console.warn;
    console.warn = function() { addMessage("warning: " + join(arguments), "jqconsole-warn"); }

    console.__error = console.error;
    console.error = function() { addMessage("error: " + join(arguments), "jqconsole-error"); }

    console.__debug = console.debug;
    console.debug = function() { addMessage("debug: " + join(arguments), "jqconsole-debug"); }

    console.__info = console.info;
    console.info = function() { addMessage("info: " + join(arguments), "jqconsole-info"); }

    console.__clear = console.clear;
    console.clear = function(){};

})();

(function() {

    var rects = [];

    __rect__ = function(left, top, right, bottom) {
        rects.push({
            "top": top,
            "left": left,
            "right": right,
            "bottom": bottom,
        });
    };

    __get_rect_list__ = function() {
        return rects;
    };

    __clear_rect_list__ = function() {
        var r = rects;
        rects = [];
        return r;
    };

})();
