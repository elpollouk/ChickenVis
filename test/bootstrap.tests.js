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

		init_noModeInit: function () {
			var kernel = bootstrap({});

			Assert.isEqual(640, kernel.draw.canvas.width);
			Assert.isEqual(480, kernel.draw.canvas.height);
			Assert.isEqual(1, mocks.document.body.appendChild.calls.length);
			Assert.isSame(kernel.draw.canvas, mocks.document.body.appendChild.calls[0][0]);
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
		},

		kernel_logicUpdates_fixedDelta: function () {
			var requestFrame = mocks["ChickenVis.requestAnimationFrame"];
			var mode = basicMode();
			mode.onUpdate = Test.mockFunction();
			mode.updateDelta = 0.01;
			var kernel = bootstrap(mode);

			kernel.paused = false;
			Assert.isEqual(1, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[0][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[0][1]);
			Assert.isEqual(1, mode.onUpdate.calls.length);
			Assert.isSame(kernel, mode.onUpdate.calls[0][0]);
			Assert.isEqual(0.01, mode.onUpdate.calls[0][1]);
			Assert.isEqual(1, requestFrame.calls.length);

			requestFrame.calls[0][0]();
			Assert.isEqual(2, mode.onFrame.calls.length);
			Assert.isSame(kernel, mode.onFrame.calls[1][0]);
			Assert.isEqual(0.017, mode.onFrame.calls[1][1]);
			Assert.isEqual(3, mode.onUpdate.calls.length);
			Assert.isSame(kernel, mode.onUpdate.calls[1][0]);
			Assert.isEqual(0.01, mode.onUpdate.calls[1][1]);
			Assert.isSame(kernel, mode.onUpdate.calls[2][0]);
			Assert.isEqual(0.01, mode.onUpdate.calls[2][1]);
			Assert.isEqual(2, requestFrame.calls.length);
		},

		kernel_changeMode: function () {
			var mode1 = basicMode();
			var mode2 = basicMode();

			var kernel = bootstrap(mode1);
			kernel.currentMode = mode2;

			Assert.isEqual(1, mode1.onShutdown.calls.length);
			Assert.isSame(kernel, mode1.onShutdown.calls[0][0]);
			Assert.isEqual(1, mode2.onInit.calls.length);
			Assert.isSame(kernel, mode2.onInit.calls[0][0]);
		},

		kernel_changeMode_noModeShutdown: function () {
			var mode1 = {};
			var mode2 = basicMode();

			var kernel = bootstrap(mode1);
			kernel.currentMode = mode2;

			Assert.isEqual(1, mode2.onInit.calls.length);
			Assert.isSame(kernel, mode2.onInit.calls[0][0]);
		},

		kernel_changeMode_updateDeltaChanged: function () {
			var requestFrame = mocks["ChickenVis.requestAnimationFrame"];
			var mode1 = basicMode();
			mode1.onUpdate = Test.mockFunction();
			var mode2 = basicMode();
			mode2.onUpdate = Test.mockFunction();
			mode2.updateDelta = 0.015;

			var kernel = bootstrap(mode1);
			kernel.currentMode = mode2;

			kernel.paused = false;

			Assert.isEqual(0, mode1.onFrame.calls.length);
			Assert.isEqual(0, mode1.onUpdate.calls.length);

			Assert.isEqual(1, mode2.onFrame.calls.length);
			Assert.isSame(kernel, mode2.onFrame.calls[0][0]);
			Assert.isEqual(0.017, mode2.onFrame.calls[0][1]);
			Assert.isEqual(1, mode2.onUpdate.calls.length);
			Assert.isSame(kernel, mode2.onUpdate.calls[0][0]);
			Assert.isEqual(0.015, mode2.onUpdate.calls[0][1]);
			Assert.isEqual(1, requestFrame.calls.length);

			requestFrame.calls[0][0]();
			Assert.isEqual(2, mode2.onFrame.calls.length);
			Assert.isSame(kernel, mode2.onFrame.calls[1][0]);
			Assert.isEqual(0.017, mode2.onFrame.calls[1][1]);
			Assert.isEqual(2, mode2.onUpdate.calls.length);
			Assert.isSame(kernel, mode2.onUpdate.calls[1][0]);
			Assert.isEqual(0.015, mode2.onUpdate.calls[1][1]);
			Assert.isEqual(2, requestFrame.calls.length);
		}
    };
})();
