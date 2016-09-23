(function () {
	"use strict";

	var Draw = Chicken.fetch("ChickenVis.Draw");

	window.Tests.DrawTests = {
		construct_withContainerDiv: function () {
			var container = document.createElement("div");
			var draw = new Draw(container, 640, 480);

			Assert.isEqual("CANVAS", draw.canvas.nodeName, "Canvas element was not created");
			Assert.isEqual(1, container.childNodes.length, "Wrong number of child nodes in container");
			Assert.isEqual(draw.canvas, container.childNodes[0], "Canvas wasn't added to the container element");
			Assert.isEqual(640, draw.width, "Wrapper width was not set correctly");
			Assert.isEqual(480, draw.height, "Wrapper height was not set correctly");
			Assert.isEqual(640, draw.canvas.width, "Canvas width was not set correctly");
			Assert.isEqual(480, draw.canvas.height, "Canvas height was not set correctly");
			Assert.isNotNullOrUndefined(draw.context, "Context was not created");
		},

		construct_withUnsizedCanvas: function () {
			var canvas = document.createElement("canvas");
			var draw = new Draw(canvas, 320, 240);

			Assert.isEqual(canvas, draw.canvas, "Provided canvas element was not used");
			Assert.isEqual(320, draw.width, "Wrapper width was not set correctly");
			Assert.isEqual(240, draw.height, "Wrapper height was not set correctly");
			Assert.isEqual(320, draw.canvas.width, "Canvas width was not set correctly");
			Assert.isEqual(240, draw.canvas.height, "Canvas height was not set correctly");
			Assert.isNotNullOrUndefined(draw.context, "Context was not created");
		},

		construct_withSizedCanvas: function () {
			var canvas = document.createElement("canvas");
			canvas.width = 800;
			canvas.height = 600;
			var draw = new Draw(canvas);

			Assert.isEqual(canvas, draw.canvas, "Provided canvas element was not used");
			Assert.isEqual(800, draw.width, "Wrapper width was not set correctly");
			Assert.isEqual(600, draw.height, "Wrapper height was not set correctly");
			Assert.isEqual(800, draw.canvas.width, "Canvas width was not set correctly");
			Assert.isEqual(600, draw.canvas.height, "Canvas height was not set correctly");
			Assert.isNotNullOrUndefined(draw.context, "Context was not created");
		},

		construct_withCanvasOverridingSize: function () {
			var canvas = document.createElement("canvas");
			canvas.width = 150;
			canvas.height = 75;
			var draw = new Draw(canvas, 300, 200);

			Assert.isEqual(canvas, draw.canvas, "Provided canvas element was not used");
			Assert.isEqual(300, draw.width, "Wrapper width was not set correctly");
			Assert.isEqual(200, draw.height, "Wrapper height was not set correctly");
			Assert.isEqual(300, draw.canvas.width, "Canvas width was not set correctly");
			Assert.isEqual(200, draw.canvas.height, "Canvas height was not set correctly");
			Assert.isNotNullOrUndefined(draw.context, "Context was not created");
		},
	};
})();
