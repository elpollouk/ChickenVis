Chicken.register(
"ChickenVis.UpdateLoop",
["ChickenVis.requestAnimationFrame", "Date.now"],
function (requestFrame, now) {
    "use strict";

    var FPS_WINDOW_SIZE = 10;

    var UpdateLoop = Chicken.Class(function UpdateLoop(onupdate) {
        if (!onupdate) throw new Error("No update function specified");

        // Create an update wrapper that capture both this and the onupdate function
        var updateloop = this;
        var _updateWrapper = function UpdateLoop__updateWrapper() {
            // Calculate our delta times
            var time = now();
            var dt = (time - updateloop._lastFrameTime) / 1000;
            updateloop._lastFrameTime = time;

            var buf = updateloop._fpsBuffer;
            buf.push(dt);
            if (buf.length === FPS_WINDOW_SIZE) {
                buf.shift();
            }

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
        this._fpsBuffer = [];
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
        },
        fps: {
            get: function UpdateLopp_get_Fps() {
                var totalTime = 0;
                var buf = this._fpsBuffer;
                for (var i = 0; i < buf.length; i++)
                    totalTime += buf[i];

                if (buf === 0) return 0;

                return buf.length / totalTime;
            },
            enumerable: true
        }
    });

    return UpdateLoop;
});
