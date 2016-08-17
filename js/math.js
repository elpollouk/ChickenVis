Chicken.register("ChickenVis.Math", [], function () {
    "use strict";

    var MathEx = {
        //---------------------------------------------------------------------------------------//
        // Constants
        //---------------------------------------------------------------------------------------//
        TWO_PI: 2 * Math.PI,

        //---------------------------------------------------------------------------------------//
        // Random
        //---------------------------------------------------------------------------------------//
        randomInt: function MathEx_randomInt(limit) {
            return Math.floor(Math.random() * limit);
        },

        randomRange: function MathEx_randomRange(min, max) {
            return Math.random() * (max - min) + min;
        },

        randomRangeInt: function MathEx_randomRangeInt(min, max) {
            return Math.floor(MathEx.randomRange(min, max));
        },


        //---------------------------------------------------------------------------------------//
        // Vector2
        //---------------------------------------------------------------------------------------//
        vector2: function MathEx_vector2(x, y) {
            return {x:x, y:y};
        },

        clone2: function MathEx_clone2(v) {
            return {x:v.x, y:v.y};
        },

        length2: function MathEx_length2(v) {
            return Math.sqrt((v.x * v.x) + (v.y * v.y));
        },

        lengthSqrd2: function MathEx_lengthSqrd2(v) {
            return (v.x * v.x) + (v.y * v.y);
        },

        dot2: function MathEx_dot2(v1, v2) {
            return (v1.x * v2.x) + (v1.y * v2.y);
        },

        add2: function MathEx_add2(v1, v2) {
            v1.x += v2.x;
            v1.y += v2.y;
        },

        addAndClone2: function MathEx_addAndClone2(v1, v2) {
            return {
                x: v1.x + v2.x,
                y: v1.y + v2.y
            };
        },

        sub2: function MathEx_sub2(v1, v2) {
            v1.x -= v2.x;
            v1.y -= v2.y;
        },

        subAndClone2: function MathEx_subAndClone2(v1, v2) {
            return {
                x: v1.x - v2.x,
                y: v1.y - v2.y
            };
        },

        normalise2: function MathEx_normalise2(v) {
            if (v.x === 0 && v.y === 0) return;
            var len = MathEx.length2(v);
            v.x /= len;
            v.y /= len;
        },

        normaliseAndClone2: function MathEx_normaliseAndClone2(v) {
            if (v.x === 0 && v.y === 0) return {x:0, y:0};
            var len = MathEx.length2(v);
            if (len === 0) return {x:0,y:0};
            return {x: v.x/len, y: v.y/len};
        },

        scale2: function MathEx_scale2(v, scale) {
            v.x *= scale;
            v.y *= scale;
        },

        scaleAndClone2: function MathEx_scaleAndClone2(v, scale) {
            return {x:v.x*scale, y:v.y*scale};
        },

        scaleAdd2: function MathEx_scaleAdd2(v1, v2, scale) {
            v1.x += (v2.x * scale);
            v1.y += (v2.y * scale);
        },

        slerp2: function MathEx_slerp2(v1, v2, alpha) {
            v1.x += (v2.x - v1.x) * alpha;
            v1.y += (v2.y - v1.y) * alpha;
        },

        slerpAndClone2: function MathEx_scaleAndClone2(v1, v2, alpha) {
            return {
                x: v1.x + ((v2.x - v1.x) * alpha),
                y: v1.y + ((v2.y - v1.y) * alpha)
            };
        }
    };

    // Import standard Math functions an properties
    var props = Object.getOwnPropertyNames(Math);
    for (var i = 0; i < props.length; i++) {
        MathEx[props[i]] = Math[props[i]];
    }

    return MathEx;
});
