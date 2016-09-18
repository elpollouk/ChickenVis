(function () {
	"use strict";

	// Mock render targets and spies
	var mockDrawing;
	var mockCanvas;
	var mockContext;
	var contextDrawImageSpy;
	var canvasGetContextSpy;

	// Mock image
	var mockImage = "mock image";

	var SpritePallette = Chicken.fetch("ChickenVis.SpritePallette");


	var newPallette = function newPallette(map) {
		return new SpritePallette(mockImage, map, mockCanvas);
	};

	var newSprite = function newSprite(x, y, w, h) {
		return  {
			x: x,
			y: y,
			w: w,
			h: h
		};
	};

	var verifyDrawCall = function verifyDrawCall(sprite, target, args) {
		Assert.arrayEqual([
			mockImage,
			sprite.x,
			sprite.y,
			sprite.w,
			sprite.h,
			target.x,
			target.y,
			target.w || sprite.w,
			target.h || sprite.h
		], args);
	};


	window.Tests.SpritePalletteTests = {
		beforeTest: function () {
			// Set up all our mocks
			mockContext = {
				drawImage: function mockContext_drawImage() {}
			}
			mockCanvas = {
				getContext: function mockCanvas_getContext(type) {
					Assert.isEqual("2d", type);
					return mockContext;
				}
			}
			mockDrawing = {
				context: mockContext
			}

			// And the spies
			contextDrawImageSpy = Test.spy(mockContext, "drawImage");
			canvasGetContextSpy = Test.spy(mockCanvas, "getContext");
		},

		construct_withContext: function () {
			var map = {};

			var p = new SpritePallette(mockImage, map, mockContext);

			Assert.isSame(mockImage, p.img);
			Assert.isSame(map, p.map);
			Assert.isSame(mockContext, p.target);
			Assert.isSame(mockContext, p.context);
		},

		construct_withCanvas: function () {
			var map = {};

			var p = new SpritePallette(mockImage, map, mockCanvas);

			Assert.isSame(mockImage, p.img);
			Assert.isSame(map, p.map);
			Assert.isSame(mockCanvas, p.target);
			Assert.isSame(mockContext, p.context);
			Assert.isEqual(1, canvasGetContextSpy.calls.length);
		},

		construct_withDrawing: function () {
			var map = {};

			var p = new SpritePallette(mockImage, map, mockDrawing);

			Assert.isSame(mockImage, p.img);
			Assert.isSame(map, p.map);
			Assert.isSame(mockDrawing, p.target);
			Assert.isSame(mockContext, p.context);
		},

		construct_withInvalidTarget: function () {
			var map = {};

			try {
				var p = new SpritePallette(mockImage, map, {});
				Assert.fail("Exception was not thrown");
			}
			catch (ex) {

			}
		},

		hasSprite_dictionaryKey: function () {
			var p = newPallette({
				"foo" : {},
				"bar" : {}
			});

			Assert.isTrue(p.hasSprite("foo"));
			Assert.isTrue(p.hasSprite("bar"));
			Assert.isFalse(p.hasSprite("baz"));
		},

		hasSprite_arrayIndex: function () {
			var p = newPallette([
				{},
				{},
				{}
			]);

			Assert.isTrue(p.hasSprite(0));
			Assert.isTrue(p.hasSprite(1));
			Assert.isTrue(p.hasSprite(2));
			Assert.isFalse(p.hasSprite(3));
		},

		draw_dictionaryKey_targetSizeSpecified: function () {
			var spriteX = 1, spriteY = 2, spriteWidth = 3, spriteHeight = 4;
			var targetX = 5, targetY = 6, targetWidth = 7, targetHeight = 8;

			var p = newPallette({
				"bob" : newSprite(spriteX, spriteY, spriteWidth, spriteHeight),
				"dave": newSprite(-1, -1, -1, -1)
			});

			p.draw("bob", targetX, targetY, targetWidth, targetHeight);

			Assert.isEqual(1, contextDrawImageSpy.calls.length);
			var args = contextDrawImageSpy.calls[0];
			Assert.arrayEqual([
				mockImage,
				spriteX,
				spriteY,
				spriteWidth,
				spriteHeight,
				targetX,
				targetY,
				targetWidth,
				targetHeight
			], args);
		},

		draw_dictionaryKey_targetSizeDefault: function () {
			var spriteX = 11, spriteY = 12, spriteWidth = 13, spriteHeight = 14;
			var targetX = 15, targetY = 16;

			var p = newPallette({
				"bob": newSprite(spriteX, spriteY, spriteWidth, spriteHeight),
				"dave": newSprite(-1, -1, -1, -1)
			});

			p.draw("bob", targetX, targetY);

			Assert.isEqual(1, contextDrawImageSpy.calls.length);
			var args = contextDrawImageSpy.calls[0];
			Assert.arrayEqual([
				mockImage,
				spriteX,
				spriteY,
				spriteWidth,
				spriteHeight,
				targetX,
				targetY,
				spriteWidth,
				spriteHeight
			], args);
		},

		draw_arrayIndex_targetSizeSpecified: function () {
			var spriteX = 21, spriteY = 22, spriteWidth = 23, spriteHeight = 24;
			var targetX = 25, targetY = 26, targetWidth = 27, targetHeight = 28;

			var p = newPallette([
				newSprite(spriteX, spriteY, spriteWidth, spriteHeight),
				newSprite(-1, -1, -1, -1)
			]);

			p.draw(0, targetX, targetY, targetWidth, targetHeight);

			Assert.isEqual(1, contextDrawImageSpy.calls.length);
			var args = contextDrawImageSpy.calls[0];
			Assert.arrayEqual([
				mockImage,
				spriteX,
				spriteY,
				spriteWidth,
				spriteHeight,
				targetX,
				targetY,
				targetWidth,
				targetHeight
			], args);
		},

		draw_arrayIndex_targetSizeDefault: function () {
			var spriteX = 31, spriteY = 32, spriteWidth = 33, spriteHeight = 34;
			var targetX = 35, targetY = 36;

			var p = newPallette([
				newSprite(-1, -1, -1, -1),
				newSprite(spriteX, spriteY, spriteWidth, spriteHeight)
			]);

			p.draw(1, targetX, targetY);

			Assert.isEqual(1, contextDrawImageSpy.calls.length);
			var args = contextDrawImageSpy.calls[0];
			Assert.arrayEqual([
				mockImage,
				spriteX,
				spriteY,
				spriteWidth,
				spriteHeight,
				targetX,
				targetY,
				spriteWidth,
				spriteHeight
			], args);
		},

		drawArray_dictionaryKey_targetSizeSpecified: function () {
			var sprite1 = newSprite(1,  2,  3,  4);
			var sprite2 = newSprite(5,  6,  7,  8);
			var sprite3 = newSprite(9, 10, 11, 12);
			var target1 = {id:"c", x:100, y:101, w:102, h:103};
			var target2 = {id:"b", x:104, y:105, w:106, h:107};
			var target3 = {id:"a", x:108, y:109, w:110, h:111};
			var target4 = {id:"b", x:112, y:113, w:114, h:115};

			var p = newPallette({
				"a": sprite1,
				"b": sprite2,
				"c": sprite3
			});

			p.drawArray([
				target1,
				target2,
				target3,
				target4
			]);

			Assert.isEqual(4, contextDrawImageSpy.calls.length);
			verifyDrawCall(sprite3, target1, contextDrawImageSpy.calls[0]);
			verifyDrawCall(sprite2, target2, contextDrawImageSpy.calls[1]);
			verifyDrawCall(sprite1, target3, contextDrawImageSpy.calls[2]);
			verifyDrawCall(sprite2, target4, contextDrawImageSpy.calls[3]);
		},

		drawArray_dictionaryKey_targetSizeDefault: function () {
			var sprite1 = newSprite(11, 12, 13, 14);
			var sprite2 = newSprite(15, 16, 17, 18);
			var sprite3 = newSprite(19, 20, 21, 22);
			var target1 = {id:"c", x:200, y:201};
			var target2 = {id:"b", x:204, y:205};
			var target3 = {id:"a", x:208, y:209};
			var target4 = {id:"b", x:212, y:213};

			var p = newPallette({
				"a": sprite1,
				"b": sprite2,
				"c": sprite3
			});

			p.drawArray([
				target1,
				target2,
				target3,
				target4
			]);

			Assert.isEqual(4, contextDrawImageSpy.calls.length);
			verifyDrawCall(sprite3, target1, contextDrawImageSpy.calls[0]);
			verifyDrawCall(sprite2, target2, contextDrawImageSpy.calls[1]);
			verifyDrawCall(sprite1, target3, contextDrawImageSpy.calls[2]);
			verifyDrawCall(sprite2, target4, contextDrawImageSpy.calls[3]);
		},

		drawArray_arrayIndex_targetSizeSpecified: function () {
			var sprite1 = newSprite(1,  2,  3,  4);
			var sprite2 = newSprite(5,  6,  7,  8);
			var sprite3 = newSprite(9, 10, 11, 12);
			var target1 = {id:2, x:100, y:101, w:102, h:103};
			var target2 = {id:1, x:104, y:105, w:106, h:107};
			var target3 = {id:0, x:108, y:109, w:110, h:111};
			var target4 = {id:1, x:112, y:113, w:114, h:115};

			var p = newPallette([
				sprite1,
				sprite2,
				sprite3
			]);

			p.drawArray([
				target1,
				target2,
				target3,
				target4
			]);

			Assert.isEqual(4, contextDrawImageSpy.calls.length);
			verifyDrawCall(sprite3, target1, contextDrawImageSpy.calls[0]);
			verifyDrawCall(sprite2, target2, contextDrawImageSpy.calls[1]);
			verifyDrawCall(sprite1, target3, contextDrawImageSpy.calls[2]);
			verifyDrawCall(sprite2, target4, contextDrawImageSpy.calls[3]);
		},

		drawArray_arrayIndex_targetSizeDefault: function () {
			var sprite1 = newSprite(11, 12, 13, 14);
			var sprite2 = newSprite(15, 16, 17, 18);
			var sprite3 = newSprite(19, 20, 21, 22);
			var target1 = {id:2, x:200, y:201};
			var target2 = {id:1, x:204, y:205};
			var target3 = {id:0, x:208, y:209};
			var target4 = {id:1, x:212, y:213};

			var p = newPallette([
				sprite1,
				sprite2,
				sprite3
			]);

			p.drawArray([
				target1,
				target2,
				target3,
				target4
			]);

			Assert.isEqual(4, contextDrawImageSpy.calls.length);
			verifyDrawCall(sprite3, target1, contextDrawImageSpy.calls[0]);
			verifyDrawCall(sprite2, target2, contextDrawImageSpy.calls[1]);
			verifyDrawCall(sprite1, target3, contextDrawImageSpy.calls[2]);
			verifyDrawCall(sprite2, target4, contextDrawImageSpy.calls[3]);
		},

		drawArray_arrayIndex_lengthSpecified: function () {
			var sprite1 = newSprite(1,  2,  3,  4);
			var sprite2 = newSprite(5,  6,  7,  8);
			var sprite3 = newSprite(9, 10, 11, 12);
			var target1 = {id:2, x:100, y:101, w:102, h:103};
			var target2 = {id:1, x:104, y:105, w:106, h:107};
			var target3 = {id:0, x:108, y:109, w:110, h:111};
			var target4 = {id:1, x:112, y:113, w:114, h:115};
			var drawLength = 2;

			var p = newPallette([
				sprite1,
				sprite2,
				sprite3
			]);

			p.drawArray([
				target1,
				target2,
				target3,
				target4
			], drawLength);

			Assert.isEqual(drawLength, contextDrawImageSpy.calls.length);
			verifyDrawCall(sprite3, target1, contextDrawImageSpy.calls[0]);
			verifyDrawCall(sprite2, target2, contextDrawImageSpy.calls[1]);
		},
	};
})();
