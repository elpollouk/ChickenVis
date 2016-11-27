(function () {
"use strict";

var ActionGroup = Chicken.fetch("ChickenVis.ActionGroup");

var newActor = function (action) {
    var actor = {};
    actor[action] = Test.mockFunction();
    return actor;
}

window.Tests.ActionTests = {
    construct: function () {
        var group = new ActionGroup("test");

        Assert.isSame("test", group.action);
        Assert.isSame(0, group.count);
    },

    add: function () {
        var group = new ActionGroup("test");

        group.add({});
        Assert.isSame(1, group.count);

        group.add({});
        Assert.isSame(2, group.count);
    },

    add_multiple: function () {
        var group = new ActionGroup("test");
        group.add([{}, {}, {}]);
        Assert.isEqual(3, group.count);
    },

    clear: function () {
        var group = new ActionGroup("test");

        group.add([{}, {}]);
        group.clear();
        Assert.isSame(0, group.count);

        // Make sure nothing goes bang when invoked in this state
        group.invoke0();
        group.invoke1(1);
        group.invoke2(1, 2);
    },

    invoke0: function () {
        var group = new ActionGroup("test0");
        var actor1 = newActor("test0");
        var actor2 = newActor("test0");

        group.add(actor1);
        group.add(actor2);
        group.invoke0();

        Assert.isEqual(1, actor1.test0.calls.length);
        Assert.isEqual(1, actor2.test0.calls.length);
    },

    invoke1: function () {
        var group = new ActionGroup("test1");
        var actor1 = newActor("test1");
        var actor2 = newActor("test1");

        group.add(actor1);
        group.add(actor2);
        group.invoke1("foo");

        Assert.isEqual(1, actor1.test1.calls.length);
        Assert.isEqual("foo", actor1.test1.calls[0][0]);
        Assert.isEqual(1, actor2.test1.calls.length);
        Assert.isEqual("foo", actor2.test1.calls[0][0]);
    },

    invoke2: function () {
        var group = new ActionGroup("test2");
        var actor1 = newActor("test2");
        var actor2 = newActor("test2");

        group.add(actor1);
        group.add(actor2);
        group.invoke2("foo", "bar");

        Assert.isEqual(1, actor1.test2.calls.length);
        Assert.isEqual("foo", actor1.test2.calls[0][0]);
        Assert.isEqual("bar", actor1.test2.calls[0][1]);
        Assert.isEqual(1, actor2.test2.calls.length);
        Assert.isEqual("foo", actor2.test2.calls[0][0]);
        Assert.isEqual("bar", actor2.test2.calls[0][1]);
    },

    remove_firstAction: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add([actor1, actor2, actor3]);
        group.remove(actor1);
        Assert.isEqual(2, group.count);

        group.invoke0();

        Assert.isEqual(0, actor1.test.calls.length);
        Assert.isEqual(1, actor2.test.calls.length);
        Assert.isEqual(1, actor3.test.calls.length);
    },

    remove_middleAction: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add([actor1, actor2, actor3]);
        group.remove(actor2);
        Assert.isEqual(2, group.count);

        group.invoke0();

        Assert.isEqual(1, actor1.test.calls.length);
        Assert.isEqual(0, actor2.test.calls.length);
        Assert.isEqual(1, actor3.test.calls.length);
    },

    remove_lastAction: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add([actor1, actor2, actor3]);
        group.remove(actor3);
        Assert.isEqual(2, group.count);

        group.invoke0();

        Assert.isEqual(1, actor1.test.calls.length);
        Assert.isEqual(1, actor2.test.calls.length);
        Assert.isEqual(0, actor3.test.calls.length);
    },

    remove_multiple: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add([actor1, actor2, actor3]);
        group.remove([actor3, actor1]);
        Assert.isEqual(1, group.count);

        group.invoke0();

        Assert.isEqual(0, actor1.test.calls.length);
        Assert.isEqual(1, actor2.test.calls.length);
        Assert.isEqual(0, actor3.test.calls.length);
    },

    remove_byReturnedFunction: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add(actor1);
        var removeActor2 = group.add(actor2);
        group.add(actor3);

        removeActor2();
        Assert.isEqual(2, group.count);

        group.invoke0();

        Assert.isEqual(1, actor1.test.calls.length);
        Assert.isEqual(0, actor2.test.calls.length);
        Assert.isEqual(1, actor3.test.calls.length);
    },

    remove_multiple_byReturnedFunction: function () {
        var group = new ActionGroup("test");
        var actor1 = newActor("test");
        var actor2 = newActor("test");
        var actor3 = newActor("test");

        group.add(actor1);
        var removeActor2And3 = group.add([actor2, actor3]);

        removeActor2And3();
        Assert.isEqual(1, group.count);

        group.invoke0();

        Assert.isEqual(1, actor1.test.calls.length);
        Assert.isEqual(0, actor2.test.calls.length);
        Assert.isEqual(0, actor3.test.calls.length);
    }
};

})();
