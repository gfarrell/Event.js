/* global jasmine, require, beforeEach, define, describe, it, expect */
define(['jasmine/boot', 'event'], function() {
    'use strict';

    describe('Event.js', function() {
        var E;
        var Vent = require('event');

        beforeEach(function() {
            E = new Vent();
        });

        it('subscribes callbacks to events', function() {
            var j = jasmine.createSpy('testCallback');

            E.subscribe('test', j);

            expect(E.__subscriptions.test[0].callback).toEqual(j);
            expect(E.__subscriptions.test[0].bind).toEqual(E);
        });

        it('subscribes one-off callbacks', function() {
            var j = jasmine.createSpy('callMeLots');
            var k = jasmine.createSpy('callMeOnce');

            E.subscribe('test', j);
            E.subscribeOnce('test', k);

            E.publish('test');

            expect(j.calls.count()).toEqual(1);
            expect(k.calls.count()).toEqual(1);

            E.publish('test');

            expect(j.calls.count()).toEqual(2);
            expect(k.calls.count()).toEqual(1);
        });

        it('retrieves a subscription object', function() {
            var j = jasmine.createSpy('testCallback');
            var s;

            E.subscribe('test', j);

            s = E.retrieveSubscription('test', j);

            expect(s.callback).toEqual(j);
            expect(s.bind).toEqual(E);
        });

        it('allows us to query a subscription with isSubscribed()', function() {
            var j = jasmine.createSpy('testCallback');

            E.subscribe('test', j, jasmine);

            expect(E.isSubscribed('test', j, jasmine)).toBeTruthy();
        });

        it('unsubscribes callbacks from events', function() {
            var j = jasmine.createSpy('testCallback');

            E.subscribe('test', j);
            E.unsubscribe('test', j);

            expect(E.__subscriptions.test.length).toEqual(0);

            E.subscribe('test', j, jasmine);
            E.unsubscribe('test', j, jasmine);

            expect(E.__subscriptions.test.length).toEqual(0);
        });

        it('won\'t unsubscribe similar objects\' callbacks when unsubscribing one', function() {
            var Foo = function() { this.id = Math.random(); this.called = false; };
            Foo.prototype.method = function() {
                this.called = true;
            };

            var a = new Foo();
            var b = new Foo();

            E.subscribe('test', a.method, a);
            E.subscribe('test', b.method, b);

            E.unsubscribe('test', a.method, a);

            expect(E.isSubscribed('test', b.method, b)).toBeTruthy();
        });

        it('publishes events that callbacks receive', function() {
            var j = jasmine.createSpy('publishTestCallback');

            E.subscribe('test', j);

            E.publish('test', 'Hello World');

            expect(j).toHaveBeenCalledWith('Hello World');

            E.publish('test', 'Hello', 'World');

            expect(j).toHaveBeenCalledWith('Hello', 'World');
        });

        it('starts off with no subscriptions', function() {
            expect(Object.keys(E.__subscriptions).length).toEqual(0);
        });

        it('implements functionality on another class', function() {
            var Foo = function() { this.id = Math.random(); };

            expect(Foo.prototype.publish).toBeUndefined();
            expect(Foo.prototype.subscribe).toBeUndefined();
            expect(Foo.prototype.unsubscribe).toBeUndefined();

            Vent.implementOn(Foo.prototype);

            expect(typeof Foo.prototype.publish).toBe('function');
            expect(typeof Foo.prototype.subscribe).toBe('function');
            expect(typeof Foo.prototype.unsubscribe).toBe('function');
        });
    });
});
