(function () {
"use strict";

var frameCallback;
var time;
var dt;
var mocks = {
    "ChickenVis.requestAnimationFrame": function (callback) {
        frameCallback = callback;
    },
    "Date.now": function () {
        return time += dt;
    }
};

var nextFrame = function () {
    var cb = frameCallback;
    Assert.isNotNullOrUndefined(cb, "Frame callback function was not set");
    frameCallback = null;
    cb();
}

var UpdateLoop = Chicken.fetch("ChickenVis.UpdateLoop", mocks);

window.Tests.UpdateLoopTests = {
    beforeTest: function () {
        frameCallback = null;
        time = 0;
        dt = 33;
    },

    construct: function () {
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);

        Assert.isTrue(updater.paused);
        Assert.isSame(0, onupdate.calls.length);
    },

    construct_noCallback: function () {
        Assert.expectedException({ type: Error, message: "No update function specified" }, function () {
            new UpdateLoop();
        });
    },

    step: function () {
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);

        updater.step(1.5);
        Assert.isSame(1, onupdate.calls.length);
        Assert.arrayEqual([1.5], onupdate.calls[0]);

        updater.step(0.016);
        Assert.isSame(2, onupdate.calls.length);
        Assert.arrayEqual([0.016], onupdate.calls[1]);
    },

    unpause: function () {
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);
        updater.paused = false;

        nextFrame();
        nextFrame();
        nextFrame();

        Assert.isFalse(updater.paused);
        Assert.isSame(4, onupdate.calls.length);
        Assert.arrayEqual([0.033], onupdate.calls[0]);
        Assert.arrayEqual([0.033], onupdate.calls[1]);
        Assert.arrayEqual([0.033], onupdate.calls[2]);
        Assert.arrayEqual([0.033], onupdate.calls[3]);
    },

    unpause_whileRunning: function () {
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);
        updater.paused = false;
        updater.paused = false;

        Assert.isFalse(updater.paused);
        Assert.isSame(1, onupdate.calls.length);
    },

    pause_whileRunning: function () {
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);
        updater.paused = false;

        Assert.isNotNull(frameCallback);

        updater.paused = true;

        nextFrame();

        Assert.isSame(1, onupdate.calls.length);
        Assert.isNull(frameCallback);
    },

    fps_static: function () {
        dt = 40;
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);
        updater.paused = false;

        for (var i = 0; i < 15; i++) {
            nextFrame();
            Test.log(`FPS ${i} = ${updater.fps}`);
            Assert.isTrue(24.5 < updater.fps && updater.fps < 25.5);
        }
    },

    fps_variable: function () {
        dt = 10;
        var onupdate = Test.mockFunction();
        var updater = new UpdateLoop(onupdate);
        updater.paused = false;

        for (var i = 0; i < 15; i++) {
            nextFrame();
            dt += 5;
        }

        Test.log(`FPS ${updater.fps}`);
        Assert.isTrue(16.5 < updater.fps && updater.fps < 17.5);
    }
};

})();
