Chicken.register("ChickenVis.AnimatedSprite", ["ChickenVis.FixedDeltaUpdater"], function (Updater) {
    "use strict";

    var AnimatedSprite = Chicken.Class(function AnimatedSprite(image, spec) {
        this._image = image;
        this._frameX = 0;
        this._frameWidth = spec.frameWidth;
        this._frameHeight = spec.frameHeight;
        this._renderWidth = spec.renderWidth || this._frameWidth;
        this._renderHeight = spec.renderHeight || this._frameHeight;
        this._maxFrameX = this._frameWidth * spec.numFrames;

        var that = this;
        this._updater = new Updater(function () {
            that._frameX += that._frameWidth;
            if (that._frameX >= that._maxFrameX) that._frameX = 0;
        }, spec.frameTime);

    }, {
        update: function AnimatedSprite_update(dt) {
            this._updater.update(dt);
        },

        render: function AnimatedSprite_render(drawApi) {
            drawApi.imageEx(this._image, this._frameX, 0, this._frameWidth, this._frameHeight, 0, 0, this._renderWidth, this._renderHeight);
        }
    });

    return AnimatedSprite;

});
