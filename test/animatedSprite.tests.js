(function () {
    "use strict";

    var AnimatedSprite = Chicken.fetch("ChickenVis.AnimatedSprite");

    var MockDraw;
    var TestImage = {};
    var TestSpec = {
        numFrames: 4,
        frameTime: 0.5,
        frameWidth: 16,
        frameHeight: 32,
    };
    var TestSpec_OverriddenRenderSize = {
        numFrames: 4,
        frameTime: 0.5,
        frameWidth: 16,
        frameHeight: 32,
        renderWidth: 24,
        renderHeight: 48,
    };

    function verifyDrawCall(call, image, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight) {
        dstX = dstX || 0;
        dstY = dstY || 0;
        dstWidth = dstWidth || srcWidth;
        dstHeight = dstHeight || srcHeight;

        Assert.isSame(image, call[0], "Wrong image source passed to drawApi.imageEx");
        Assert.isSame(srcX, call[1], "Wrong srcX passed to drawApi.imageEx");
        Assert.isSame(srcY, call[2], "Wrong srcY passed to drawApi.imageEx");
        Assert.isSame(srcWidth, call[3], "Wrong srcWidth passed to drawApi.imageEx");
        Assert.isSame(srcHeight, call[4], "Wrong srcHeight passed to drawApi.imageEx");
        Assert.isSame(dstX, call[5], "Wrong dstX passed to drawApi.imageEx");
        Assert.isSame(dstY, call[6], "Wrong dstY passed to drawApi.imageEx");
        Assert.isSame(dstWidth, call[7], "Wrong dstWidth passed to drawApi.imageEx");
        Assert.isSame(dstHeight, call[8], "Wrong dstHeight passed to drawApi.imageEx");
    }

    window.Tests.AnimatedSpriteTests = {
        beforeTest: function () {
            MockDraw = {
                imageEx: Test.mockFunction()
            };
        },

        render_noUpdates: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 0, 0, 16, 32);
        },

        render_noUpdates_overriddenRenderSize: function () {
            var s = new AnimatedSprite(TestImage, TestSpec_OverriddenRenderSize);

            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 0, 0, 16, 32, 0, 0, 24, 48);
        },

        render_oneFrameUpdate: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.5);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 16, 0, 16, 32);
        },

        render_twoFrameUpdates: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.5);
            s.update(0.5);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 32, 0, 16, 32);
        },

        render_threeFrameUpdates: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.5);
            s.update(0.5);
            s.update(0.5);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 48, 0, 16, 32);
        },

        render_animationCycle: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.5);
            s.update(0.5);
            s.update(0.5);
            s.update(0.5);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 0, 0, 16, 32);
        },

        render_oneUpdateTwoFrames: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(1);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 32, 0, 16, 32);
        },

        render_subFrameUpdate_noFrameAdvance: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.3);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 0, 0, 16, 32);
        },

        render_subFrameUpdate_frameAdvanced: function () {
            var s = new AnimatedSprite(TestImage, TestSpec);

            s.update(0.3);
            s.update(0.3);
            s.render(MockDraw);

            var calls = MockDraw.imageEx.calls;
            Assert.isSame(1, calls.length, "drawApi.imageEx called wrong number of times");
            verifyDrawCall(calls[0], TestImage, 16, 0, 16, 32);
        },
    }

})();
