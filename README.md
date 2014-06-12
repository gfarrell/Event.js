# Event.js - Small event pub/sub library

Event.js tries to plug the gaps in other event pub/sub bind/trigger or whatever-method-you-use libraries. It's extremely simple, but shouldn't do anything you don't expect.

## Usage

Let's start by `require()`ing Event.js and creating an instance:

    Vent    = require('EventJS');
    MyEvent = new Vent();

### Subscribing to an event

To subscribe a callback to an event, simply use `subscribe(name, callback)`:

    MyEvent.subscribe('test', myCallback);

If you are using the method of a particular object, then use the `bind` argument:

    MyEvent.subscribe('test', myFoo.myCallback, myFoo);

This will ensure that `myFoo.myCallback` is bound to `myFoo` when it is called. **Do not** use `Vent.subscribe('test', myFoo.myCallback.bind(myFoo))`, as this causes problems when we try to unsubscribe events.

### Unsubscribing from an event

To unsubscribe, you must use exactly the same call signature you use for `subscribe`, but this time for `unsubscribe`:

    MyEvent.unsubscribe('test', myCallback);

Or, if you subscribed an instance method:

    MyEvent.unsubscribe('test', myFoo.myCallback, myFoo);

### Publishing events

To notify all the subscribers, use the publish method:

    MyEvent.publish('test', 'Hello');

This will call each subscribed callback with a single argument, `"Hello"`. To add more arguments, just put them in the call signature:

    MyEvent.publish('test', 'Hello', 'World');

This will call each subscribed callback with two arguments, `"Hello"` and `"World"`.

### Implementing functionality on your own class

Event.js can implement the pub/sub functionality on any other class using the `implementOn` class method:

    Vent.implementOn(MyClass);

Then you can use it as before:

    var myInstance = new MyClass();

    myInstance.subscribe(/* ... */);
    // ... and so on

## Some things this fixes

My primary motivation for writing Event.js was that it fixed some problems I was having in some other libraries. When unsubscribing one instance's callback I often found that this would unsubscribe all the instances' callbacks, or fail to recognise the instance/callback combination, because I had to use `callback.bind(obj)`. The way Event.js does things, by having a separate `bind` argument, avoids problems with this, which are related to the way `.bind()` works (it creates a new function, so equality tests always fail).