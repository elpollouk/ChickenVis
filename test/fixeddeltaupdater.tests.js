(function () {
	"use strict";

    var FixedDeltaUpdater = Chicken.fetch("ChickenVis.FixedDeltaUpdater");

	window.Tests.FixedDeltaUpdaterTests = {
		construct: function () {
			var fdu = new FixedDeltaUpdater(function () {}, 1/60);
			Assert.isEqual(1/60, fdu.deltaTime);
			Assert.isEqual(0, fdu.currentTime);

			var fdu = new FixedDeltaUpdater(function () {}, 16);
			Assert.isEqual(16, fdu.deltaTime);
			Assert.isEqual(0, fdu.currentTime);
		},

		update_matchDelta: function () {
			var fixedDt = 1/30;
			var count = 0;

			var fdu = new FixedDeltaUpdater(function (dt, t) {
				count++;
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(count * fixedDt, t);
				Assert.isEqual(fdu.currentTime, t);
			}, fixedDt);

			fdu.update(fixedDt);
			Assert.isEqual(fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(1, count);

			fdu.update(fixedDt);
			Assert.isEqual(2*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(2, count);

			fdu.update(fixedDt);
			Assert.isEqual(3*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(3, count);

			fdu.update(fixedDt);
			Assert.isEqual(4*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(4, count);
		},

		update_realDeltaHigher: function () {
			var fixedDt = 10;
			var realDt = 34;
			var count = 0;

			var fdu = new FixedDeltaUpdater(function (dt, t) {
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(fdu.currentTime, t);
				count++;
			}, fixedDt);

			fdu.update(realDt);
			Assert.isEqual(3*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(3, count);

			fdu.update(realDt);
			Assert.isEqual(6*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(6, count);

			fdu.update(realDt);
			Assert.isEqual(10*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(10, count);

			fdu.update(realDt);
			Assert.isEqual(13*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(13, count);
		},

		update_realDeltaLower: function () {
			var fixedDt = 1/10;
			var realDt = 1/17;
			var count = 0;

			var fdu = new FixedDeltaUpdater(function (dt, t) {
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(fdu.currentTime, t);
				count++;
			}, fixedDt);

			fdu.update(realDt);
			Assert.isEqual(0, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(0, count);

			fdu.update(realDt);
			Assert.isEqual(1*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(1, count);

			fdu.update(realDt);
			Assert.isEqual(1*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(1, count);

			fdu.update(realDt);
			Assert.isEqual(2*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(2, count);
		},

		update_realDeltaVariable: function () {
			var fixedDt = 10;
			var count = 0;

			var fdu = new FixedDeltaUpdater(function (dt, t) {
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(fdu.currentTime, t);
				count++;
			}, fixedDt);

			fdu.update(25);
			Assert.isEqual(2*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(2, count);

			fdu.update(3);
			Assert.isEqual(2*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(2, count);

			fdu.update(13);
			Assert.isEqual(4*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(4, count);

			fdu.update(10);
			Assert.isEqual(5*fixedDt, fdu.currentTime);
			Assert.isEqual(fixedDt, fdu.deltaTime);
			Assert.isEqual(5, count);
		},

		reset: function () {
			var count = 0;
			var fdu = new FixedDeltaUpdater(function () {
				count++;
			}, 20);
			fdu.update(30);
			fdu.update(30);
			fdu.update(30);
			fdu.reset();

			Assert.isEqual(0, fdu.currentTime);
			Assert.isEqual(20, fdu.deltaTime);
			count = 0;

			// Check that the accumulator has been cleared
			for (var i = 0; i < 19; i++) {
				fdu.update(1);
				Assert.isEqual(0, count);
			}

			fdu.update(1);
			Assert.isEqual(1, count);
		}
	};
})();
