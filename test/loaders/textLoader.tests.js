(function () {
"use strict";

var currentRequest;
var Loader = Chicken.fetch("ChickenVis.Loader");


var mocks = {};
mocks.XMLHttpRequest = Chicken.Class(function () {
    this.onload = null;
    this.onerror = null;
    this.responseText = null;
    this._callState = "constructed";
    this._url = null;

    currentRequest = this;
}, {
    open: function (method, url, asyncRequest) {
        Assert.isEqual("constructed", this._callState);
        Assert.isNotNullOrUndefined(this.onload);
        Assert.isNotNullOrUndefined(this.onerror);
        Assert.isEqual("GET", method);
        Assert.isTrue(asyncRequest);

        this._callState = "opened";
        this._url = url;
    },

    send: function () {
        Assert.isEqual("opened", this._callState);
        Assert.isNotNullOrUndefined(this.onload);
        Assert.isNotNullOrUndefined(this.onerror);

        this._callState = "sent";
    },

    invokedLoad: function (responseText) {
        Assert.isEqual("sent", this._callState);
        this.responseText = responseText;
        this.onload();
    },

    invokeError: function () {
        this.onerror();
    }
});

mocks["ChickenVis.Loader"] = Loader;

var textLoader = Chicken.fetch("ChickenVis.Loader.textLoader", mocks);

var makeAsset = function (url, onStateChange) {
    return {
        type: Loader.TYPE_TEXT,
        source: url,
        state: Loader.STATE_QUEUED,
        onStateChange: onStateChange
    }
}

window.Tests.TextLoaderTests = {
    beforeTest: function () {
        currentRequest = null;
    },

    loadSuccess: function () {
        var fileUrl = "test.txt";
        var fileContent = "Hello World";
        var callCount = 0;

        var asset = Loader.load(fileUrl, Loader.TYPE_TEXT, function (loaderAsset) {
            Assert.isSame(asset, loaderAsset);
            Assert.isSame(Loader.STATE_READY, asset.state);
            callCount++;
        });

        Assert.isSame(fileUrl, currentRequest._url);
        currentRequest.invokedLoad(fileContent);
        Assert.isSame(1, callCount);
        Assert.isSame(Loader.STATE_READY, asset.state);
        Assert.isSame(fileContent, asset.data);
    },

    loadError: function () {
        var fileUrl = "foo.txt";
        var callCount = 0;

        var asset =Loader.load(fileUrl, Loader.TYPE_TEXT, function (loaderAsset) {
            Assert.isSame(asset, loaderAsset);
            Assert.isSame(Loader.STATE_ERROR, loaderAsset.state);
            callCount++;
        });

        Assert.isSame(fileUrl, currentRequest._url);
        currentRequest.invokeError();
        Assert.isSame(1, callCount);
        Assert.isSame(Loader.STATE_ERROR, asset.state);
        Assert.isNullOrUndefined(asset.data);
    },
};

})();
