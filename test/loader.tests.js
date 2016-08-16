(function () {
"use strict";

var testCreateElement;
var createdElements;

var mocks = {
    "ChickenVis.createElement" : function (type) {
        return testCreateElement(type);
    }
};
var Loader = Chicken.fetch("ChickenVis.Loader", mocks);

window.Tests.LoaderTests = {
    beforeTest: function () {
        createdElements = [];
        testCreateElement = function (type) {
            var element =  {};
            createdElements.push(element);
            return element;
        }
    },

    construct: function () {
        var loader = new Loader();

        Assert.isSame(0, loader.numReady, "numReady not set correctly");
        Assert.isSame(0, loader.numTotal, "numTotal not set correctly");
        Assert.arrayEqual([], loader.failed, "failed list not set correctly");
    },

    load: function () {
        var asset = Loader.load("http://url", Loader.TYPE_IMAGE, function () {});

        Assert.isSame(Loader.TYPE_IMAGE, asset.type, "Asset type was wrong");
        Assert.isSame("http://url", asset.source, "Asset source was wrong");
        Assert.isSame(Loader.STATE_QUEUED, asset.state, "Asset state was wrong");
        Assert.isNotNullOrUndefined(asset.data, "Asset data object wasn't created");
        Assert.isSame(asset.source, asset.data.src, "Asset data source wasn't set correctly");
    },

    load_image_success: function () {
        var onStateChange = Test.mockFunction();

        var asset = Loader.load("http://url", Loader.TYPE_IMAGE, onStateChange);

        asset.data.onload();

        Assert.isSame(Loader.STATE_READY, asset.state, "Asset state wasn't updated c orrectly");
        Assert.isSame(1, onStateChange.calls.length, "onStateChange called wrong number of times");
        Assert.arrayEqual([asset], onStateChange.calls[0], "onStateChange called with wrong arguments");
    },

    load_image_error: function () {
        var onStateChange = Test.mockFunction();

        var asset = Loader.load("http://url", Loader.TYPE_IMAGE, onStateChange);

        asset.data.onerror();

        Assert.isSame(Loader.STATE_ERROR, asset.state, "Asset state wasn't updated c orrectly");
        Assert.isSame(1, onStateChange.calls.length, "onStateChange called wrong number of times");
        Assert.arrayEqual([asset], onStateChange.calls[0], "onStateChange called with wrong arguments");
    },

    queue: function () {
        var loader = new Loader();
        var onStateChange = Test.mockFunction();
        var items = [
            { id: 0, source: "A", type: Loader.TYPE_IMAGE },
            { id: 1, source: "B", type: Loader.TYPE_IMAGE },
            { id: 2, source: "C", type: Loader.TYPE_IMAGE },
            { id: 3, source: "D", type: Loader.TYPE_IMAGE }
        ];

        loader.queue(items, onStateChange);

        Assert.isSame(4, createdElements.length, "Wrong number of elements created");
        Assert.isSame(0, loader.numReady, "numReady not set correctly");
        Assert.isSame(4, loader.numTotal, "numTotal not set correctly");
        Assert.isSame(0, loader.failed.length, "Wrong number of failed items");

        createdElements[0].onload();
        Assert.isSame(1, loader.numReady, "numReady not set correctly");
        Assert.isSame(4, loader.numTotal, "numTotal not set correctly");
        Assert.isSame(0, loader.failed.length, "Wrong number of failed items");
        Assert.isSame(1, onStateChange.calls.length, "Wrong number of state change callbacks");
        Assert.isSame(0, onStateChange.calls[0][0].id);
        Assert.isSame(loader, onStateChange.calls[0][1]);

        createdElements[2].onload();
        Assert.isSame(2, loader.numReady, "numReady not set correctly");
        Assert.isSame(4, loader.numTotal, "numTotal not set correctly");
        Assert.isSame(0, loader.failed.length, "Wrong number of failed items");
        Assert.isSame(2, onStateChange.calls.length, "Wrong number of state change callbacks");
        Assert.isSame(2, onStateChange.calls[1][0].id);
        Assert.isSame(loader, onStateChange.calls[1][1]);

        createdElements[3].onerror();
        Assert.isSame(2, loader.numReady, "numReady not set correctly");
        Assert.isSame(4, loader.numTotal, "numTotal not set correctly");
        Assert.isSame(1, loader.failed.length, "Wrong number of failed items");
        Assert.isSame(3, loader.failed[0].id, "Wrong item logged as failed");
        Assert.isSame(3, onStateChange.calls.length, "Wrong number of state change callbacks");
        Assert.isSame(3, onStateChange.calls[2][0].id);
        Assert.isSame(loader, onStateChange.calls[2][1]);

        createdElements[1].onload();
        Assert.isSame(3, loader.numReady, "numReady not set correctly");
        Assert.isSame(4, loader.numTotal, "numTotal not set correctly");
        Assert.isSame(1, loader.failed.length, "Wrong number of failed items");
        Assert.isSame(3, loader.failed[0].id, "Wrong item logged as failed");
        Assert.isSame(4, onStateChange.calls.length, "Wrong number of state change callbacks");
        Assert.isSame(1, onStateChange.calls[3][0].id);
        Assert.isSame(loader, onStateChange.calls[3][1]);
    }
};

})();
