(function () {
	"use strict";

	var debugViewPort = function TileMap_debugViewPort(ctx, x, y, w, h) {
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.strokeStyle = "black";
		ctx.stroke();
	};

	Utils.registerClass("Drawing.TileMap", function TileMap(spec) {
		// Lets do some checks first
		if (spec.mapArray.length < (spec.mapWidth * spec.mapHeight)) throw new Error("mapArray is too short for required map size");

		this._pallette		= spec.pallette;
		this._mapWidth		= spec.mapWidth;
		this._mapHeight		= spec.mapHeight;
		this._tileWidth		= spec.tileWidth;
		this._tileHeight	= spec.tileHeight;
		this._viewWidth		= spec.viewWidth;
		this._viewHeight	= spec.viewHeight;
		this._x				= spec.x;
		this._y				= spec.y;
		this._map			= spec.mapArray;

		this._maxViewX		= ((spec.mapWidth) * spec.tileWidth) - spec.viewWidth;
		this._maxViewY		= ((spec.mapHeight) * spec.tileHeight) - spec.viewHeight;

		this._viewTileWidth = Math.ceil(this._viewWidth / this._tileWidth) + 1;
		this._viewTileHeight = Math.ceil(this._viewHeight / this._tileHeight) + 1;
		this._drawBuffer = new Array(this._viewTileWidth * this._viewTileHeight);
		this._stride = (this._mapWidth - this._viewTileWidth);

		this.scrollTo(0, 0);
	}, {
		scrollTo: function TileMap_scrollTo(x, y) {
			if (x < 0) {
				x = 0;
			} else if (x > this._maxViewX) {
				x = this._maxViewX;
			}
			if (y < 0) {
				y = 0;
			} else if (y > this._maxViewY) {
				y = this._maxViewY;
			}

			this._viewX = x;
			this._viewY = y;
			this._viewTileX = Math.floor(x / this._tileWidth);
			this._viewTileY = Math.floor(y / this._tileHeight);
			this._renderOffsetX = x % this._tileWidth;
			this._renderOffsetY = y % this._tileHeight;
		},

		scrollBy: function TileMap_scrollBy(x, y) {
			this.scrollTo(this._viewX + x, this._viewY + y);
		},

		_clip: function TileMap__clip(ctx) {
			var x = this._x;
			var y = this._y;
			var w = this._viewWidth;
			var h = this._viewHeight;
			ctx.beginPath();
			ctx.rect(x, y, w, h);
			ctx.clip();
		},

		render: function TileMap_render() {
			// The start position
			var x = this._x;
			var y = this._y;
			// The size of the tile difines how much we increment x and y by
			var stepX = this._tileWidth;
			var stepY = this._tileHeight;

			// The indexes of the tile to render and the width and height of the view port in tiles
			var mapWidth = this._mapWidth;
			var currentTile = (this._viewTileY * mapWidth) + this._viewTileX;
			var viewTileWidth = this._viewTileWidth;
			var viewTileHeight = this._viewTileHeight;
			var stride = this._stride;

			var map = this._map;
			var ctx = this._pallette.context;

			var drawlist = this._drawBuffer;
			var drawListLength = 0;
			ctx.save();

			this._clip(ctx);

			// Adjust the x and y values based on the offsets calculated in scrollTo()
			x -= this._renderOffsetX;
			y -= this._renderOffsetY;
			var cX = x;
			var cY = y;

			// Build our display list
			for (var i = 0; i < viewTileHeight; i++) {
				for (var j = 0; j < viewTileWidth; j++) {
					if (currentTile >= map.length) break;
					var id = map[currentTile];
					if (id === null) continue;

					drawlist[drawListLength++] = {
						id: id,
						x: cX,
						y: cY,
						w: stepX,
						h: stepY
					};
					cX += stepX;
					currentTile++;
				}
				cY += stepY;
				cX = x;
				currentTile += stride;
			}

			this._pallette.drawArray(drawlist, drawListLength);

			//debugViewPort(ctx, this._x, this._y, this._viewWidth, this._viewHeight);

			ctx.restore();
		},

		getTileIndexAt: function TileMap_getTileIndexAt(x, y) {
			if (x < this.x || x >= (this._x + this._viewWidth)) return -1;
			if (y < this.y || y >= (this._y + this._viewHeight)) return -1;

			x -= this._x;
			y -= this._y;
			x += this._renderOffsetX;
			y += this._renderOffsetY;
			var tileX = this._viewTileX + Math.floor(x / this._tileWidth);
			var tileY = this._viewTileY + Math.floor(y / this._tileWidth);

			var idx = (tileY * this._mapWidth) + tileX;

			if (idx >= this._map.length) return -1;
			return idx;
		}
	}, {
		mapWidth: {
			get: function TileMap_mapWidth_get() {
				return this._mapWidth;
			},
			enumerable: true
		},
		mapHeight: {
			get: function TileMap_mapHeight_get() {
				return this._mapHeight;
			},
			enumerable: true
		},
		map: {
			get: function TileMap_map_get() {
				return this._map;
			},
			enumerable: true
		},
		pallette: {
			get: function TileMap_pallette_get() {
				return this._pallette;
			},
			enumerable: true
		}
	})
})();