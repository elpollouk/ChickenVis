(function () {
    "use strict";

    var CanvasTestBed = function CanvasTestBed (canvas, context) {
        this.rootElement = document.createElement("div");
        this.canvas = canvas || document.createElement("canvas");
        this.context = context || this.canvas.getContext("2d");
        this._expectedImage = document.createElement("img");
        this._diffCanvas = document.createElement("canvas");
        this._view = -1;

        var canvasContainer = document.createElement("div");
        canvasContainer.style.display = "inline-block";
        canvasContainer.style.padding = "5px";

        this.canvas.style.border = "1px solid gray";
        this._expectedImage.style.border = "1px solid lightgreen";
        this._diffCanvas.style.border = "1px solid orange";

        canvasContainer.appendChild(this.canvas);
        canvasContainer.appendChild(this._expectedImage);
        canvasContainer.appendChild(this._diffCanvas);

        this._controlsContainer = document.createElement("div");
        this._controlsContainer.style.display = "inline-block";

        this.rootElement.appendChild(canvasContainer);
        this.rootElement.appendChild(this._controlsContainer);

        var that = this;
        this.addCommand("Copy Canvas", function () {
            that.copyCanvasImageUri();
        });
        this.addCommand("Next View", function () {
            that.nextView();
        });

        this.nextView();
    };

    CanvasTestBed.prototype.addCommand = function CanvasTestBed_addCommand(title, action) {
        var container = document.createElement("div");
        var control = document.createElement("a");
        control.innerText = title;
        control.onclick = function () {
            action();
            return false;
        };
        control.href = "#";

        container.appendChild(control);
        this._controlsContainer.appendChild(container);
    };

    CanvasTestBed.prototype.nextView = function CanvasTestBed_nextView() {
        this._view++;
        if (this._view === 3) this._view = 0;

        this.canvas.style.display = (this._view == 0) ? "block" : "none";
        this._expectedImage.style.display = (this._view == 1) ? "block" : "none";
        this._diffCanvas.style.display = (this._view == 2) ? "block" : "none";
    };

    CanvasTestBed.prototype.copyCanvasImageUri = function CanvasTestBed_copyCanvasImageUri() {
        var uri = this.canvas.toDataURL();

        var copyTarget = document.createElement("textarea");
        document.body.appendChild(copyTarget);

        copyTarget.value = uri;
        copyTarget.select();
        document.execCommand('copy');

        document.body.removeChild(copyTarget);
    };

    CanvasTestBed.prototype.setExpected = function CanvasTestBed_setExpected(uri) {
        this._expectedImage.src = uri;
    };

    CanvasTestBed.prototype.verify = function CanvasTestBed_verify(pixelThreshold, imageThreshold) {
        pixelThreshold = pixelThreshold || 0.01;
        imageThreshold = imageThreshold || 0;

        var diff = this._diffCanvas;
        diff.width = this.canvas.width;
        diff.height = this.canvas.height;
        var diffCtx = diff.getContext("2d");

        var fail = function (message) {
            Assert.fail(message);
        };

        if (diff.width != this._expectedImage.width) fail("Expected image width to be " + this._expectedImage.width + ", actual width was " + diff.width);
        if (diff.height != this._expectedImage.height) fail("Expected image height to be " + this._expectedImage.height + ", actual height was " + diff.height);

        diffCtx.drawImage(this._expectedImage, 0, 0);

        var actualImage = this.context.getImageData(0, 0, diff.width, diff.height).data;
        var diffData = diffCtx.getImageData(0, 0, diff.width, diff.height);
        var expectedImage = diffData.data;
        var diffImage = expectedImage;

        var failedPixelCount = 0;

        for (var i = 0; i < actualImage.length; i += 4) {
            var ar = actualImage[i];
            var ag = actualImage[i+1];
            var ab = actualImage[i+2];
            var aa = actualImage[i+3];
            var er = expectedImage[i];
            var eg = expectedImage[i+1];
            var eb = expectedImage[i+2];
            var ea = expectedImage[i+3];

            var dr = Math.abs(er - ar);
            var dg = Math.abs(eg - ag);
            var db = Math.abs(eb - ab);
            var da = Math.abs(ea - aa);

            diffImage[i] = dr + da;
            diffImage[i+1] = dg;
            diffImage[i+2] = db;
            diffImage[i+3] = 255;

            if ((pixelThreshold < dr/255)
             || (pixelThreshold < dg/255)
             || (pixelThreshold < db/255)
             || (pixelThreshold < da/255)) failedPixelCount++;
        }

        diffCtx.putImageData(diffData, 0, 0);

        var totalPixels = actualImage.length / 4;
        if (imageThreshold < failedPixelCount / totalPixels) fail(failedPixelCount + " (" + (failedPixelCount / totalPixels) + ") failed pixels exceeds image threshold of " + imageThreshold);
    };


    // Export globally
    window.CanvasTestBed = CanvasTestBed;

})();
