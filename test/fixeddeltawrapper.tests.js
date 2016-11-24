(function () {
	"use strict";

    var wrap = Chicken.fetch("ChickenVis.FixedDeltaWrapper");

	window.Tests.FixedDeltaWrapperTests = {
        update_matchDelta: function () {
			var fixedDt = 1/30;
			var count = 0;

			var update = wrap(function (dt, t) {
                count++;
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(count * fixedDt, t);
			}, fixedDt);

			update(fixedDt);
			Assert.isEqual(1, count);

			update(fixedDt);
			Assert.isEqual(2, count);

			update(fixedDt);
			Assert.isEqual(3, count);

			update(fixedDt);
			Assert.isEqual(4, count);
		},

        update_realDeltaHigher: function () {
			var fixedDt = 10;
			var realDt = 34;
			var count = 0;

			var update = wrap(function (dt, t) {
                count++;
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(count * fixedDt, t);
			}, fixedDt);

			update(realDt);
			Assert.isEqual(3, count);

			update(realDt);
			Assert.isEqual(6, count);

			update(realDt);
			Assert.isEqual(10, count);

			update(realDt);
			Assert.isEqual(13, count);
		},

        update_realDeltaLower: function () {
			var fixedDt = 1/10;
			var realDt = 1/17;
			var count = 0;

			var update = wrap(function (dt, t) {
                count++;
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(count * fixedDt, t);
			}, fixedDt);

			update(realDt);
			Assert.isEqual(0, count);

			update(realDt);
			Assert.isEqual(1, count);

			update(realDt);
			Assert.isEqual(1, count);

			update(realDt);
			Assert.isEqual(2, count);
		},

		update_realDeltaVariable: function () {
			var fixedDt = 10;
			var count = 0;

			var update = wrap(function (dt, t) {
                count++;
				Assert.isEqual(fixedDt, dt);
				Assert.isEqual(count * fixedDt, t);
			}, fixedDt);

			update(25);
			Assert.isEqual(2, count);

			update(3);
			Assert.isEqual(2, count);

			update(13);
			Assert.isEqual(4, count);

			update(10);
			Assert.isEqual(5, count);
		},
    };

})();
