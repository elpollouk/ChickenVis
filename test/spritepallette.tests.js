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

	function newCanvas(width, height) {
		width = width || 100;
		height = height || 50;

		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		return canvas;
	}

	function initTestbed(expectedImage, map) {
		var canvas = newCanvas();
		var sp = new SpritePallette(testImage, map, canvas);
		testbed = new CanvasTestBed(canvas, sp.context);

		if (expectedImage) testbed.setExpected(expectedImage);
		Test.log(testbed.rootElement);

		return sp;
	}

	var testbed;

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

		draw_dictionary_visual: function () {
			var sp = initTestbed("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAE6UlEQVR4Xu2cXWwUVRSAvwVC0lajpQZj0tikxUAkTU2BFKU1sUbatJkX02gBm0islkV8kOA2SiKgEWzB6otLqzWYSCy1tU/Q1D5S+iDWGNvgHwF8MIhRQGMTApasuTN2d7p0d+703s2w653H7jnn3jnfPefMOTNpKAYxbuMrBKHbeHvatxYyQLT7VMmgAaLkPv3KBoh+nypZNECU3Kdf2QDR71MliwaIkvv0Kxsg+n2qZNEAUXKffmVtQKyA28vjKwPewE8hLQ2sAaLrkBsgcz1pIsTtjyVLsP6Z0XXWFmTHAJl126JFsGwZ1u9/LMiRupQMkFlPFhZCbS3W4Oe6fLsgOwaIiIySEqiqgro6rGe3+nbkg1TTyA4q2cgdFNr6v3KObxhliEP8xnlpmwsBUr0GdmyBjdVQeJez1Bdj8PEQHBuWXtoRDLyoL10KTU0QDkNlJVZ+ga87CBOlgXBanU42McYxKbt+gUT3QHhzatMTU1DfCpf/lFo+YCDFxdDSAo2NsGoV5Odj5eVL7hxaeIuneE1Kvp0avuOUp6wfIJFW6HjF06QdLQKK1BVohKxeDQcO2LWD6Wm4cAFr/cNS+76XUno5Z8tOc5UB3macwXh6WkMDW9jHA6y1Zc4ywU7WedqWBVJ0N5wddVLU1b9g+144PQnnfwHx2xOPQHRvIoU1Pg/DJz2XDzhCysuhqws2bIDxcRgYwOr5QGLX8CQRttJhy6Y6/XdSxDt8yX2U2XKtlHnWE1kgzQ3Q966z1ZrNcOrrW7ctasvYp87f93fD7v/k095goBFSWgptbXDjBkxOwtQU1vc/SAHZxwiV1NnF+wVWpNSpp40X6U4Lzq0sC0Rqk0DsR0dSOm0FCqSoyHm6OnMGLl2C69fRPcsST2AdjAUOJDsiZPFiyMuzQTAzA7GYdiDuwm9JfHiiM0IaHoUTH6ZPa7dEWqARMk/c64wQdw05ST8HafbMNDqAlBZDU33iCUw6OsTuchmIu0d5iYf4mW8zCmS+x+BNL/tsDnMViBvG+2xjhB5PGEJAJUIEkNr1zjIrSqDs/sQTVtcRyeYwF4G4YQxzmMNsl4KhCiR5EVFDjh5yehHRsa9rkthGLgERNeMZ3oyPUvzC0A1E2HP3IlLpK1eAiM69nf54Z/4Z+/mE3RJHcq6ISspKtdhXg7C2HPpPQPNOjy3lAhAxJtnF0fik188wMdk9mQAy0gt1NZLNYbYDqaGZCH22X8VM61Uek3qaSnVOZYG4p7z3VKUv2FdOO3VEqlvPZiBuGGJ4uId6/uay7zTlVpAF4p5ltR+Ezt75l217GrrfSDxtec6zshWIqBnvMWGnKV0w/BR197RX6AkogyPOtFdcFSudNOUez5c9nvg95anJViAyL6aSb/oI7QzRmTaCZCNEGHFHiVdYbnsdevq9pLK4U+/jSryIS9ymLaIbiCwUaRjCYDZGiPvllCyMTAERdsXsatdzzjv12e5cNIKj4/DRgESact9ENgLxA8GvrJ+U5de2lLwBMtdNBkjSsdE5fpc6kUlCBogBMtcDJmWZlOWdSQoKIBq1v2Tk2jX7axQiEW+9NBLmHweouE+8a6+ogOXL4eZNuHjR+RBC4TJAFJyXCVUDJBNeVbBpgCg4LxOqBkgmvKpg0wBRcF4mVA2QTHhVwaYBouC8TKj+34D8CzJv90LWWFDjAAAAAElFTkSuQmCC", {
				"one": {
					x: 0,
					y: 0,
					w: 32,
					h: 32
				},
				"two": {
					x: 32,
					y: 0,
					w: 64,
					h: 32
				}
			});

			sp.draw("one", 0, 0, 40, 50);
			sp.draw("two", 18, 9);

			testbed.verify(0.01, 0.011);
		},

		draw_array_visual: function () {
			var sp = initTestbed("data:image/png;base64,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", [
				{
					x: 64,
					y: 0,
					w: 32,
					h: 32
				},
				{
					x: 0,
					y: 0,
					w: 64,
					h: 32
				}
			]);
			sp.draw(1, 0, 0, 100, 50);
			sp.draw(0, 34, 9);

			testbed.verify(0.03, 0.05);
		},

		drawArray_visual: function () {
			var sp = initTestbed("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAFhUlEQVR4Xu2bX2gcRRzHP/uuaIgggigktYIgSpuiSCKo2BxpfZFikjY+SKNpai1aaoKW2laxNWn982KSYrSC1dzZkBdpSNInm/bBNlKqINSS4IMgPiRR6vvI7OQuc3e7O7N3e91cbvcpuZ2d3fl95vf7zb+vI4QQeFxzv0KqGxb/8bpb/Nv2G45dwZVSvQzRRm/gM4N0Mkvaqt4fwr0+v876epiagqYmmJ6GVMrqnXohZ6OnGX3rGToCvTuLbzt+QGTR6VkFxeYKA+RlPuQl3rWpln5a+I1LxrIlA9FhuI2uPJC+bhh427tJTsebQlz5BRb+hPq74fmnYOgo1N2lHtj2KkxeNNoDWyD30sAo826F/7HMOT7iMuP8zYL722ba2MUxHqLJ/f8mcxxgi/EDSgLS0ACZjPKM7FVhINLGN2eUfZf/hb1HQbe/w8bikNW8GWa/U194fAQOfWq0hzWQF+njFQbcCv16/53U8zE/cR+NbrluGnPA/L4kNJCeHjhxAurqVJXLy+rvCgPpaIOxFXu27IRLP+e3yBOILCJuqIK2YcvWQ44xxSZa+Yt5XmODL+kUPbzOSCA4/eFQQNJpaG9fBdHVBfv3Q2trxYGYurYRSNQeYvqg7P1HaGaA2coAkQlcGn94GA4fhsVFldTXKpC2p+H8F8o0Xm7lZVRbD7EFoif+FzAPoUJ5iAxXFy7Agspb7rUWgTTcDztSqyMAW++Q7YkSiJ5DLpLhJB1GjqGAeNW2BoBI+7shy2sY1vkWpCeNdsgViBKIPkd5g8f5g+vGD6lmILr9c0CefVK1ecOD0PiA+lt6yCdn7CaHUQHRYXzOHqY4bYQhC1Q7kKz9PZO6zCFnT6mxspyxb9lhtkkUQHQYkwwzzF7zi1dKVDMQvZG+oyx9LmITvsoBInNGFx/kllLCwqh2D7ECIgtdHYemRyFzHjoOBHfWUoHImXs/mdzM/HuO8w2HrD0jW3Dde4g7EhyF1ha7yWEpQOQyyUHOcgdqthxmMbGQWE0AWbqi8ojNbD0skBY66GPMtatc03qHZ6xGU36uUy1A9FXee54oHjD55pCedhh5f3W0ZVrPCgNEhyEXD4+Q4haLocOU/kC1ANHXsvpPwuBofrOdvkEhxqfUaq+8HntYhSl9ebjxudX7flazBSJzxmfMuWEqKhjVlNT11V753RKKbv/A/RD5wJ734HTG3HltgdhsTBW+7Qz9TDAY+BHV4iGyEbqXFDYqEIgtDFmpLZAxlnJJ3IxZlVhvQIKgOEPfCrG1eXV2LieCM5fhy3PmMKUb1AaIvjllC2O9ApHtkmtXB3eDbn/fpB7GYGE8JGy9tuXLDlm2L/IpF3ZP3e91CZAyQWQfT4AUGDLxkAKD2OSQiDqjZzUJkARIngUiC1nbBeFOePl08/XSQ0v14qgihJMAKRVB/nMJkAI7RhUySsWTAEmABPedJIeYjyrZeF+SQ2ysZFEmspD1o0iLTWzNLfjJI57XmGGCU8bztPp3lu0h8uDz/PxtPcopzw3s26XWkrKHy+Vm3NcT4Y5Albp0JE9nbmMfuv0DV3vDbKmWBWQN6TOynSwufYxxP6TW9Bm619tsXWfLhwlZQfoY5yvRJxJ9xtrRx3gm9VrWZ8geH6c+xneUVav6jGwIiksf4wukVvUZhUBsFQBhckjQKNoXSK3qM6Sx4tTHGHNIrekz4tbHeAKpZX1GNpzYHDDXQ0/FQlat6zPi1sfkeUiiz1B9Pk59jAsk0WcUj3vi0sc4u0WDSPQZ3gPROPQxzi2xJBJ9hjeQOPQx7uJios/wBhKHPsb5XVwViT6jGEhc+hinU9SLcsUysjll7YfICm6TcN+kz4hbH2PcD5G2Wm9ygCB9RqGv2EoybCeGJn3M/2JPmaPYxhIyAAAAAElFTkSuQmCC", [
				{
					x: 0,
					y: 0,
					w: 32,
					h: 32
				},
				{
					x: 32,
					y: 0,
					w: 64,
					h: 32
				},
				{
					x: 64,
					y: 0,
					w: 64,
					h: 32
				}
			]);

			sp.drawArray([
				{ id: 2, x: -14, y: -7 },
				{ id: 1, x:  18, y: -7 },
				{ id: 0, x:  50, y: -7 },
				{ id: 2, x:  82, y: -7 },
				{ id: 1, x: -14, y: 25 },
				{ id: 0, x:  18, y: 25 },
				{ id: 2, x:  50, y: 25 },
				{ id: 1, x:  82, y: 25 },
			]);

			testbed.verify();
		},
	};
})();
