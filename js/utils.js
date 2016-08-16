Chicken.register("ChickenVis.createElement", function createElement(type) {
    return document.createElement(type);
});

Chicken.register("ChickenVis.requestAnimationFrame", function requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
});
