function __dispatch_update__(data)
{
    if (typeof "__update__" !== "undefined")
    {
        try 
        {
            return __update__(data.step, data.tank, data.friends, data.enemies);
        }
        catch(ex)
        {
        }
    }

    return null;
}

var __watch__;
var __get_watch_list__;

(function() {

    var watch = {};

    __watch__ = function(key, value) {
        watch[key] = value;
    };

    __get_watch_list__ = function() {
        return watch;
    }

})();

var __log__;
var __get_log_messages__;
var __clear_log_messages__;

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

    __log__ = function() {
        messages.push(join(arguments));
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
    console.warn = function() { __log__("warning: " + join(arguments)); }

    console.__error = console.error;
    console.error = function() { __log__("error: " + join(arguments)); }

    console.__debug = console.debug;
    console.debug = function() { __log__("debug: " + join(arguments)); }

    console.__info = console.info;
    console.info = function() { __log__("info: " + join(arguments)); }

    console.__clear = console.clear;
    console.clear = function(){};

})();
