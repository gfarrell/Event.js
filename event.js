/* global define */
define([], function() {
    'use strict';

    var e = function() {
        this.__subscriptions = {};
    };

    e.prototype.isSubscribed = function(name, callback, bind) {
        bind = bind || this;

        if(name in this.__subscriptions) {
            var sub;
            for(sub in this.__subscriptions[name]) {
                var cb = this.__subscriptions[name][sub].callback;
                var b  = this.__subscriptions[name][sub].bind;

                if(cb === callback && b === bind) return true;
            }
        }

        return false;
    };

    e.prototype.subscribe = function(name, callback, bind) {
        if(!(name in this.__subscriptions)) {
            this.__subscriptions[name] = [];
        }

        bind = bind || this;

        if(!this.isSubscribed(name, callback, bind)) {
            this.__subscriptions[name].push({
                callback: callback,
                bind:     bind
            });
        }
    };

    e.prototype.unsubscribe = function(name, callback, bind) {
        bind = bind || this;

        if(this.isSubscribed(name, callback, bind)) {
            var sub;
            for(sub in this.__subscriptions[name]) {
                var cb = this.__subscriptions[name][sub].callback;
                var b  = this.__subscriptions[name][sub].bind;

                if(cb === callback && b === bind) break;
            }

            this.__subscriptions[name].splice(sub, 1);
        }
    };

    e.prototype.publish = function(/* name, args */) {
        var args = Array.prototype.slice.call(arguments);
        var name = args.shift();

        if(name in this.__subscriptions) {
            var l = this.__subscriptions[name];

            for(var i in l) {
                var cb = l[i].callback;
                var b  = l[i].bind;

                if(typeof cb == 'function') {
                    cb.apply(b, args);
                }
            }
        }
    };

    return e;
});