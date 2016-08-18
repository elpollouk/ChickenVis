Chicken.register("ChickenVis.Draw",
["ChickenVis.resolveElement"],
function (resolveElement) {
    "use strict";

    var DEFAULT_COLOUR    = "black";
    var DEFAULT_FONT    = "10px Courier";
    var TWO_PI            = 2 * Math.PI;

    var _supressSelection = function _supressSelection() {
        return false;
    }

    var Draw = Chicken.Class(function Draw(container, width, height) {
        container = resolveElement(container);
        this._width = width || container.clientWidth;
        this._height = height || container.clientHeight;
        this._originX = 0;
        this._originY = 0;

        this._canvas = document.createElement("canvas");
        this._canvas.setAttribute("width", this._width);
        this._canvas.setAttribute("height", this._height);
        this._canvas.onselectstart = _supressSelection;
        container.appendChild(this._canvas);

        this._ctx = this._canvas.getContext("2d");

        this._ctx.textBaseline = "top";
    },
    {
        setOrigin: function Draw_setOrigin(x, y) {
            // We store the negative of the origin as we use that when clearing and so saves an operation there
            this._originX = -x;
            this._originY = -y;
            this._ctx.translate(x, y);
        },

        line: function Draw_line(x1, y1, x2, y2, colour) {
            colour = colour || DEFAULT_COLOUR;
            this._ctx.beginPath();
            this._ctx.moveTo(x1, y1);
            this._ctx.lineTo(x2, y2);
            this._ctx.strokeStyle = colour;
            this._ctx.stroke();
        },

        path: function Draw_path(path, colour) {
            colour = colour || DEFAULT_COLOUR;
            var ctx = this._ctx;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);

            var l = path.length;
            for (var i = 1; i < l; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }

            ctx.strokeStyle = colour;
            ctx.stroke();
        },

        circle: function Draw_circle(x, y, r, colour, outline) {
            colour = colour || DEFAULT_COLOUR;

            this._ctx.beginPath();
            this._ctx.arc(x, y, r, 0, TWO_PI);

            if (outline) {
                this._ctx.strokeStyle = colour;
                this._ctx.stroke();
            }
            else {
                this._ctx.fillStyle = colour;
                this._ctx.fill();
            }
        },

        rect: function Draw_rect(x, y, w, h, colour, outline) {
            colour = colour || DEFAULT_COLOUR;

            if (outline) {
                this._ctx.beginPath();
                this._ctx.rect(x, y, w, h);
                this._ctx.strokeStyle = colour;
                this._ctx.stroke();
            }
            else {
                this._ctx.fillStyle = colour;
                this._ctx.fillRect(x, y, w, h);
            }
        },

        image: function Draw_image(src, dstX, dstY) {
            this._ctx.drawImage(src, dstX, dstY);
        },

        imageEx: function Draw_imageEx(src, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight) {
            this._ctx.drawImage(src, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);
        },

        text: function Draw_text(text, x, y, colour, font) {
            colour = colour || DEFAULT_COLOUR;
            font = font || DEFAULT_FONT;

            this._ctx.font = font;
            this._ctx.fillStyle = colour;
            this._ctx.fillText(text, x, y);
        },

        clear: function Draw_clear() {
            this._ctx.clearRect(this._originX, this._originY, this._width, this._height);
        },

        save: function Draw_save() {
            this._ctx.save();
        },

        restore: function Draw_restore() {
            this._ctx.restore();
        },

        translate: function Draw_translate(x, y) {
            this._ctx.translate(x, y);
        },

        rotate: function Draw_rotate(rads) {
            this._ctx.rotate(rads);
        },

        scale: function Draw_scale(x, y) {
            this._ctx.scale(x, y || x);
        }
    }, {
        canvas: {
            get: function Draw_getCanvas() {
                return this._canvas;
            },
            enumerable: true
        },
        context: {
            get: function Draw_getContext() {
                return this._ctx;
            },
            enumerable: true
        },
        width: {
            get: function Draw_getWidth() {
                return this._width;
            },
            enumerable: true
        },
        height: {
            get: function Draw_getHeight() {
                return this._height;
            },
            enumerable: true
        }
    });

    return Draw;
});
