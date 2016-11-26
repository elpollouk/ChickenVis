Chicken.register("ChickenVis.Bootstrap",
["document", "ChickenVis.Draw", "ChickenVis.UpdateLoop", "ChickenVis.FixedDeltaWrapper"],
function (document, Draw, UpdateLoop, FixedDeltaWraper) {
    "use strict";

    var Kernel = Chicken.Class(function Kernel(draw, modeHandler) {
        this.draw = draw;
        this.currentMode = modeHandler;

        var that = this;

        if (modeHandler.onUpdate) {
            if (modeHandler.updateDelta) {
                var update = FixedDeltaWraper(function (dt) {
                    modeHandler.onUpdate(that, dt);
                }, modeHandler.updateDelta);

                this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                    update(dt);
                    modeHandler.onFrame(that, dt);
                };
            }
            else {
                this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                    modeHandler.onUpdate(that, dt);
                    modeHandler.onFrame(that, dt);
                };
            }
        }
        else {
            this._updateFunc = function Kernel_onUpdateFrameTied(dt) {
                modeHandler.onFrame(that, dt);
            };
        }

        this._updateLoop = new UpdateLoop(function (dt) {
            that._updateFunc(dt);
        });

        modeHandler.onInit(this);
    }, {
        step: function Kernel_step(dt) {
            this._updateLoop.step(dt);
        }
    }, {
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
