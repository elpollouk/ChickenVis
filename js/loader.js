Chicken.register("ChickenVis.Loader", ["ChickenVis.createElement"], function (createElement) {

    var typeLoaders = {};

    var Loader = Chicken.Class(function Loader_ctor() {
        this.numReady = 0;
        this.numTotal = 0;
        this.failed = [];
        this._store = {};
    }, {
        queue: function Loader_queue(items, onStateChange) {
            var loader = this;
            loader.numTotal += items.length;

            for (var i = 0; i < items.length; i++) {
                var asset = Loader.load(items[i].source, items[i].type, function Loader_queue_onStateChange(asset) {
                    switch (asset.state) {
                        case Loader.STATE_READY:
                            loader.numReady++;
                            break;

                        case Loader.STATE_ERROR:
                            loader.failed.push(asset);
                            break;
                    }

                    onStateChange(asset, loader);
                });
                asset.id = items[i].id;
                loader._store[asset.id] = asset;
            }
        },

        getInfo: function Loader_getInfo(id) {
            return this._store[id];
        },

        getData: function Loader_getData(id) {
            var asset = this._store[id];
            if (!asset) return;
            if (asset.state !== Loader.STATE_READY) return null;

            return asset.data;
        }
    }, {}, {
        TYPE_IMAGE : "img",

        STATE_QUEUED : 0,
        STATE_READY : 1,
        STATE_ERROR : -1,

        load: function Loader_load(source, type, onStateChange) {
            var asset = {
                type: type,
                source: source,
                state: Loader.STATE_QUEUED,
                onStateChange: onStateChange
            };

            typeLoaders[type](asset);

            return asset;
        }
    });

    typeLoaders[Loader.TYPE_IMAGE] = function loadImage(asset) {
        asset.data = createElement("img");

        asset.data.src = asset.source;
        asset.data.onload = function () {
            asset.state = Loader.STATE_READY;
            asset.onStateChange(asset);
        }
        asset.data.onerror = function () {
            asset.state = Loader.STATE_ERROR;
            asset.onStateChange(asset);
        }
    }

    return Loader;
});
