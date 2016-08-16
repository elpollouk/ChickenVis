Chicken.register(
"ChickenVis.UpdateLoop",
["ChickenVis.requestAnimationFrame", "Date.now"],
function (requestFrame, now) {
    "use strict";

    var UpdateLoop = Chicken.Class(function UpdateLoop(onupdate) {
        if (!onupdate) throw new Error("No update function specified");

        // Create an update wrapper that capture both this and the onupdate function
        var updateloop = this;
        var _updateWrapper = function UpdateLoop__updateWrapper() {
            // Calculate our delta times
            var time = now();
            var dt = (time - updateloop._lastFrameTime) / 1000;
            updateloop._lastFrameTime = time;

            if (!updateloop._paused) {
                // Call the registered update handler
                onupdate(dt);
                requestFrame(_updateWrapper);
            }
        };

        // Basic properties
        this._paused = true; // We start off paused
        this._lastTime = 0;
        this._updateWrapper = _updateWrapper;
        this._onupdate = onupdate;
    }, {
        step: function UpdateLoop_step(dt) {
            this._onupdate(dt);
        }
    }, {
        paused: {
            get: function UpdateLoop_getPaused() {
                return this._paused;
            },
            set: function UpdateLoop_setPaused(value) {
                if (value == this._paused) return value;

                this._paused = value;
                if (!value) {
                    this._lastFrameTime = now();
                    this._updateWrapper();
                }

                return value;
            },
            enumerable: true
        }
    });

    return UpdateLoop;
});
