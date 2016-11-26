Chicken.register("ChickenVis.Bootstrap",
["document", "ChickenVis.Draw", "ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaWrapper"],
function (document, Draw, UpdateLoop, FixedDeltaWraper) {
    "use strict";

    var Kernel = Chicken.Class(function Kernel(draw, modeHandler) {
        this.draw = draw;
        this.currentMode = modeHandler;

        var that = this;
        this._updateLoop = new UpdateLoop(function (dt) {
            that._updateFunc(dt);
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

                if (mode.onUpdate) {
                    if (mode.updateDelta) {
                        var update = FixedDeltaWraper(function (dt) {
                            mode.onUpdate(kernel, dt);
                        }, mode.updateDelta);

                        this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                            update(dt);
                            mode.onFrame(kernel, dt);
                        };
                    }
                    else {
                        this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                            mode.onUpdate(kernel, dt);
                            mode.onFrame(kernel, dt);
                        };
                    }
                }
                else {
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

    var bootstrap = function (modeHandler) {
        var body = document.body;
        var draw = new Draw(body);
        return new Kernel(draw, modeHandler);
    };

    return bootstrap;
});
