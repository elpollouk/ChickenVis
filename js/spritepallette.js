Chicken.register("ChickenVis.SpritePallette", [], function () {
	"use strict";

	var SpritePallette = Chicken.Class(function SpritePallette(img, map, target) {
		this._img = img;
		this._map = map;
		this._target = target;

		// Detect what the target is
		this._ctx = target.context; // ChickenVis.Draw
		if (!this._ctx && target.getContext) {
			// Canvas element
			this._ctx =  target.getContext("2d");
		}
		if (!this._ctx && target.drawImage) {
			// A drawing context
			this._ctx = target;
		}
		if (!this._ctx) throw new Error("Unable to determine target type");
	}, {
		// This function will go bang if a sprite with the specified id doesn't exist
		draw: function SpritePallette_draw(id, x, y, w, h) {
			var sprite = this._map[id];
			w = w || sprite.w;
			h = h || sprite.h;
			this._ctx.drawImage(this._img, sprite.x, sprite.y, sprite.w, sprite.h, x, y, w, h);
		},

		// Allows a number of draw requests to be batched up so that we don't need to deref a bunch of instance
		// vars with each call. I'm also hoping that jitters may also do something clever with caches
		drawArray: function SpritePallette_drawArray(requests, length) {
			var ctx = this._ctx;
			var map = this._map;
			var img = this._img;
			var drawRequest, sprite, w, h;

			length = length || requests.length;
			for (var i = 0; i < length; i++) {
				drawRequest = requests[i];
				sprite = map[drawRequest.id];
				w = drawRequest.w || sprite.w;
				h = drawRequest.h || sprite.h;
				ctx.drawImage(img, sprite.x, sprite.y, sprite.w, sprite.h, drawRequest.x, drawRequest.y, w, h);
			}
		},

		hasSprite: function SpritePallette_hasSprite(id) {
			return (id in this._map);
		}
	}, {
		img: {
			get: function SpritePallette_img_get() {
				return this._img;
			},
			enumerable: true
		},

		map: {
			get: function SpritePallette_map_get() {
				return this._map;
			},
			enumerable: true
		},

		target: {
			get: function SpritePallette_target_get() {
				return this._target;
			},
			enumerable: true
		},

		context: {
			get: function SpritePallette_context_get() {
				return this._ctx;
			},
			enumerable: true
		}
	});

	return SpritePallette;
});
