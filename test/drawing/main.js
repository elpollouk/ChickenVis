(function () {
	"use strict";

	// Resources
	var TEST_IMAGE = "123.png";
	var Draw = Chicken.fetch("ChickenVis.Draw");

	var _currentDivLine = null;

	var newDivLine = function newDivLine() {
		var div = document.createElement("div");
		div.className = "container";
		document.body.appendChild(div);
		_currentDivLine = div;
	};

	var newContainer = function newContainer() {
		var div = document.createElement("div");
		div.className = "testCanvas";
		_currentDivLine.appendChild(div);

		return div;
	};

	var loadImage = function loadImage(src, target, complete) {
		var img = document.createElement("img");
		img.onload = function () {
			complete(img);
		}
		img.style.display = "none";
		img.src = src;
		target.appendChild(img);
	};

	var _tests = [
		// Rect tests
		newDivLine,
		function rectDefaultColour() {
			var q = new Draw(newContainer);
			q.rect(1, 1, 98, 48);
		},

		function rectRedSmallCanvas() {
			var q = new Draw(newContainer, 50, 25);
			q.rect(0, 0, 100, 100, "red");
		},

		function rectStroke() {
			var q = new Draw(newContainer);
			q.rect(1, 1, 75, 30, "green", true);
			q.rect(24, 19, 75, 30, "orange", true);
		},

		// Line test
		newDivLine,
		function lineDefaulColour() {
			var q = new Draw(newContainer);
			q.line(0, 0, 100, 50);
			q.line(0, 50, 100, 0);
		},

		function lineRainbow() {
			var q = new Draw(newContainer);
			q.line(1, 2, 99, 2, "red");
			q.line(1, 11, 99, 11, "orange");
			q.line(1, 20, 99, 20, "yellow");
			q.line(1, 29, 99, 29, "green");
			q.line(1, 38, 99, 38, "blue");
			q.line(1, 47, 99, 47, "purple");
		},

		function lineSetOrigin() {
			var q = new Draw(newContainer);
			q.setOrigin(50, 25);
			q.line(0, -25, 0, 25, "gray");
			q.line(-50, 0, 50, 0, "gray");
		},


		// Path tests
		newDivLine,
		function pathDefaultColour() {
			var q = new Draw(newContainer);
			var path = [
				{x: 30, y: 25},
				{x: 50, y:  5},
				{x: 70, y: 25},
				{x: 50, y: 45},
				{x: 30, y: 25}
			];

			q.path(path);
		},

		function pathRed() {
			var q = new Draw(newContainer);
			var path = [
				{x: 30, y: 25},
				{x: 50, y:  5},
				{x: 70, y: 25},
				{x: 50, y: 45},
				{x: 30, y: 25}
			];

			q.path(path, "red");
		},


		// Circle tests
		newDivLine,
		function circleFill() {
			var q = new Draw(newContainer);
			q.circle(25, 25, 24);
			q.circle(75, 25, 24, "blue");
		},

		function circleStroke() {
			var q = new Draw(newContainer);
			q.circle(25, 25, 24, null, true);
			q.circle(75, 25, 24, "blue", true);
		},

		function circleAlpha() {
			var q = new Draw(newContainer);
			q.circle(40, 25, 30, "rgba(255, 0, 255, 0.5)");
			q.circle(60, 25, 30, "rgba(255, 255, 0, 0.5)");
		},

		// Text tests
		newDivLine,
		function text() {
			var q = new Draw(newContainer);
			q.text("Hello", 0, 0);
			q.line(0, 10, 30, 10, "green");
			q.text("World", 50, 25, "blue");
			q.line(50, 35, 80, 35, "red");
		},

		function textPlain() {
			var q = new Draw(newContainer);
			q.text("Test", 0, 0);
		},

		// Clear tests
		newDivLine,
		function clear() {
			var q = new Draw(newContainer);
			q.rect(0, 0, 100, 50, "rgba(0, 0, 255, 0.5)");
			q.text("Click to clear", 8, 20);
			q.canvas.onclick = function () {
				q.clear();
			}
		},

		function clearSetOrigin() {
			var q = new Draw(newContainer);
			q.setOrigin(50, 25);
			q.rect(-50, -25, 50, 25, "rgba(255,   0,   0, 0.5)");
			q.rect(  0, -25, 50, 25, "rgba(  0, 255,   0, 0.5)");
			q.rect(-50,   0, 50, 25, "rgba(  0,   0, 255, 0.5)");
			q.rect(  0,   0, 50, 25, "rgba(255, 255,   0, 0.5)");
			q.text("Click to clear", -42, -5);
			q.canvas.onclick = function () {
				q.clear();
			}
		},

		// Image drawing
		newDivLine,
		function image() {
			var container = newContainer();
			var q = new Draw(container);
			loadImage(TEST_IMAGE, container, function (img) {
				q.image(img, 2, 9);
			});
		},

		function imageEx() {
			var container = newContainer();
			var q = new Draw(container);
			loadImage(TEST_IMAGE, container, function (img) {
				q.imageEx(img, 32, 0, 32, 32, 34,  9, 32, 32);
				q.imageEx(img,  0, 0, 32, 32, 64, 26, 32, 20);
				q.imageEx(img, 64, 0, 32, 32,  4,  4, 20, 32);
			});
		}/*,

		// Sprite pallette
		newDivLine,
		function palletteDraw_dictionary() {
			var container = newContainer();
			var q = new Draw(container);
			loadImage(TEST_IMAGE, container, function (img) {
				var p = new Drawing.SpritePallette(img, {
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
				}, q);
				p.draw("one", 0, 0, 40, 50);
				p.draw("two", 18, 9);
			});
		},

		function palletteDraw_array() {
			var container = newContainer();
			var q = new Draw(container);
			loadImage(TEST_IMAGE, container, function (img) {
				var p = new Drawing.SpritePallette(img, [
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
				], q);
				p.draw(1, 0, 0, 100, 50);
				p.draw(0, 34, 9);
			});
		},

		function palletteDrawArray() {
			var container = newContainer();
			var q = new Draw(container);
			loadImage(TEST_IMAGE, container, function (img) {
				var p = new Drawing.SpritePallette(img, [
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
				], q);

				p.drawArray([
					{ id: 2, x: -14, y: -7 },
					{ id: 1, x:  18, y: -7 },
					{ id: 0, x:  50, y: -7 },
					{ id: 2, x:  82, y: -7 },
					{ id: 1, x: -14, y: 25 },
					{ id: 0, x:  18, y: 25 },
					{ id: 2, x:  50, y: 25 },
					{ id: 1, x:  82, y: 25 },
				]);
			});
		}*/
	];

	window.onload = function () {
		for (var i = 0; i < _tests.length; i++) {
			_tests[i]();
		}
	};

})();
