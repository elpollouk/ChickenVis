(function () {
	"use strict";

	var Draw = Chicken.fetch("ChickenVis.Draw");

	window.Tests.DrawTests = {
		construct: function () {
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
		}
	};
})();
