Chicken.register("ChickenVis.FixedDeltaWrapper", ["ChickenVis.FixedDeltaUpdater"], function (Updater) {
    "use strict";

    return function _FixedDeltaWrapper(onupdate, deltaTime) {
        var updater = new Updater(onupdate, deltaTime);
        return function _wrappedUpdate(dt) {
            updater.update(dt);
        };
    };
});
