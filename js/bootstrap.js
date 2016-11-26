Chicken.register("ChickenVis.Bootstrap",
["document", "ChickenVis.Draw", "ChickenVis.UpdateLoop"],
function (document, Draw, UpdateLoop) {
    "use strict";

    var Kernel = Chicken.Class(function Kernel(draw, modeHandler) {
        this.draw = draw;
        this.currentMode = modeHandler;

        var that = this;
        this._updateLoop = new UpdateLoop(function Kernel_onUpdate(dt) {
            var mode = that.currentMode;
            mode.onUpdate && mode.onUpdate(that, dt);
            mode.onFrame(that, dt);
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
