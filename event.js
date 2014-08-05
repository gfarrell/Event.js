/* global define, module */
(function() {
    'use strict';

    /**
     * Constructor for new Vent object
     */
    var Vent = function() {
        this.__subscriptions = {};
    };

    /**
     * Checks if a callback is already subscribed to an event.
     * @param {String}   name     the event name
     * @param {Function} callback the callback to check
     * @param {Object}   bind     the originally bound object [optional]
     * @return {Boolean}          whether or not the callback is already subscribed
     */
    Vent.prototype.isSubscribed = function(name, callback, bind) {
        this.__subscriptions = this.__subscriptions || {};
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

    /**
     * Subscribe to an event
     * @param  {String}   name     the event name
     * @param  {Function} callback the callback to trigger
     * @param  {Object}   bind     an object to bind to (e.g. class instance)
     */
    Vent.prototype.subscribe = function(name, callback, bind) {
        this.__subscriptions = this.__subscriptions || {};
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

    /**
     * Unsubscribe from an event
     * @param  {String}   name     the event name
     * @param  {Function} callback the callback to unsubscribe
     * @param  {Object}   bind     the original object binding
     */
    Vent.prototype.unsubscribe = function(name, callback, bind) {
        this.__subscriptions = this.__subscriptions || {};
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

    /**
     * Publish an event, all aguments after name are passed to the callbacks
     * @param  {String} name  the event name
     */
    Vent.prototype.publish = function(/* name, args */) {
        this.__subscriptions = this.__subscriptions || {};
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

    /**
     * Implement Vent's functionality on another class
     * @param {Object} klass the object (e.g. class.prototype) to implement on.
     */
    Vent.implementOn = function(klass) {
        var methods = ['subscribe', 'unsubscribe', 'publish', 'isSubscribed'];
        methods.forEach(function(m) {
            klass[m] = Vent.prototype[m];
        });

        return klass;
    };

    // AMD - requirejs
    if(typeof define == 'function') {
        define([], function() { return Vent; });
    }

    // Node.js / CommonJS module
    if(typeof module != 'undefined') {
        module.exports = Vent;
    }
})();
