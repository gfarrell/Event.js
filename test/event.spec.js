/* global jasmine, require, beforeEach, define, describe, it, expect */
define(['jasmine/boot', 'event'], function() {
    'use strict';

    describe('Event.js', function() {
        var E;

        beforeEach(function() {
            var Vent = require('event');
            E = new Vent();
        });

        it('subscribes callbacks to events', function() {
            var j = jasmine.createSpy('testCallback');

            E.subscribe('test', j);

            expect(E.__subscriptions.test[0].callback).toEqual(j);
            expect(E.__subscriptions.test[0].bind).toEqual(E);
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
    });
});
