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
     * Retrieves the subscription object.
     * @param {String}   name     the event name
     * @param {Function} callback the callback to check
     * @param {Object}   bind     the originally bound object [optional]
     * @return {Object}           the subscription object or null
     */
    Vent.prototype.retrieveSubscription = function (name, callback, bind) {
        this.__subscriptions = this.__subscriptions || {};
        bind = bind || this;

        if(name in this.__subscriptions) {
            for(var i in this.__subscriptions[name]) {
                var sub = this.__subscriptions[name][i];
                var cb = sub.callback;
                var b  = sub.bind;

                if(cb === callback && b === bind) return sub;
            }
        }

        return null;
    };

    /**
     * Checks if a callback is already subscribed to an event.
     * @param {String}   name     the event name
     * @param {Function} callback the callback to check
     * @param {Object}   bind     the originally bound object [optional]
     * @return {Boolean}          whether or not the callback is already subscribed
     */
    Vent.prototype.isSubscribed = function(name, callback, bind) {
        return (this.retrieveSubscription(name, callback, bind) !== null);
    };

    /**
     * Subscribe to an event
     * @param  {String}   name     the event name
     * @param  {Function} callback the callback to trigger
     * @param  {Object}   bind     an object to bind to (e.g. class instance)
     * @return {Object}            subscription object
     */
    Vent.prototype.subscribe = function(name, callback, bind) {
        this.__subscriptions = this.__subscriptions || {};
        if(!(name in this.__subscriptions)) {
            this.__subscriptions[name] = [];
        }

        bind = bind || this;

        var sub = this.retrieveSubscription(name, callback, bind);

        if(sub === null) {
            sub = {
                callback: callback,
                bind:     bind,
                once:     false
            };
            this.__subscriptions[name].push(sub);
        }

        return sub;
    };

    /**
     * Subscribe to an event once only
     * @param {String}   name     the event name
     * @param {Function} callback the callback to trigger
     * @param {Object}   bind     an object to bind to (e.g. class instance)
     * @return {Object}           subscription object
     */
    Vent.prototype.subscribeOnce = function (name, callback, bind) {
        var sub = this.subscribe(name, callback, bind);
        sub.once = true;
        return sub;
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
            var c = l.length;
            var delete_queue = [];

            for(var i = 0; i < c; i++) {
                var sub  = l[i];
                var cb   = sub.callback;
                var b    = sub.bind;
                var once = sub.once || false;

                if(typeof cb == 'function') {
                    cb.apply(b, args);
                }

                if(once) {
                    delete_queue.push(i);
                }
            }

            if(delete_queue.length > 0) {
                var clean = l.filter(function(item, index) {
                    return (delete_queue.indexOf(index) == -1);
                });

                this.__subscriptions[name] = clean;
            }
        }
    };

    /**
     * Implement Vent's functionality on another class
     * @param {Object} klass the object (e.g. class.prototype) to implement on.
     */
    Vent.implementOn = function(klass) {
        var methods = ['retrieveSubscription', 'subscribe', 'subscribeOnce', 'unsubscribe', 'publish', 'isSubscribed'];
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
