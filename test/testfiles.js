(function () {
	"use strict";

	// External libs
	Test.addScripts(
		"../../elpollouk.github.io/libs/ChickenFW.js",
		"../utils/canvasTestBed.js"
	);

	//              System under test                   Test script
	Test.addScripts("../js/utils.js");
	Test.addScripts("../js/loader.js",					"loader.tests.js");
	Test.addScripts("../js/loaders/textLoader.js",		"loaders/textLoader.tests.js");
	Test.addScripts("../js/updateloop.js",				"updateloop.tests.js");
	Test.addScripts("../js/fixeddeltaupdater.js",		"fixeddeltaupdater.tests.js");
	Test.addScripts("../js/fixeddeltawrapper.js",		"fixeddeltawrapper.tests.js");
	Test.addScripts("../js/math.js",					"math.tests.js");
	Test.addScripts("../js/draw.js",					"draw.tests.js");
	Test.addScripts("../js/spritepallette.js",			"spritepallette.tests.js");
	Test.addScripts("../js/tilemap.js",					"tilemap.tests.js");
	Test.addScripts("../js/animatedSprite.js",			"animatedSprite.tests.js");

})();
