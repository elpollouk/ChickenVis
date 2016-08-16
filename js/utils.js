Chicken.register("ChickenVis.createElement", function createElement(type) {
    return document.createElement(type);
});

Chicken.register("ChickenVis.requestAnimationFrame", function requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
});

Chicken.register("ChickenVis.resolveElement", function resolveElement(element) {
    switch (typeof element) {
        case "string":
            return document.getElementById(element);
        case "function":
            return element();
        default:
            return element;
    }
});
