(function () {
"use strict";

var SpritePallette = Chicken.fetch("ChickenVis.SpritePallette");
var TileMap = Chicken.fetch("ChickenVis.TileMap");

var gameSprites = [
    { x: 0, y: 0, w: 32, h: 32 },
    { x: 32, y: 0, w: 32, h: 32 },
    { x: 0, y: 32, w: 32, h: 32 },
    { x: 32, y: 32, w: 32, h: 32 }
];

function houseSpec(viewWidth, viewHeight, renderX, renderY) {
    return {
        mapWidth: 11,
        mapHeight: 11,
        viewWidth: viewWidth,
        viewHeight: viewHeight,
        x: renderX,
        y: renderY,
        tileWidth: 32,
        tileHeight: 32,
        mapArray: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
            0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0,
            0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0,
            0, 0, 1, 2, 2, 3, 2, 2, 1, 0, 0,
            0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0,
            0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0,
            0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]
    };
}

function newCanvas(width, height) {
    width = width || 100;
    height = height || 50;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return canvas;
}

function initTestbed(expectedImage, tileSpec, canvasWidth, canvasHeight) {
    var canvas = newCanvas(canvasWidth, canvasHeight);
    var sp = new SpritePallette(gametiles, gameSprites, canvas);

    tileSpec.pallette = sp;

    var tm = new TileMap(tileSpec);
    testbed = new CanvasTestBed(canvas, sp.context);

    if (expectedImage) testbed.setExpected(expectedImage);
    Test.log(testbed.rootElement);

    return tm;
}

var testbed;

window.Tests.TileMapTests = {
    properties: function () {
        var canvas = newCanvas();
        var sp = new SpritePallette(gametiles, gameSprites, canvas);
        var spec = houseSpec(100, 50);
        spec.pallette = sp;
        var tm = new TileMap(spec);

        Assert.isEqual(11, tm.mapWidth);
        Assert.isEqual(11, tm.mapHeight);
        Assert.isSame(spec.mapArray, tm.map);
        Assert.isSame(sp, tm.pallette);
    },

    construct_shortMapArray: function () {
        var canvas = newCanvas();
        var sp = new SpritePallette(gametiles, gameSprites, canvas);

        Assert.expectedException({
            message: "mapArray is too short for required map size. Expected " + (11*11) + ", actual 0",
        }, function () {
            var spec = houseSpec(100, 50);
            spec.mapArray = [];
            spec.pallette = sp;
            var tm = new TileMap(spec);
        });

        Assert.expectedException({
            message: "mapArray is too short for required map size. Expected " + (11*11) + ", actual 10",
        }, function () {
            var spec = houseSpec(100, 50);
            spec.mapArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
            spec.pallette = sp;
            var tm = new TileMap(spec);
        });
    },

    construct_noPallette: function () {
        Assert.expectedException({
            message: "No pallette provided in spec",
        }, function () {
            var spec = houseSpec(100, 50);
            var tm = new TileMap(spec);
        });
    },

    render_fullCanvas: function () {
        var tm = initTestbed(expected_render_fullCanvas.src,
            houseSpec(352, 352),
            352, 352);

        tm.render();

        testbed.verify();
    },

    render_smallerCanvas: function () {
        var tm = initTestbed("data:image/png;base64,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",
            houseSpec(100, 50),
            100, 50);

        tm.render();

        testbed.verify();
    },

    scrollTo: function () {
        var tm = initTestbed("data:image/png;base64,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",
            houseSpec(100, 50),
            100, 50);

        tm.scrollTo(58, 58);
        tm.render();

        testbed.verify();
    },

    scrollTo_beyondNegative: function () {
        var tm = initTestbed("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAALk0lEQVR4Xu2b244kV1aGv7UPkRl5qkNWdVVX2263jT3GRuYgBCNxmItB4gJpLpDgDsEgDZcggRAjEMwlr8ATIB6AJxgJuECDZBA2jY0PXe52dVd1ZWXlITIi9t4LReTY+Qp1ESWlVFIefulfe69Y61/rF340UQBR5Z2yZhITh0mZGeGTnufK2ebtb/4kJX65DDysA5VRPhkYvnSW/RImIfFKUAIwc5YPM0chMAD2QiIKXDtLeC/b/t4ywZPY/tvhb/mXrwPiVHl7U/FmHVkaw1fO8NQ7FqZhq6WMwSoxWsKRibzlahgoRV/5sm95UWyDclon+qpsxHBlhbkxZLVyEBJBDM8zw+UDB2KgUFi354EOf8v/NiApkQOPqsAgbQk695blyJBPI4OU2Fwrw0+FwVwoM6F3L/FuXmFVSQY+wHFhXUv80VyZ1LAcGKRWerfKaiAUmeEqE14cOrACzeWoocPf8S+DH450VCpDSRza2KaVL7xjZoXBATzYq9lbJYqFEj4zbCrLbN+wGRh+MZX8Ql2TInzoLB/kljwaTl/CMCjWKbJRQhDWfWE2EOZDpXrNUeWeVMLgi0CHv+Nfzv50qHtF4KAfqQ6VMocnyVGUFjLh/jhyWEaKFVyvDEsMdWYJFvaqyK8saoYCj/uWT4YOWyvTW2VYw2Uu3FtGbBKWPZiPBPKAnnjmAw9GOPtJTYe/419O/izXvbqmN1bsXmLuLbNoKQpDjcUFZVol+rVymRsqn1AsKhAS5KpkSSisYAKczGsmCeZ9w7NcOCoUH5RNz7DpA1kkWkM58qTMcO9xSYe/41/e+ZO+ZpKY7yfCEaysY1Ma6lKISZAoHBSR8SZxMzDQU/qSWBuorMUYpU6W0Hxurbw9rznrReqR4V9zjxbQ2yjSBHCgLAa0aa+5Hc0NfOezig5/x7989/e9qlE+PREu7jmSs2hSYhRSU78qjBeJk2tlnQt2mBg4ZZVBvR/IvLCuDLNbh98I7y1rvpWn9rP/5jIWSdifJ15ZBa5OhfPcEpp0uC3d+O5HBR3+jn/5/u+IFlH4jweeT17xkNGe+oavUBpQpVcqZ02/YAU7UewQln3FHgZspUQDS+8oa8/gZeTnnFIb+B+aPkQYLyIPbwMfHzuuvaPNd7qt5r7/kyUd/o5/+aPfFX3iHI/vOV5Mmge2YLxiLGgUNIHfKA8/D0yKxLMzx82+IdjEJA+MTcBmymbkqSqL/UrIRckmhkVpKAw4SUyvai694yrz9DeJ6TKSnOG3z9d0+Dv+5dd+4PU8c8yGhtIJlftpU+4gy5VYQ2+pnNwmarvtQYpMSAI+DxwNSmwGm76jKDxcCDYkhvcsYwPrvqXM4Oy/NmgNHww9wwomm0QvwCGBDn/Hv9i/HqpvskeTRZrTXG1L1iKDVUN8gsMQGEVDZbaB6IvirGJeDRgb0DUEa7laZpi5Ya9ITPsJeeBZjQw3s8j7jyuWSfgit9z2DEerROkNL4bQ4e/4F340Vh8T/dic2MT0ttExIHilMMJ4BdYkqlGTfrYP4rFGslEgThVTgK/gJsLTuk9vbZiutp2n9fDlxFIk4dVVhUdYWsOTsf/mGdIchA5/x78MfzjUJsVMN6ntF0yEvUEkNdLGUpBSMJK4OoTCGtbOoBkMhhHvE/dvI4MAV9HwocuwtWG0SRgsywyKvqEXE/kAYs9iqsi8MIjdBqx3m9oU1+Fv+Zdf/UGmT/u2zedGlZd9eMNE+jeNxgRuk7jaEz4/FGrTNIQG8ZDnkVEWefU2MK7hRbB81nOM8sQm9ywqIRSCb7pHFHPkkaSYTNh8lfD7MDpOvPHjQIe/419+7w+sfjT2fDayGJqOO/HzV4F+BKmUq4mwOU4UvaZqEiq1bQXWc8rrWnG6icRKuGjeGwvjseH22DM3lnhZYguoorLfM2RWSLVwUwj1GYyOlF//54oOf8e/fO8PnZ6PLP+574m2KVkjr74MDArlum/hUOlPItErl4XndmMQFY5D4v1N4HRTcxEtT/qGo0zJcrh8kHHbtDC3JWVlWAfPpIBR0laav7CGm7EwnMJv/ktJh7/jX77zx15vvOWTfceqL0wpyUhUCdYhY+qU/b3QNn/XuVB6x/paOLxR3ttUOFGeiWlnKGNtJBLlemiILmKJzKVHpQZTCIMEw5RYGdkOvgS+c76hw9/x32pZ0QgXE8t6rJz0S1ydaGZXL8uMQZ1o5kmGQP2W4bZvqQth9n+GkzqSa6QQQ4VpijOWIq3OtWdqej4RjKVcWEwtOIFeUF4OLZufVmzvXNR0+Dv+5ejPh21Alplixon7riaW4DLFlgmuPI5EyhPmNWE9tcxvHPOnBqeJoxSZRqVCuRw41t4SKnChJkO5f504eqHcDD03Q9Oqx88OoG8NIkJ/3UgvHf7X/At/N9amTD1eKXmvholSNCq5KKd15HbV9BGG1SAh/UTVcyxXjoMbwcUEA+HNKnAWA5f7hv8+daSFcDprbo6wKITJUln1DIU3DNaJxZnheCL4deKD6NoyucPf8i/TvxmoWwrH68hrJlBMEjc9mOTKsFJuCsuL5gQbbfuGZsKbSs/hNVgVVr3Et7XmSBObTPj3h4bRXLg3V7wmPvKeF9GSkrBxQq9KyJnh4YnBzyKPr6HD3/Evr/7DRC9XyhvPat6p6naT5EnfMp5EjvqJ6yg8sTCbW3rSjqZI0eBWDl8bXubKb2wqHsTI2gs/PvUM18K3bmuCURZGeB4cMxzrTBo1n2wfTvcN3CZWB5YOf8e/jP7pUJcR3v3fgrNFoBThceaYSOKVXs3qQHhcOTYLYWICvRTY4Fjh2Kghj8pbdWQ/hXYd6PNeho2JNzcB55WMSG8pXEfH89y2U5BcEnZoWCOUP9ujw9/xL/zjVBtG3jhvTnng6b7j3Dsmi8h0Gbh2hivfEB95UJf0K2U2tCytxdWGnykjRoSZJJ67jHU0JFGObSDra/s9V0BamXaqmG+UUaV8eOy5buTgd/t0+Dv+hb/fU6Liq8RxnrBTy8oJ9VwZP4mtwjvvNbm/5uFNZDxPFBPl2QPL6+vE21Vq5+kfN4HbeAbXzawE1g+U3mFgWIZ2jGtvPBoMzUS+qa4+PbDtsgT9Zh2ow/+a/28W5bIYeWQC40mjyAo3C2H8NG2l9lxZNKsNl01jaOiVkZcnkfeNcj8oa4FPG41qZshmhiiG1ZES9yO5S9ikHJ87no0ci55hlgu1/2YDr1WQO/wt/9uAqHIcAo/qwKDptJ3wNPq2RziNiWMfuTZwsXCsMtMqwqkfOOo330lIbrGZcDhP7bPmPDWqWMBZYTlI1EM4uBTm4vl8z3HbN2iz9dA+4rdj4g5/y78M/nakaU85kxq5FSiFWrc7uDEoxzHxMCWSBr5cZO2KaJ2B8wE/StwrAmaasb+iXReaFoGXwKqGpq+cDyCNIFnDbXI8N47KGqomsBn0bxId/o5/+fZf9vTJI0GbmdFLIa6FemxZ3LP0XkROXtYMm+Vra7mpFFc2AyvFDgIjFzkum+W6DGMMB0XilXVgZWChwrXArCl1J4JpA2KoakOdC2bfEDN4/6OSDn/Hv/zWX2T68alhdQyb62aGYYkPPGFomMwCDy9KvFcuguFp3WyMJJr0P0oV92PktL0JwmfWthLI/QSZ0i5af2mFat8je03fEkgrpVcph81my9SyLOGXzks6/B3/8u5f5dpI52XfEEOz96xw6mFoyGc1D31FZpXL2vLV8+0+VdPeeRLTELlfRxLCE++4NqYtgZ3S7gg3Lx41vyVtE9hYD3xSDlMzUdR2M/71KrbSfYe/5f+bKqvzZ9wNf0znD7lj/pTOH3LH/CmdP+SO+VM6f8gd86d0/pA75k/p/CF3zJ/S+UPumD+l84fcMX9K5w+5Y/6Uzh9yx/wpnT/kjvlTOn/IHfOndP6QO+ZP6fwhd8yf0vlD7pg/pfOH3DF/SucPuWP+lP8Hnue0hNBe1XYAAAAASUVORK5CYII=",
            houseSpec(100, 50),
            100, 50);

        tm.scrollTo(-10, -10);
        tm.render();

        testbed.verify();
    },

    scrollTo_beyondPositive: function () {
        var tm = initTestbed("data:image/png;base64,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",
            houseSpec(100, 50),
            100, 50);

        tm.scrollTo(1000, 1000);
        tm.render();

        testbed.verify();
    },

    scrollBy: function () {
        var tm = initTestbed("data:image/png;base64,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",
            houseSpec(100, 50),
            100, 50);

        tm.scrollTo(176, 176);
        tm.scrollBy(-50, -25);
        tm.render();

        testbed.verify();
    },

    render_clippedViewPort: function () {
        var tm = initTestbed("data:image/png;base64,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",
            houseSpec(100, 50, 10, 10),
            120, 70);

        tm.scrollTo(126, 247);
        tm.render();

        testbed.verify();
    },

    render_nullTile: function () {
        var tm = initTestbed("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAH8ElEQVR4Xu2dXY8UVRCGq3f2C3ZBxcTEaEz0hiAEDPwWfwA3kojECyHxRgleaQjReGGMidH4fzACRqPGWzWioAj7PdPm6dM10zO7M9s7PTtv757uhMzA9Oliquq89XHOOycxs9SaS6aB5PoFS9PU7LcVs9kZs2NzZkdny/1/btw2u3jS7MSC2fJcuTE73RWz/MwAKKWdmj3eNHuyGVQ0N2P21Hx49Yt71ttmm51w75c/mb37mtkfK2ZHZoPxZhKzfzfMlmbN5lv940eZKFb5XQO4cjppUPB/uTG2CgDVSsxWtsyeO2K22DK7ddfs+oUw8q81s9WtniGfXQzPSSzci4HmZ4JRRl2xyU/eOWtpET6AA64EzREg0vAexeDdxQsIcgMMg5aNTjAMr1udYCBmlT+TWROz/OSNU5autYNSQBsU3bGgbDzeL97jxUBUdk8aIGiUAXYySrsTjIGdkfdwwyxm+d0gDFygeBQ9mwT4QMnZLLCgtI12UNbCjNnyvNnNO2bvnw9xgX9n/FIrBHPG4OUo2WfTMOhhlsUqf1sMGI3Q2yHordN5YG6brXcCxmMAJk9mhDygH2mZLeVBei8yRt0LBB50+cnbZyzFQ8FnFOaYT+AkHR3E/WExAJxn/EKrH7p4Lp893goBnGcygwjuyOL+mOUnF09aSsoI9KBs/hAowfosi0nMnp43Oz7f74vAzoff7S0GAGmkrzyXmcLseLAeUtZY5Sfvnbe06OXgvCsD5fP3P9f6sRwDocyvCkHYsyfMxGdZkM0NulvaGbP8bTHg/qrZajvk7Hjqi0tBmbzPlJxnRwTqD741u3QqqNchLEthC4EX76ag2y0Qu5Fik5+8+aqlwAleeGIxFE1cjzZCMCV4ojyUTyZEtsN77v/4XqiEgRWwnTTVawdmATPl/lrIqijMeB5pKPBG+sk91AAxy09ef8VSagDv/2AAiqNixUrw/Gc9GMCLJozw2Q+9GABUPdkKhmO2tGZC7MD7/17r5f6e1xKEmSmMiVl+HwR5jweleP6OF/OeFPL4XD+UeCWMgR6u91oOGBHvpj0Baj1/NIevHGeGwVGM8ofWAcACSgQ2gJCdlOYGQNHMgMXZ4NVZ8M29GwO+sLT3zD8W+ZULMVoRnuujbDzeWxXAGJBVbGns3RTDR7gDHGT5XrBOUi/Ns/aggUozYA9ydrx1t25q1efvNr4O8pNr5yz1plsxhwfDvZACQsrm8aO+NEHW6wVSUbKoa+d6Tb8Y5SeXT/cbwKtY0kzHc14JxFnLOm9RF6tXPiNYO9bzmceBrK2R94FISwmuRGoKvU+/N7t8ut8AsckvBUEokSwHD+a9txvc2/Fq8vriZ54J8Up2RAqLkYpXWQg4zPKzGZAtstDJzLuULy3vhp7lPue5LG2iwEz5+WrYMwsB0jAAMyBm+cmVM5Yu521nekBHaScPeGo5dfffBYT9+igUcFzMBNCLtsXLx3oGuHLGLGb52yAIqEFJLK44HntwdFjJVrryYotX8v3BdQDG8Cx/ji+2E0c6ndA3ullY1HfzxSa/ty2lE3rzBEm8lt4QsOGTARjxNrQHWGDL13iJAQRhFOzBGo/3ppy3qzEIfSVkFNvZPCdG+ZkB6OPw5cFmMpVRq2DD4KjYLSUoe2rLbMnS2Hwgs4VeETI8CMcsPzPAg7XQtRyF/YPbVcaJC4Nj3AAxy+9CkHswLefNPOXcBHZybwZu/PIVM09H8WaHnmItUFxmBMpIYwn0rBGzxPnJvV47O1b5ydWzloLtv68EaPDthK5Qiixmhiu2i/95PeBryMDOYJ3ge4xQbrbXyELwJb5QiLGidvVsiC2xyk8unbLUN+WSyUzzAoJY0oxZfqlKeL+MUrYSPszy69COHthxul/qHvpcKT9Czg+4cbuboU5d8whU8yPk/IA6GABDqPgJcn5AXQzg02/a/AQ5P+CLH7UQpOZHyPkBH93RGkDNj5DzA+oAQUp+QqU6YBL78+tggHHTr0l8fzk/4HNxDFDzI+T8gFt3tTFAzY+Q8wPUEKTmR8j5AWoDOFHd48C0+QlyfsA3v2ghSM2PkPMDvv5ZawA1P0LOD6gTBCn4CXJ+QJ0MUKwHpsVPqFyIVeUH1NUAZYqzSfATmgUZ8Q9WVZoBZbxk1D14UM5qrfqosccPpqFjP2iMgXx/OT9AbQA1P0LOD1AbQM2PKAVB+7k/X22AMhC0n99fzg9QG0DNj5DzA9QGUPMj5PwAtQEGIWja/AQ5P6AuBlDxE+T8gDoYQMlPkPMD6mAAJT9Bzg+ogwEoYlX8BDk/QG0ANT9Czg9QG0DNjyhVCY/RZyo1pGnG9X5ftZTCmpsmrwE5P8ADYKznF8j5Ae5Tqv35avlyfsDgpJ72/ny1fDk/oDk/oDk/QHp+gZwf4EG4OT9gjAxrEvvjxxDbHXIY5Mv5Ac35Ac35AdLzC+T8gMHTmWI7v0DODxiMAdPen6+WL+cHNOcHNOcHSM8vkPMDihCg2J+vli/nBwyrA6a1P18tv9KCzCT2x1ctxKryE9Ty68APqKKDAz+20gyo+u2bnyyrAT+gOT+gOT+g+yu/zOhpn19QCoL2c398mfOID7N8OT+gOT+gOT9Aen6BnB8wCEHT3p+vli/nB7gCVPvz1fLl/AAUoNyfr5Yv5wegAOX+fLV8OT/AIUC1P18tX84PaM4PaM4PkJ5fUKoSrtp0Gza+acaZ/Q9pQSgsBbbzlwAAAABJRU5ErkJggg==",
            {
                mapWidth: 3,
                mapHeight: 3,
                viewWidth: 96,
                viewHeight: 96,
                tileWidth: 32,
                tileHeight: 32,
                mapArray: [ 2, 2, 2, 2, null, 2, 2, 2, 2]
            },
            96, 96);

        tm.render();

        testbed.verify();
    },
};

})();
