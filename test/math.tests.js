(function () {
    "use strict";

    var MathEx = Chicken.fetch("ChickenVis.Math");

    var createTargetArray = function(size) {
        var target = [];
        while (size) {
            size--;
            target.push(0);
        }

        return target;
    };

    window.Tests.MathTests = {
        //---------------------------------------------------------------------------------------//
		// Constants and import tests
		//---------------------------------------------------------------------------------------//
        quaterPi: function () {
            Assert.isEqual(Math.PI / 4, MathEx.QUARTER_PI);
        },

        halfPi: function () {
            Assert.isEqual(Math.PI / 2, MathEx.HALF_PI);
        },

        twoPi: function () {
            Assert.isEqual(Math.PI * 2, MathEx.TWO_PI);
        },

        mathImports: function () {
            var props = Object.getOwnPropertyNames(Math);
            for (var i = 0; i < props.length; i++) {
                Assert.isTrue(props[i] in MathEx, "Property " + props[i] + " not found in MathEx");
            }
        },

        //---------------------------------------------------------------------------------------//
		// Random tests
		//---------------------------------------------------------------------------------------//
        randomInt: function () {
            var target = createTargetArray(10);

            for (var i = 0; i < 10000; i++) {
                var v = MathEx.randomInt(target.length);
                Assert.isInRange(0, target.length-1, v);
                target[v]++;
		    }

		    var output = "Values = ";
		    for (var i = 0; i < target.length; i++) {
		        Assert.isFalse(target[i] === 0, "Target " + i + " was not touched");
		        output += target[i] + ", ";
		    }

		    Test.log(output);
		},

		randomRange: function () {
		    for (var i = 0; i < 10000; i++) {
		        var v = MathEx.randomRange(-100, 100);
		        Assert.isInRange(-100, 100, v);
		    }
		},

		randomRangeInt: function () {
		    var target = createTargetArray(10);
		    var min = 20;

		    for (var i = 0; i < 10000; i++) {
		        var v = MathEx.randomRangeInt(min, min + target.length);
		        Assert.isInRange(min, min + target.length, v);
		        target[v - min]++;
            }

            var output = "Values = ";
            for (var i = 0; i < target.length; i++) {
                Assert.isFalse(target[i] === 0, "Target " + i + " was not touched");
                output += target[i] + ", ";
            }

            Test.log(output);
		},


		//---------------------------------------------------------------------------------------//
		// Vector 2 tests
		//---------------------------------------------------------------------------------------//
		vector2: function () {
		    var v = MathEx.vector2(1, 2);
		    Assert.isEqual(1, v.x);
		    Assert.isEqual(2, v.y);

		    v = MathEx.vector2(3, -4);
		    Assert.isEqual(3, v.x);
		    Assert.isEqual(-4, v.y);
		},

		clone2: function () {
		    var v1 = MathEx.vector2(5, 7);
		    var v2 = MathEx.clone2(v1);
		    Assert.isFalse(v1 === v2, "Vector was not cloned");
		    Assert.isEqual(5, v2.x);
		    Assert.isEqual(7, v2.y);
        },

		length2: function () {
		    var expectedLength = Math.sqrt(25 + 49);
		    var v = MathEx.vector2(-5, 7);
		    Assert.isEqual(expectedLength, MathEx.length2(v));

		    v = MathEx.vector2(0, 0);
		    Assert.isEqual(0, MathEx.length2(v));
        },

        lengthSqrd2: function () {
            var v = MathEx.vector2(-3, -6);
            Assert.isEqual(9+36, MathEx.lengthSqrd2(v));

            v = MathEx.vector2(0, 0);
            Assert.isEqual(0, MathEx.length2(v));
        },

        dot2: function () {
            var v1 = MathEx.vector2(10, -30);
            var v2 = MathEx.vector2(-20, 40);
            Assert.isEqual(-1400, MathEx.dot2(v1, v2));

            v1 = MathEx.vector2(2.5, -1.5);
            v2 = MathEx.vector2(0.5, 4.5);
            Assert.isEqual(-5.5, MathEx.dot2(v1, v2));

            v1 = MathEx.vector2(2, 4);
            v2 = MathEx.vector2(6, 8);
            Assert.isEqual(44, MathEx.dot2(v1, v2));
        },

        angleBetween2: function () {
            var v1 = MathEx.vector2(1, 1);
            var v2 = MathEx.vector2(1, -1);
            Assert.isEqual(MathEx.HALF_PI, MathEx.angleBetween2(v1, v2));

            v1 = MathEx.vector2(1, 1);
            v2 = MathEx.vector2(-1, 1);
            Assert.isEqual(-MathEx.HALF_PI, MathEx.angleBetween2(v1, v2));

            v1 = MathEx.vector2(0, 1);
            v2 = MathEx.vector2(0, -4);
            Assert.isEqual(MathEx.PI, MathEx.angleBetween2(v1, v2));

            v1 = MathEx.vector2(12, 0);
            v2 = MathEx.vector2(0.5, 0);
            Assert.isEqual(0, MathEx.angleBetween2(v1, v2));

            v1 = MathEx.vector2(-3, -3);
            v2 = MathEx.vector2(0, -1);
            Assert.isEqual(-MathEx.QUARTER_PI, MathEx.angleBetween2(v1, v2));
        },

        distanceBetween2: function () {
            var v1, v2;

            v1 = MathEx.vector2(0, 0);
            v2 = MathEx.vector2(0, 1);
            Assert.isEqual(1, MathEx.distanceBetween2(v1, v2));
            Assert.isEqual(1, MathEx.distanceBetween2(v2, v1));

            v1 = MathEx.vector2(1, 0);
            v2 = MathEx.vector2(1, -5);
            Assert.isEqual(5, MathEx.distanceBetween2(v1, v2));
            Assert.isEqual(5, MathEx.distanceBetween2(v2, v1));

            v1 = MathEx.vector2(0, 1.5);
            v2 = MathEx.vector2(47, 56);
            MathEx.rotate2(v1, 3.5);
            MathEx.add2(v1, v2);
            Assert.isInRange(1.499, 1.501, MathEx.distanceBetween2(v1, v2));
            Assert.isInRange(1.499, 1.501, MathEx.distanceBetween2(v2, v1));
        },

        distanceBetweenSqrd2: function () {
            var v1, v2;

            v1 = MathEx.vector2(0, 0);
            v2 = MathEx.vector2(0, 1);
            Assert.isEqual(1, MathEx.distanceBetweenSqrd2(v1, v2));
            Assert.isEqual(1, MathEx.distanceBetweenSqrd2(v2, v1));

            v1 = MathEx.vector2(1, 0);
            v2 = MathEx.vector2(1, -5);
            Assert.isEqual(25, MathEx.distanceBetweenSqrd2(v1, v2));
            Assert.isEqual(25, MathEx.distanceBetweenSqrd2(v2, v1));

            v1 = MathEx.vector2(0, 1.5);
            v2 = MathEx.vector2(47, 56);
            MathEx.rotate2(v1, 3.5);
            MathEx.add2(v1, v2);
            Assert.isInRange(2.249, 2.251, MathEx.distanceBetweenSqrd2(v1, v2));
            Assert.isInRange(2.249, 2.251, MathEx.distanceBetweenSqrd2(v2, v1));
        },

        add2: function () {
            var v1 = MathEx.vector2(2, 3);
            var v2 = MathEx.vector2(4, 5);
            MathEx.add2(v1, v2);
            Assert.isEqual(6, v1.x);
            Assert.isEqual(8, v1.y);
            Assert.isEqual(4, v2.x);
            Assert.isEqual(5, v2.y);
        },

        addAndClone2: function () {
            var v1 = MathEx.vector2(3, 5);
            var v2 = MathEx.vector2(7, 11);
            var v3 = MathEx.addAndClone2(v1, v2);
            Assert.isEqual(3, v1.x);
            Assert.isEqual(5, v1.y);
            Assert.isEqual(7, v2.x);
            Assert.isEqual(11, v2.y);
            Assert.isEqual(10, v3.x);
            Assert.isEqual(16, v3.y);
        },

        sub2: function () {
            var v1 = MathEx.vector2(2, 6);
            var v2 = MathEx.vector2(4, 5);
            MathEx.sub2(v1, v2);
            Assert.isEqual(-2, v1.x);
            Assert.isEqual(1, v1.y);
            Assert.isEqual(4, v2.x);
            Assert.isEqual(5, v2.y);
        },

        subAndClone2: function () {
            var v1 = MathEx.vector2(3, 5);
            var v2 = MathEx.vector2(7, 11);
            var v3 = MathEx.subAndClone2(v1, v2);
            Assert.isEqual(3, v1.x);
            Assert.isEqual(5, v1.y);
            Assert.isEqual(7, v2.x);
            Assert.isEqual(11, v2.y);
            Assert.isEqual(-4, v3.x);
            Assert.isEqual(-6, v3.y);
        },

        normalise2: function () {
            var expectedX = 4 / Math.sqrt(32);
            var expectedY = 4 / Math.sqrt(32);
            var v = MathEx.vector2(4, 4);
            MathEx.normalise2(v);
            Assert.isEqual(expectedX, v.x);
            Assert.isEqual(expectedY, v.y);
            Assert.isInRange(0.99, 1.01, MathEx.length2(v));

            v = MathEx.vector2(0, 0);
            MathEx.normalise2(v);
            Assert.isEqual(0, v.x);
            Assert.isEqual(0, v.y);
        },

        normaliseAndClone2: function () {
            var expectedX = 3 / Math.sqrt(9+4);
            var expectedY = -2 / Math.sqrt(9+4);
            var v1 = MathEx.vector2(3, -2);
            var v2 = MathEx.normaliseAndClone2(v1);
            Assert.isEqual(expectedX, v2.x);
            Assert.isEqual(expectedY, v2.y);
            Assert.isInRange(0.99, 1.01, MathEx.length2(v2));
            Assert.isEqual(3, v1.x);
            Assert.isEqual(-2, v1.y);

            v1 = MathEx.vector2(0, 0);
            v2 = MathEx.normaliseAndClone2(v1);
            Assert.isEqual(0, v1.x);
            Assert.isEqual(0, v1.y);
            Assert.isEqual(0, v2.x);
            Assert.isEqual(0, v2.y);
            Assert.isFalse(v1 === v2, "The input vector was returned from normaliseandClone2()");
        },

        scale2: function () {
            var v = MathEx.vector2(2, 3);
            MathEx.scale2(v, 4);
            Assert.isEqual(8, v.x);
            Assert.isEqual(12, v.y);

            MathEx.scale2(v, 0.5);
            Assert.isEqual(4, v.x);
            Assert.isEqual(6, v.y);

            MathEx.scale2(v, -1);
            Assert.isEqual(-4, v.x);
            Assert.isEqual(-6, v.y);
        },

        scaleAndClone2: function () {
            var v1 = MathEx.vector2(5, -1);
            var v2 = MathEx.scaleAndClone2(v1, 3.5);
            Assert.isEqual(5, v1.x);
            Assert.isEqual(-1, v1.y);
            Assert.isEqual(17.5, v2.x);
            Assert.isEqual(-3.5, v2.y);

            v1 = MathEx.scaleAndClone2(v2, -2);
            Assert.isEqual(-35, v1.x);
            Assert.isEqual(7, v1.y);
            Assert.isEqual(17.5, v2.x);
            Assert.isEqual(-3.5, v2.y);
        },

        scaleAdd2: function () {
            var v1 = MathEx.vector2(4, 12);
            var v2 = MathEx.vector2(50, 30);
            MathEx.scaleAdd2(v1, v2, 0.5);
            Assert.isEqual(29, v1.x);
            Assert.isEqual(27, v1.y);
            Assert.isEqual(50, v2.x);
            Assert.isEqual(30, v2.y);
        },

        slerp2: function () {
            var v1 = MathEx.vector2(20, 15);
            var v2 = MathEx.vector2(-10, 30);
            MathEx.slerp2(v1, v2, 0.7);
            Assert.isEqual(-1, v1.x);
            Assert.isEqual(25.5, v1.y);
            Assert.isEqual(-10, v2.x);
            Assert.isEqual(30, v2.y);
        },

        slerpAndClone2: function () {
            var v1 = MathEx.vector2(-20, -2);
            var v2 = MathEx.vector2(15, -12);
            var v3 = MathEx.slerpAndClone2(v1, v2, 0.4);
            Assert.isEqual(-20, v1.x);
            Assert.isEqual(-2, v1.y);
            Assert.isEqual(15, v2.x);
            Assert.isEqual(-12, v2.y);
            Assert.isEqual(-6, v3.x);
            Assert.isEqual(-6, v3.y);
        },

        rotate2: function () {
            var v = MathEx.vector2(0, 1);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(0.7, 0.71, v.x);
            Assert.isInRange(0.7, 0.71, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(0.99, 1.01, v.x);
            Assert.isInRange(-0.01, 0.01, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(0.7, 0.71, v.x);
            Assert.isInRange(-0.71, -0.7, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(-0.01, 0.01, v.x);
            Assert.isInRange(-1.01, -0.99, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(-0.71, -0.7, v.x);
            Assert.isInRange(-0.71, -0.7, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(-1.01, -0.99, v.x);
            Assert.isInRange(-0.01, 0.01, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(-0.71, -0.7, v.x);
            Assert.isInRange(0.7, 0.71, v.y);

            MathEx.rotate2(v, MathEx.QUARTER_PI);
            Assert.isInRange(-0.01, 0.01, v.x);
            Assert.isInRange(0.99, 1.01, v.y);
        },

        radsToDegrees: function () {
            Assert.isSame(0, MathEx.radsToDegrees(0));
            Assert.isSame(45, MathEx.radsToDegrees(MathEx.QUARTER_PI));
            Assert.isSame(90, MathEx.radsToDegrees(MathEx.HALF_PI));
            Assert.isSame(180, MathEx.radsToDegrees(MathEx.PI));
            Assert.isSame(360, MathEx.radsToDegrees(MathEx.TWO_PI));
        },

        degreesToRads: function () {
            Assert.isSame(0, MathEx.degreesToRads(0));
            Assert.isSame(MathEx.QUARTER_PI, MathEx.degreesToRads(45));
            Assert.isSame(MathEx.HALF_PI, MathEx.degreesToRads(90));
            Assert.isSame(MathEx.PI, MathEx.degreesToRads(180));
            Assert.isSame(MathEx.TWO_PI, MathEx.degreesToRads(360));
        }
    }
})();
