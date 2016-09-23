(function () {
	"use strict";

	var Draw = Chicken.fetch("ChickenVis.Draw");

	function newCanvas(width, height) {
		width = width || 100;
		height = height || 50;

		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		return canvas;
	}

	function newDraw(width, height) {
		var canvas = newCanvas(width, height);
		return new Draw(canvas);
	}

	function initDrawing(expectedImage, width, height) {
		draw = newDraw(width, height);
		testbed = new CanvasTestBed(draw.canvas, draw.context);

		if (expectedImage) testbed.setExpected(expectedImage);
		Test.log(testbed.rootElement);
	}

	var draw;
	var testbed;

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

		rectDefaultColour: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAx0lEQVR4Xu3TwQ0AMAyDwGT/odtPhzipeAIE8k6jDOyjORTVvzBbECt+QaweU5CCYAYwnB5SEMwAhtNDCoIZwHB6SEEwAxhODykIZgDD6SEFwQxgOD2kIJgBDKeHFAQzgOH0kIJgBjCcHlIQzACG00MKghnAcHpIQTADGE4PKQhmAMPpIQXBDGA4PaQgmAEMp4cUBDOA4fSQgmAGMJweUhDMAIbTQwqCGcBwekhBMAMYTg8pCGYAw+khBcEMYDg9RA2Ccf2LcwEKuTAzNvZpWgAAAABJRU5ErkJggg==");
			draw.rect(1, 1, 98, 48);
			testbed.verify();
		},

		rectRedSmallCanvas: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAYAAABzVH1EAAAAWElEQVRYR+3S0QkAMQzDUGf/odsdDIIQdP8OVO/mJS8HvvEhyxQVWQYSRRSBCvhrQWHrs4rU6aChIlDY+qwidTpoqAgUtj6rSJ0OGioCha3PKlKng4ZnRD4PxDHop55MXAAAAABJRU5ErkJggg==", 50, 25);
			draw.rect(0, 0, 100, 100, "red");
			testbed.verify();
		},

		rectStroke: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAB20lEQVR4Xu2aMU7DQBBF/1Ijam5jXyI0OUziw6QB7gC+DdSIlkXrIFCq+I/8p1i+mzR/ZuL3IkvxbEG7JhyWT1/XCRwwXQ/FE2WR8YURBXO8zb+pHADMOOKouuOzkIqiHKL68ul9E1hZCGPVQhhaCVkLSYDMjLAQhlZC1kISIDMjLIShlZC1kATIzAgLYWglZC0kATIzwkIYWglZC0mAzIywEIZWQtZCEiAzIyyEoZWQtZAEyMyIHoTUUz/byKcPjLWiPNzhhfG4Nlv2mKT7kEVGwYjaxzby+RNDE7K7xetayKtzFUPb2uqFAKXsdSvP1Te8RVD4yPp5khQLYURZCEMrIWshCZCZERbC0ErIWkgCZGaEhTC0ErIWkgCZGWEhDK2ErIUkQGZGpAlph61vtn8d8HiPobRXDe/b92Y4bpatGFWHrf/+qbdvKzrNvQgBsHvr413WIlbE6lLIZj+hy0a/Q3p5lyXi1NpaiBBupLWFRKgJayxECDfS2kIi1IQ1FiKEG2ltIRFqwhoLEcKNtLaQCDVhjYUI4UZaW0iEmrDGQoRwI60tJEJNWGMhQriR1hYSoSassRAh3EjrPCFty1Y62RhGSK+tOXOa20JPetVTJwetpZTOzduh9G80Hl56Dx8WXwAAAABJRU5ErkJggg==");
			draw.rect(1, 1, 75, 30, "green", true);
			draw.rect(24, 19, 75, 30, "orange", true);
			testbed.verify(0.01, 0.01); // Slight rendering differences between Edge and Chrome cause 8 failed pixels
		},
	};
})();
