Chicken.register("ChickenVis.Bootstrap",
["window", "document", "ChickenVis.Draw", "ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaWrapper"],
function (window, document, Draw, UpdateLoop, FixedDeltaWraper) {
    "use strict";

    var Kernel = Chicken.Class(function Kernel(draw, mode) {
        this.draw = draw;
        this.currentMode = mode;

        var kernel = this;
        this._updateLoop = new UpdateLoop(function (dt) {
            // Update func is set in currentMode.set
            kernel._updateFunc(dt);
        });
    }, {
        step: function Kernel_step(dt) {
            this._updateLoop.step(dt);
        }
    }, {
        currentMode: {
            get: function Kernel_get_currentMode() {
                return this._currentMode;
            },
            set: function Kernel_set_currentMode(mode) {
                this._currentMode && this._currentMode.onShutdown && this._currentMode.onShutdown(this);
                this._currentMode = mode;
                var kernel = this;

                // For efficiency, create an update function that specific the the update requirements of the currentMode
                if (mode.onUpdate) {
                    if (mode.updateDelta) {
                        // Update function should fix on a fixed delta interval
                        var update = FixedDeltaWraper(function (dt) {
                            mode.onUpdate(kernel, dt);
                        }, mode.updateDelta);

                        this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                            update(dt);
                            mode.onFrame(kernel, dt);
                        };
                    }
                    else {
                        // Update function should fire at same frquency as the frame rate
                        this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                            mode.onUpdate(kernel, dt);
                            mode.onFrame(kernel, dt);
                        };
                    }
                }
                else {
                    // No specific update function, so only invoke the frame handler
                    this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                        mode.onFrame(kernel, dt);
                    };
                }

                mode.onInit && mode.onInit(this);
            }
        },
        paused: {
            get: function Kernel_get_Paused() {
                return this._updateLoop.paused;
            },
            set: function Kernel_set_Paused(value) {
                this._updateLoop.paused = value;
                return value;
            },
            enumerable: true
        },
        fps: {
            get: function Kernel_get_Fps() {
                return this._updateLoop.fps;
            },
            enumerable: true
        }
    });

    var bootstrap = function Bootstrap(modeHandler) {
        var body = document.body;
        var draw = new Draw(body);
        // Styling on the body to remove any space around the canvas
        body.style.padding = "0";
        body.style.margin = "0";
        // Style the canvas so that it always fills its parent no matter it's resolution
        // This avoids problems shrinking the window that causes scroll bars to eat into the
        // body size causing the canvas to be shrunk too much
        draw.canvas.style.width = "100%";
        draw.canvas.style.height = "100%";

        var kernel = new Kernel(draw, modeHandler);

        // Hook in a resize handler so that the canvas always fills the available space
        window.onresize = function Bootstrap_onresize() {
            kernel.draw.resize(body.clientWidth, body.clientHeight);
        };

        return kernel;
    };

    return bootstrap;
});
