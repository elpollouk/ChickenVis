Chicken.register("ChickenVis.Loader.textLoader",
["ChickenVis.Loader", "XMLHttpRequest"],
function (Loader, XMLHttpRequest) {
    "use strict";

    function textLoader(asset) {
        var request = new XMLHttpRequest();

        request.onload = function () {
            asset.data = request.responseText;
            asset.state = Loader.STATE_READY;
            asset.onStateChange(asset);
        }

        request.onerror = function () {
            asset.state = Loader.STATE_ERROR;
            asset.onStateChange(asset);
        }

        request.open("GET", asset.source, true);
        request.send();
   }

   Loader.registerLoader(Loader.TYPE_TEXT, textLoader);

   return textLoader;
});
