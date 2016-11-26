(function () {
	"use strict";

	var mocks = {
		document: {
			body: {
				clientWidth: 640,
				clientHeight: 480
			},
			createElement: function (type) {
				return document.createElement(type);
			}
		}
	};

    var bootstrap;

	var basicMode = function () {
		var mode = {};
		mode.onInit = Test.mockFunction();
		mode.onFrame = Test.mockFunction();
		mode.onShutdown = Test.mockFunction();

		return mode;
	};

    window.Tests.BootstrapTests = {
		beforeTest: function () {
			var t = 123;
			mocks.document.body.appendChild = Test.mockFunction();
			mocks["ChickenVis.requestAnimationFrame"] = Test.mockFunction();
			mocks["Date.now"] = function () { return t += 17; };
			bootstrap = Chicken.fetch("ChickenVis.Bootstrap", mocks);
		},

        init: function () {
			var mode = basicMode();
			var kernel = bootstrap(mode);

			Assert.isEqual(640, kernel.draw.canvas.width);
			Assert.isEqual(480, kernel.draw.canvas.height);
			Assert.isEqual(1, mocks.document.body.appendChild.calls.length);
			Assert.isSame(kernel.draw.canvas, mocks.document.body.appendChild.calls[0][0]);
			Assert.isEqual(1, mode.onInit.calls.length);
			Assert.isSame(mode, kernel.currentMode);
			Assert.isSame(kernel, mode.onInit.calls[0][0]);
			Assert.isTrue(kernel.paused);
        },

		kernel_step: function () {
			var mode = basicMode();
			var kernel = bootstrap(mode);

			kernel.step(100);
			Assert.isEqual(1, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[0][0]);
			Assert.isEqual(100, mode.onFrame.calls[0][1]);

			kernel.step(16);
			Assert.isEqual(2, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[1][0]);
			Assert.isEqual(16, mode.onFrame.calls[1][1]);
		},

		kernel_frameUpdates: function () {
			var requestFrame = mocks["ChickenVis.requestAnimationFrame"];
			var mode = basicMode();
			var kernel = bootstrap(mode);

			kernel.paused = false;
			Assert.isEqual(1, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[0][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[0][1]);
			Assert.isEqual(1, requestFrame.calls.length);

			requestFrame.calls[0][0]();
			Assert.isEqual(2, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[1][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[1][1]);
			Assert.isEqual(2, requestFrame.calls.length);
		},

		kernel_logicUpdates_tiedToFrameRate: function () {
			var requestFrame = mocks["ChickenVis.requestAnimationFrame"];
			var mode = basicMode();
			mode.onUpdate = Test.mockFunction();
			var kernel = bootstrap(mode);

			kernel.paused = false;
			Assert.isEqual(1, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[0][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[0][1]);
			Assert.isEqual(1, mode.onUpdate.calls.length);
			Assert.isSame(kernel, mode.onUpdate.calls[0][0]);
			Assert.isEqual(0.017, mode.onUpdate.calls[0][1]);
			Assert.isEqual(1, requestFrame.calls.length);

			requestFrame.calls[0][0]();
			Assert.isEqual(2, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[1][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[1][1]);
			Assert.isEqual(2, mode.onUpdate.calls.length);
			Assert.isSame(kernel, mode.onUpdate.calls[1][0]);
			Assert.isEqual(0.017, mode.onUpdate.calls[1][1]);
			Assert.isEqual(2, requestFrame.calls.length);
		}
    };
})();
