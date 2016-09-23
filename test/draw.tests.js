(function () {
	"use strict";

	var Draw = Chicken.fetch("ChickenVis.Draw");

	testImage.setAttribute('crossOrigin', 'anonymous');

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

		lineDefaulColour: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABtElEQVR4Xu3ca0rFMBAF4OkGBFekS3Nn97oiwQ0oheSC1do85nFOO/kTCIWk89FpaYYsInIXkS8ReRORd8kWEYGXEv9lKbO/loGE8eV4QJT43ytIXUbC+ID8gqjTbkESxhZkF+IIJGF0YQ4hWkESZg6mGaIXJGH6YLohRkES5n+YYYhZkIT5CTMNoQVydRg1CG2Qq8GoQ1iBnB3GDMIa5Gww5hBeIOwwbhDeIGww7hBRIOgwYRDRIGgw4RAoINEwMBBoIN4wcBCoINYwsBDoINow8BAsILMwNBBsIL0wdBCsIEcwtBDsIFuYpzLwWctp6gVs/V7VCct91CfiuSz4g73gjxVkLzXR15WxgbS+I2hhWEBaIbaplg4GHWQUghYGFUQLgg4GDcQKggYGBcQLAh4mGiQKAhYmCgQFAg7GGwQVAgbGC4QFIhzGGoQVIgzGCuQsEO4w2iBnhXCD0QK5CoQ5zCzIVSHMYEZBEuLvLbzpv8u9IAnRtpc6DNMKkhBtENOp7AgkIcYghmH2QBJCB6IbZguSEDYQzTAVJCF8IA5hVpCbiKz9eoDZephZNv8IPL7KvgHXwvOyYt5ydgAAAABJRU5ErkJggg==");
			draw.line(0, 0, 100, 50);
			draw.line(0, 50, 100, 0);
			testbed.verify(0.03, 0.04);
		},

		lineRainbow: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABHElEQVR4Xu3biw3DMAwDUWrODmN7mMypIj803eCAXCZg9aAahJOKD2oCtafpZKBSvTRMJesGmS+dAepnVzIPEB/OBAThWBxJBBEENgFYHDdEENgEYHHcECJIbxZDgkt97mK4xWIIEKmPxRDA8B/BMwRGIoggsAnA4rghgsAmAIvjhhBBui2GBJequxi2xRAC4o0hAeKZwTMEJiKIILAJwOK4IYLAJgCL44YgQZbFEOEyrmKYaTFEgExvDBEOFkMcwy+QhzoMRxBBYBOAxXFDBIFNABbn2pD2G0METJ3fGCbtq6QMEG8MEQ6PEB7qMBFBBIFNABbHDREENgFYHDeECLKyLIYAmJFxFsOZaTEEgOwO/mUBILwxhCE843wBWjUeM9qZcTQAAAAASUVORK5CYII=");
			draw.line(1, 2, 99, 2, "red");
			draw.line(1, 11, 99, 11, "orange");
			draw.line(1, 20, 99, 20, "yellow");
			draw.line(1, 29, 99, 29, "green");
			draw.line(1, 38, 99, 38, "blue");
			draw.line(1, 47, 99, 47, "purple");
			testbed.verify();
		},

		lineSetOrigin: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABRklEQVR4Xu2awQ3CQBAD9yqDzkgqg84OpQPLki2IhrfXJjNSXllzg995nq+99zqO4/j3x1n//gDX/0fIj1lECEJiBHhlxdB6xQjxuMWuEBJD6xUjxOMWu0JIDK1XjBCPW+wKITG0XjFCPG6xK4TE0HrFCPG4xa4QEkPrFSPE4xa7QkgMrVeMEI9b7AohMbReMUI8brErhMTQesUI8bjFrhASQ+sVI8TjFrta1xcbsfZS8d77OTNrrfUuTcZmbvFx2cw8LiEz84mRKhXzyiqBVmcQopIq5RBSAq3OIEQlVcohpARanUGISqqUQ0gJtDqDEJVUKYeQEmh1BiEqqVIOISXQ6gxCVFKlHEJKoNUZhKikSjmElECrMwhRSZVyCCmBVmcQopIq5RBSAq3OIEQlVcohpARanUGISqqUQ0gJtDqDEJVUKfcF3cNZRCOoM/UAAAAASUVORK5CYII=");
			draw.setOrigin(50, 25);
			draw.line(0, -25, 0, 25, "gray");
			draw.line(-50, 0, 50, 0, "gray");
			testbed.verify();
		},

		pathDefaultColour: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABhUlEQVR4Xu3Zyw6DMAxE0fD/H90KCaQW8QiQeO6AWXUBiT0nRpUYSl6oBAZUNVlMSRDYIUiQBIElACvnKRPymXK178e+gVLKiDH38fsbdvbrynEHWQOwRnEG2QveFsUVpCbwmnvq3iOBdzmCnAn6zL2BsW9v5QZyJeArz8hwnEDuBHvn2VAcF5AWgbZYozuOA0jLIFuu1QWHDtIjwB5rNsMhg/QMrufat3CoIBGBRexxGocIEhlU5F5VODQQRUCKPTdxSCDKYJR7/+FQQAiBEGpAfFNHBDEdU3kt6gmRB7DyMpfWpASRNn7wl0dWW4Ksy7wSZIxC1vjOhEhrUk7InIk0gAWMvBYCCGVS5BhjEBQQNQoCgwaiQsFgEEGiUVAYVJAoFBwGGaQ3ChKDDtILBYvhANIaBY3hAtIKBY/hBHIXxQLDDeQqig2GI8hZFCsMV5BaFDsMZ5AjFEsMd5AtFFuMJ4AsUawxngIyozyiH9L3kDHQ118JAjsCCZIgsARg5eSEwEC+2qdOM0gKJdkAAAAASUVORK5CYII=");
			var path = [
				{x: 30, y: 25},
				{x: 50, y:  5},
				{x: 70, y: 25},
				{x: 50, y: 45},
				{x: 30, y: 25}
			];

			draw.path(path);

			testbed.verify(0.01, 0.04);
		},

		pathRed: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABi0lEQVR4Xu3ZwQ6DIBBFUfz/j7axkaQh1iIwzH10TBddKAzvABrdUhyoBDZUNVFMChDYJAiQAIElACtniRWyp7QfuW7vn/YhP4ADI0N8/ldlkQa5AlBHkQW5C14ZRRKkJvCac4jbmhzIk6CfnEvBkQJpCbjlGk8cGZCeYHuunY0jATIi0BFtzMDBg4wMcmRbVjhoEIsALdociYMFsQzOsu1eHCTIjMBm9NGCgwOZGdTMvmpxUCAeAXn0eYeDAfEMxrPvEgcBQgiEUMP5Tad2d7M5jxLEMTpCLa4rhBBAOc28a3ID8R743Xr3rC1ALmT+EoSyZ8eWVSTgORtpGIinLMpKoUwMt3sIaXZSMDArJON4BOPRp8SrEw8UGgZuhcxEIWJgQaxv9FQMNIgVChkDDzIahY4hATIKRQFDBqQXRQVDCqQVRQlDDuQpihqGJEgtiiKGLMgvFFUMaZBvKMoY8iAlijrGEiAZ5RwM5nPC3Rtdqbe9rQNZ5Tr5GbUKRB5HgMBEAyRAYAnAynkBg3ecM82ox6EAAAAASUVORK5CYII=");
			var path = [
				{x: 30, y: 25},
				{x: 50, y:  5},
				{x: 70, y: 25},
				{x: 50, y: 45},
				{x: 30, y: 25}
			];

			draw.path(path, "red");

			testbed.verify(0.01, 0.04);
		},

		circleFill: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAD60lEQVR4Xu2cj3EUIRjFHxWoFagVmFRgrMBYgaYCtQKTDrQCtYIkFWgq0FSgdmAqwHkczBJ22T8sB3zn7szO3M3d7fL48X0PWDiF7WiqBlTm0rwEcATgxF73oX3Ptz8B/LUnX/O8znz/TJfTC3WobDrWAmGFs/Cn9kypkCsAPCmKwCocOrMOlawjFQgFvAXwDgBf5zgo4iOAT+XAGBB71LEcTAqQ17bicoEIYf4GcA7gaw7K8WvoQjrUIh1LgBDAN88T9ltfO495kT9aTFRU0DEvWuYCoVFTxL6iIgaXaYxQCCfDoSvrUJM65gB5A+BzhtpIvQShvAfwJfUCu9/pRnSoUR1TQGqL8BmcpUOpDiPQEYcyBoTh/WNdq8z668T0ZdJUgzqG01cMCL3iVwXPmCJIKE/nG70x8IZ19I0+BoQtii2rxYPGeDyvYLpxHaqnYwhIS74Rq/cZftKUb4zouO8nIZBWQ3xo8MjWFZmiaDZVRXR0qSsEwhHyh3npoPq3LuyIfqAgWpgOxfKawwciJTpc2SMGLyY6Ah27KPGBSPCOMBoGvESEdwzo2HmJD4RT4JxKl3Rwyp5T/96hhepQRocPREsiYcvKMH8UABGqQxkdDgjpXAoEwiK/sg+4OF8lXIe6ckAk9UrCduP1tkT1rgZ0qHMH5DuA50IjxPMRLVyHOj0EIDfdogrRQG4AdeKAtDznMxW43txW03NXM3SoYwdEYs/EF2h1aOE6lNqATLXbop93QBj2z4reO9/NbrtHBVq4DnW0mXq+hrH2SvdMXXh30U2fiO5lXQNdt3cbGK5t3+t/fwF0A0PhUw5mbfBBTZ0YNeshF7/CXX8hhsiu7x2gzCLEbfq9eBsavKHxjxDI9oCqHpwzoP+AiiHDlecP6pVr0Z2Zrp70FzqYR7gCdfQf4bI2JPW2Dn6RA4GwdXG0+3hRWy3/5T92dD62DEiQjvgyIFatBC/5bxbKubbe8pyQN3c1FZpNz23dAqq3XHdssXWLxhgx8hiYZg3e6pi/2JoKSY9zXK30uiiC260ndyHdx2O2IzSoY9l2BKepJT+Z4RvRSGlMR9qGHR8KtyvXihRGBrdf59jS1oCOdVvaHJRaYZ+YpqKRUllHnk2fTh3HKMzFpZ4ssjdFz0j+V4RhLMboK+jIuy3a18Z8zBH9vgaPHPTx+itT1GSXuJCO8RQVlnJqF25MFVsZ8zrPXN7C9MQczzNzVIx2i/eoY15U+KVLBeKnMffHM0wvS+EQAtOH+wOaQiBCQCaNZdSxHIQr0VogoTKKonHypEieznPoCeHfM9knfVPppfTnZtH2Ah0qm47cQErX3MHd7x8BYS5Cxx0IzAAAAABJRU5ErkJggg==");
			draw.circle(25, 25, 24);
			draw.circle(75, 25, 24, "blue");

			testbed.verify(0.05, 0.05);
		},

		circleStroke: function () {
			initDrawing("data:image/png;base64,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");
			draw.circle(25, 25, 24, null, true);
			draw.circle(75, 25, 24, "blue", true);

			testbed.verify(0.1, 0.05);
		},

		circleAlpha: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAEMUlEQVR4Xu2cT0hUQRzHv0MeFgoUkvKgISW0BykrDxtZhqCBUEFQXfpzsk4lQRQdMrJDGEFYJ/NkdbEgsEBQQbSM9mC1xR4MLJb0sIWBgsEejImfvYXdzfXNvPdb377XzHXnfd+8+ezv/f7MzBMoUJOQYQBHAYRYbtE8Uo7Tj8MIpUq09Nb9XsLOj1PY9mVO67r8nVMABoTAFJNelowohKiEPAQgwqbd3l2DfW8qXelVzcwiEp12pZF9cVQIDDHqLUuxApGQZA1nAVSwDLRsvgS3rtdh8/cNLHqlC/M48CqOUGqJRQ9IAOgXAmQ1LI0NSNHDSE/X+l+LaBqNMUJJAujjgsIJ5DybZdDkPbhQz2YZuf9dgtI6OMnyl/4rkhQCPRx6LEAkJDnvOo4BLWtcux3Grg88r718g6pIJrH/NadjjgmBAbdz4BqIhCTnTU6cp516UokjL2p4xGxUtn+exo5Ps4z3GhICUTd6roBYoe1JNwPIupZC27beWjY9FaFINIaqmXmVrop9yJ+Qs3fUHAOxnHg7W55BEdX9ixHtPMPRY2dcRHlK62CU0clTxNXt1Mm7AeI/v5EPXhHlKI6ASMgyAGQdPG3LtxDuXuZLJJ2MqmU4itIFtnzCshLtV6FTIMGxjjS8Iom6tIFISApHKefgabXxDejorOcRc6lSBFbiBAhFVVQ45GmdHbUIT5XziLlU2fhzDk2jcZcqmZdPCYF+HT0tIFZkdVXnBqv2pcjq4bkGNj0OocMvJxgjLhpRl07EpQuELMPfeYcdtN3v44ylerobFR+VKwK6QILnzHMBeezcdYHQ64pnwYkm4tGZhjVPBO0shBLFY88n7Lpp/J4SAl2q/ZWBBDq6yp2txvFJbPqxqDqJCv16hACV6W2bDpBGAAdtFVU7tPVWo3mkWrX7mvbb+jWBPe8c16NWGOuYEBhXeQYDZKVZ8gmQ4OYfuVA8zEd0LITWyvleMXeu1KE6QTWx4mu09t4yHGMcWEII9Kno6QDxzxKtypOv1sfDJV4dIDfcPmfW9U9P8AUIrAOzxI4/G+OUFQI3VfQMkHyz5AMg5pWl8hdfuY/yrhQdCzFO3TmQgjh1E/Y6B6JchtexEJOpOwdiMnXncwfAJ5l6cJduc+n5obhIY5aQpvyub3qFKb9bQMwClT4QrT2/yk7dAmKWcPWBFHQJl1YLzSYHPSiF2+RgWUlw8xEPy+5pxlqvLAtIcKMtP26UC6xz93i3iWMLsYCYzdb2foSOJKzNZuvAWYnfjyNYQCjiMgd2/rUUbw7sWFBojZ3K8jxt79syXLrHd3hUZVRBOdKWflZz6DOLureHPjOg+K+kUiRRVa4Ra+ch+d4CEtI/S7we7iqxe4tyAinu75ykZ+J/+bRGRuRlPj5jZwar/M5mIZn3MJ9nck6kIEAySvXmA2aabP4ArxgMUfHZLGcAAAAASUVORK5CYII=");
			draw.circle(40, 25, 30, "rgba(255, 0, 255, 0.5)");
			draw.circle(60, 25, 30, "rgba(255, 255, 0, 0.5)");

			testbed.verify(0.01, 0.04);
		},

		text: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAC0klEQVR4Xu2bMWsVQRSFvylFO/+ApDFgYWGplU0gjWCjoJZiJ1iLJjFYC3YWVtFCC8FGsRS0104byQ9QUlqu3N3ZOA5v317lOTtsznbZ3J07e745d1OcBHRVpUCoajfaDAbkHvAAuA7sAx+AJ8Ad4OeARukzz5OaofuS2qmAATkG3AD2IoCbwCvgx8gap4F14HVWN3TfuaWjXdYDeQTcilK8A65FIP2Jt1/dB3YTuf4GiK33LD6br3O0CWRvv8whdvptfKXXBeBjvOEFYnWbgEG3y+DYaOzXEZBEgTEgFzNXpOIJyH84SmMf9cvJqPkMXAG+A/Yh30j2Y875MnDfnKCR5YSnP3udQpUqC+ywVarZH3222Jmkb+VNA9tsT7LHqfpO8rL+phpZfq2KVApIEZn9TQTEr1WRSgEpIrO/iYD4tSpSKSBFZPY3ERC/VkUqBaSIzP4mAuLXqkilgBSR2d9EQPxaFakUkCIy+5sIiF+rIpUCUkRmfxMB8WtVpFJAisjsbzITII1ly/ooUxr4i5GmMJYxyxRrksBfSIOAsa6xgMdj4DaEr365xytnAsRetDnfvW6I8aJWtHUIeZBvXJW2Yuz55lIX7BCQAUFbAc0pZ4A14GX3c/gETZZ6CbvQnIwpmYO44NUuTts7YhGQQ+eY8yzd+V5ABs93K+A54ARwHPgWI0sWW9qEEIN6LZz9zkmHo27vt7P6BjmQ1oGnOmAaWY4x0574h8DbCMLyyn1achmQmGsOWbB8GZB2pFkY/Y0cMuwQG1cWLXoagRicu2Af9IUjyxz1Ajgbl+wzzfbjgiBg66g062x18b8EcpiO8zNQMqOP+r+LUNOTswHSME3gL3SuXNk1JyCTBP4Cqw0azgbIyo7oxAsJyMQA8vYCIiCVKVDZduQQAalMgcq2I4cISGUKVLYdOURAKlOgsu3IIQJSmQKVbUcOEZDKFKhsO78AwL+bM7OvH04AAAAASUVORK5CYII=");
			draw.text("Hello", 0, 0);
			draw.line(0, 10, 30, 10, "green");
			draw.text("World", 50, 25, "blue");
			draw.line(50, 35, 80, 35, "red");

			testbed.verify(0.01, 0.04);
		},

		textPlain: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABbklEQVR4Xu2WsU1CURhGD6W9A9hhxwBa2VhaUjCAU2ChA1jba+EI9jIAHeygO5ibXJI/RiRo8vIFDg2QPML3zuHcMMJHFIFR1BrH0ITMgOdvLC6BhXyGJ9CE3AAr4Lw/n/YZfxFyAZwBL8PfymF8Yz2yNmLW5dbmwH1/fwc89Ne1qifgEWgi38tn33p9n4eBapi7+E1I+7VXwG3R5ijbJspC/ultl5CrUsW2r6plVSGtovbw+NpDUhNy0o+c2x1H0xKYAh8d8vUP14+BV2AC1CNuj0nHfal/e8P8K0QhYQTC5liIQsIIhM2xEIWEEQibYyEKCSMQNsdCFBJGIGyOhSgkjEDYHAtRSBiBsDkWopAwAmFzLEQhYQTC5liIQsIIhM2xEIWEEQibYyEKCSMQNsdCFBJGIGyOhSgkjEDYHAtRSBiBsDkWopAwAmFzLEQhYQTC5liIQsIIhM2xEIWEEQibYyEKCSMQNsdCwoR8AdLBJjM1aZKMAAAAAElFTkSuQmCC");
			draw.text("Test", 0, 0);

			testbed.verify(0.01, 0.01);
		},

		transforms: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAACFUlEQVR4Xu3c0VGEMBAG4J8urgQfbQDHDnxjxi7s4MYO7MIZ3uzA8Rrw0RLoAicO3NxhAlkI2Y3+9xwC7JdAWJarwJ+pCFSmjoYHA4IYGwQEIUj6CPTAg+u1At7S9563x+JnyIBxO4Tts3SUokEmGONQLhqlWJAARvEoRYIsYBSNUhxIJEaxKLZAehzn1jT1CTeHDgfJuqc7oDvV+JrdpsKzpM892xYDsgZjDNwiCkECYywwQ7ZgRKEQJB4kBcYiCkHiQFJizKIQZBlkD4wgCkHmQfbE8KIQJAySA+MXCkH8IPUHXqXPGVufCX6WxHd43NpPqu3NPIe4J/CmxVOqE5P00zZ4sZIlNgEypkOaFveSQKZq2zZ4B2AiS6wOcpmbUgZxvuooqiDTRKEBEHUUNRBf1tYIiCqKCkgohW4IRA2FIACGm/p0jaByP1EBcWfOS5Z/jagG4kMxcslSmRkjjyrIFMUAiCqGi4c6yCWKMog6hhmQEYWpEyMzZLx+MrloDAQ9jky/p8rQpehnKHLIgXJVicL3IXyFGxq/JlZZ54OblAHtMVO8NVqcIcsz5HyjX1GtGBp9wYI5gsSDuJYpZsps9SJBZCBbUVhKunbFxWJrG6kTiR8/R5BEK1PbSBQTuSlpSGwtewVHz0/aBMHK1ZQffeaKtGA//CxaEKxcTfnHAbki/Q/3U+xN/a9aEcSYLEGMgXwDWuP0M0sWL2YAAAAASUVORK5CYII=");
			draw.save();
				draw.translate(50, 25);
				draw.rotate(Math.PI / 4);
				draw.rect(-15, -15, 30, 30, "rgba(255, 0, 0, 0.5)");
			draw.restore();
			draw.rect(35, 10, 30, 30, "rgba(0, 255, 0, 0.5)");

			testbed.verify(0.02);
		},

		scaleXY: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABHElEQVR4Xu2YsQ3DQBDD/Jtn80/hESgBAsz0R9yTucbn8Tdl4Ext4zKPQcb+BAYxyJiBsXW8EIOMGRhbxwsxyJiBsXW8EIOMGRhbxwsxyJiBsXW8EIOMGRhbxwsxyJiBsXUKF3J/Y28sr3Oi720EuWUDY/gTdRiFvaauQcBfxiBA3jvqhWCFWYBBsj4xzSBYYRZgkKxPTDMIVpgFGCTrE9MMghVmAQbJ+sQ0g2CFWYBBsj4xzSBYYRawHyT6OTorr0Gb//zeePR3mIWvvd+R13ipQRpWAdMgQF5j1CANq4BpECCvMWqQhlXANAiQ1xg1SMMqYBoEyGuMGqRhFTANAuQ1Rg3SsAqYBgHyGqMGaVgFTIMAeY1RgzSsAuYfGhIgM3kiiH4AAAAASUVORK5CYII=");
			draw.translate(50, 25);
			draw.scale(2, 0.5);
			draw.rect(-15, -15, 30, 30, "blue");

			testbed.verify();
		},

		scale: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAABH0lEQVR4Xu2buw7CMBTFkv//6DJ0q2DwYOVWmPlIDnYfYmCvPqMM7FGn6TCrIMMugoIUZJiBYcc5eIdc1zAXj+PsI26OQO9vXpBvF2RBft6m3SHDnmAFKchaJ3+H9A7pHYLuwR5ZSJc/LojvGBEKgnT544L4jhGhIEiXPy6I7xgRCoJ0+eOC+I4RoSBIlz8uiO8YEQqCdPnjgviOEaEgSJc/LojvGBEKgnT544L4jhGhIEiXPy6I7xgRCoJ0+eOC+I4RoSBIlz8uiO8YEQqCdPnjgviOEaEgSJc/LojvGBEKgnT544L4jhGhIEiXPy6I7xgRCoJ0+eOC+I4RoSBIlz/+uyC+0jcSDv4t+o26/DMXxHeMCAVBuvxxQXzHiPABgvBQM8RBGDsAAAAASUVORK5CYII=");
			draw.translate(50, 25);
			draw.scale(4);
			draw.rect(-5, -5, 10, 10, "blue");

			testbed.verify();
		},

		clear: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAwElEQVR4Xu3TQREAAAiEQK9/aWvsAxMw4O06ysAommCuINgTFKQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIViQBxv1ADO4LcKOAAAAAElFTkSuQmCC");
			draw.rect(0, 0, 100, 50, "rgba(0, 0, 255, 0.5)");
			draw.text("Click to clear", 8, 20);
			draw.clear();

			testbed.verify();
		},

		clearSetOrigin: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAwElEQVR4Xu3TQREAAAiEQK9/aWvsAxMw4O06ysAommCuINgTFKQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIViQBxv1ADO4LcKOAAAAAElFTkSuQmCC");
			draw.setOrigin(50, 25);
			draw.rect(-50, -25, 50, 25, "rgba(255,   0,   0, 0.5)");
			draw.rect(  0, -25, 50, 25, "rgba(  0, 255,   0, 0.5)");
			draw.rect(-50,   0, 50, 25, "rgba(  0,   0, 255, 0.5)");
			draw.rect(  0,   0, 50, 25, "rgba(255, 255,   0, 0.5)");
			draw.text("Click to clear", -42, -5);
			draw.clear();

			testbed.verify();
		},

		image: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAEaElEQVR4Xu2bXUhUQRTHf74XJQYRRIEWQRBFGUVoUFEuRi8RaWUPkWX2BUUpFX3Th/b5khoZBUW6JT6lrPqW9VAZUUFQofQQRA9mUe/G3Knd2c3dO+Peq3eXuU/izsyZOb/5nzNn7m4O9gmUB3ICNRs7GSyQgG0CC8QCCZgHAjYdqxALJGAeCNh0rEIskIB5IGDTiSpkGIbHc27rxtU6PJ4zzhP4mOOwsED+7kILJEGOViFWIXFbwirEKiTeAzaHxPsj+xSSnw/9/dDVBaGQ8YFtNDlkLkWsZS8LWcMEch2bX+nnNd20c5lvDGjPYzRAihbB3i2wpghyJ0lTXb1wtx1aO7VNy4aeKiQvDyIRKCwcMyDVNFBKdcpV17OJXlq1PGMKpOEkVG9OPnTfOwhVwuAPLfMeAlFhOFvEf4Vs5RwbOaq10lqKec9T17YmQGoqoe6w65COWgQUrccThYgwFQ5LZfx7fAYylXya6Xes/WaIR1zkGW3R8LSIUrZwmtnIOX2ij4MsdvWJLpC8yfCpW4aooZ+w+xS8eAsDX0B8tnoZNJyKhbC1O6Dziat5DxRSVQUXLkCujN0MDcm/fQaynhq2UeeYTLb7J5LHFZ4zjQKnXSUFrvlEF0h5KbRck0su3gxPX/3vbJFbeh/I/59vgmN/26fEkpZCWluhrCwGoqIC9u+HkhLfgZwmwkJKnOS9k1lJ1xiiij00pQSndtYForHXnSbDH2RL7bCVFhCRwIXzGxvh+HEYHJRJfQyA6DpEnMDq6B13IGOjEBGuenpgQDlWBgyImvjXaXx1wEuFlC6Hjlupw9p/GysthYy0TQMERM0hTwhziXJXYXkBJH86bAjFTmDa6hCzy2Ygao2yjwV85o2vQEY6Bm86YFgcZisQFcYNdhHhpisM0SAdhQggK5dKM7NmQsGM2Anr6h3N4jAbgagwOmmkkd1aMNIFkmhE5JD7l2UtIir2xRs0ppFNQETOqOBs9CrFFIbXQMR4ai2iFb6yBYio3GsJRyvzh5znHsc0tmR8k3RCVjJjL9ugcB6EO6D8oMuUsgGIuCY5xP3oTa/JZWKie/wAEmmGkmLN4jDTgRRTTg0tjl/FndYRVmidppLtU10g6i3vlCWpE/b3FzKPaFXrmQxEhSEuD08S4heDxmFK7aALRL3Lqr0E9c0jm60qg6YzsdOW631WpgIROeM6fU6Y8gqGSVJXb3tFPwGlLSJve8Uzf44MU+r1fMGq2OdJd02mAtF5MZW46DvU0k59SgXpKkQMoqrETZa7TsDNsFurDK7UW/geTeIay3SaeA1EF4o2DDFgJipEfTmlC8MvIGJccXd1aLt8p/6vOheFYPczuP1II0ypi/AciImHRmg7mi85pGkyrrtJyPLSbnQsCyTerRZIwjazCrFfJbUhK1XstQpJUIgvicoOauwB+5M2Y5f528EC8de/xqNbIMYu87eDBeKvf41Ht0CMXeZvBwvEX/8aj26BGLvM3w4WiL/+NR79DzN9CFFVS7lVAAAAAElFTkSuQmCC");
			draw.image(testImage, 2, 9);

			testbed.verify();
		},

		imageEx: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAEoklEQVR4Xu2bXWwUVRTHf8tL+2Dlw0SDPkhKbUFjAhXBJlYtaWjTUggGoVBEGkxpq9JIKtWiJQ3YbEEIH8JalaB8lfJRUaDZGgIpxYCUgPRBBMPXQ2OaKE3RygPENbPrbsfuzs5MZ3Z3Zvfu85l7zv3/7rnn3jOzDsTPUgo4LBWNCAYBxGKLQACxPJB0j8fUGK85BHQdggaLJYDokM98UwHEfE0NjSiAGJLP/IcFEPM1NTSiZYDM9GDuYUKnLMcc1rgC6AYy/QXYvhoyUqHjPLzbAJeuhJm9xlOWAOLTUBeQnGlwctf/xe/9HSYWQF+/AhQBRFeu6gLyrQtmTQ8e/3A7zF0ugOhSXsFYM5BRD0PPaei7C7PKofsaFL4E+zbCPx5Iy4XeP0J4ERmii5NmIEWvwHdNkDUPzl0e9LF5FZTNh8w5cOW6AKJL/RDGmoEoOapaDOtr4OUSOPtTdIE8zYsU8jaZzOAhRnud/8Z1LvE9rXxCLzc062PbU9bQGUpAnNXRz5AKtlNARVjB17GATvZrghI3QJrqYUERjMuBO6FOWhGoIa/zMfOo1SR0Ddn8zBlVW9sDSU6CpXPh0zr4aBOsdUXnlPUYqXyJr1j9RR8HcfIDhwLb03MUUEI9TzHFa/MrF1jB8/ENZE4utG7zzbGtAwrLwszX5Ax5lZWU0uh1qLT6U3iEDfzIWMZ77d5kvGo9sXWGSECWFcOTT8CEVKjbDM4v4P79yBf1etxkkuct3mWkKa6EfJbxFp+FBSd/2NZA5BORjr2VJZD7BnR0RR6I6t7zn4F0AmukM/GAPP4o9HTChh1Qvc46QOSFv0hD3zBuMkRCcLEVBu5Bdok1gMhryGlaWE+xamLFFZATO2HMKN9dJOhnclFXVRaQ31HeYRK3kLUWFAawHZA1VfBhJYyZGtzZ7TsPN3usAUQOYxvluGnSwhDbAfH3sqrWwpbdg3N8Nh26j8IhN7xWFdsMkcNow4WLSlUYR2P8TYxjyCsQzb0sf7dX+qhnRimcuQgTU8H5nq8lX14HTS2xASLVjEWsCbRStMKQorUtECn4r52wOESd+PsePFMIt3qiD0S6udfQEriZH6CB3axSzQy/ga2BpI+Dq+3Bcy19H776RkGDCBZ1qU1SzZ5Ap1dPM9E0ICNGQEoKPHgAAwOaF4LfcNhbln8AaZva0QBZk6H7F3B+Ds3Hw8QRISDZFLOSZq9jqaf1ATmaTlNDIzWUIRKIxkaoqID2dsjPjz4Q3R4jAEQOQ2oeriafPwn1ulI92mEBSU6GrCxwuSAjw+ckUYFINWMTF7zblFEYwyrqCxdCbS2kpUFSEvT3w8iRiQtEy4upoXmxkxpaCdXX0XnKOnIEZs+Gri5oa4O9e2HrVsjLS1wgzdwJFHH1DclnYRqQJUvg1Cm4fXvQtduduEDkL6e0wjAVSCinEQeiZ6Ym2sbqy8VhFXX5vAUQE1eBGTd1AUQAMVcBhdHEluUTJsa9zkE6AojFgEQlDUM48WDwfynxWkMEEJEhXgUMZ4jBlaTe7TXowG6PCyAWIyaAWAyI1cKxzLHXasLEKh4BJFbKK/gVQCwG5F+7ZO5CS9aq+gAAAABJRU5ErkJggg==");
			draw.imageEx(testImage, 32, 0, 32, 32, 34,  9, 32, 32);
			draw.imageEx(testImage,  0, 0, 32, 32, 64, 26, 32, 20);
			draw.imageEx(testImage, 64, 0, 32, 32,  4,  4, 20, 32);

			testbed.verify(0.01, 0.01);
		},

		resize: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAYAAABzVH1EAAABDklEQVRYR+3VoUoFQRTG8d99Bh9C30GTwWC0GMw+gKBRBX0AmyBGtdotBtEq2LRZDWajMnAGlkWXuVx2uF5m43DOzvl/33eYiQX5JgvCoYHMm5NdR1bx2BnwCKfzNvBf8/SjtYtbfGInmm7+A8wQyBK2cBlQ1wGUnUqgB/jABi6why8c4qRXP6oeJSAP2MRZTJIA3vEcZ1d4QnZzpRfR1LYWNaPBDIEsIw31OgCyj/OIYhdkvfZ+DS37XUQq78tv0UpnKWr34UKOV4pkrn/BNt5Gs4Np3pHv4zEHmfXfUzyIDWRWsYv6myNFMlUsao5UFLvoquZIkUwVi5ojFcUuuqo5UiRTxaLmSEWxi676AU4gR3zxrSfLAAAAAElFTkSuQmCC");

			draw.resize(50, 25);
			draw.rect(10, 10, 80, 30, "rgba(0, 0, 255, 0.5)");
			draw.text("Done", 2, 2);

			testbed.verify(0.01, 0.05);
		},

		resizeSetOrigin: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABLCAYAAACSoX4TAAACNklEQVR4Xu2bUYoCURAD3zu57MlHZG8QKAiT8r/Ddipk7VHvc87nvOB1nxcs8Vvhnr83bPLjYbCaSBqsJhrn2Fh9PGysJiY2VhMNG6uLxj8PG6uJio3VRMPG6qJhY7Xx8HFDGxGvwi4ivsfq4mFj1fHwyXsVEhurCocf6bTh8Ml7GREbqwyIH0KXAfEq7AJiY3Xx8Cqs4+FVWIXExqrC4VXYhsOrsIyIjVUGxKuwDIhXYRcQG6uLh1dhHQ+vwiokNlYVDq/CNhxehWVE7jnPK77z/jy3zNrsz7lv+c67wcoCQE0ZLMrZUNfGCo2DxvxXCBmbytpYqXPQnI0FGRvK2lihcdSYjUU5G+raWKFx0JiNBRmbytpYqXPQnI0FGRvK2lihcdSYjUU5G+raWKFx0JiNBRmbytpYqXPQnI0FGRvK2lihcdSYjUU5G+raWKFx0JiNBRmbytpYqXPQnI0FGRvK2lihcdSYjUU5G+raWKFx0JiNBRmbytpYqXPQnI0FGRvK2lihcdSYjUU5G+raWKFx0JiNBRmbytpYqXPQnI0FGRvKvuNXnuHyjnEOGCzO22llgzWNn1veYHHeTisbrGn83PIGi/N2WtlgTePnljdYnLfTygZrGj+3vMHivJ1WNljT+LnlDRbn7bSywZrGzy1vsDhvp5UN1jR+bnmDxXk7rWywpvFzyxsszttpZYM1jZ9b3mBx3k4rG6xp/NzyBovzdlrZYE3j55Y3WJy308oGaxo/t/wXJ8SvTHPq2NoAAAAASUVORK5CYII=");
			draw.setOrigin(50, 25);
			draw.resize(150, 75);
			draw.rect(-50, -25, 50, 25, "rgba(255,   0,   0, 0.5)");
			draw.rect(  0, -25, 50, 25, "rgba(  0, 255,   0, 0.5)");
			draw.rect(-50,   0, 50, 25, "rgba(  0,   0, 255, 0.5)");
			draw.rect(  0,   0, 50, 25, "rgba(255, 255,   0, 0.5)");

			testbed.verify();
		},

		resizeClear: function () {
			initDrawing("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAACnklEQVR4Xu3VsRHAMAzEsHj/pTOBXbB9pFchyLycz0eAwFXgsCFA4C4gEK+DwENAIJ4HAYF4AwSagD9IczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpE4Af1gABlH0hlGgAAAABJRU5ErkJggg==");
			draw.resize(200, 100);
			draw.rect(0, 0, 200, 100, "green");
			draw.text("Click to clear", 5, 5);
			draw.clear();

			testbed.verify();
		},
	};
})();
