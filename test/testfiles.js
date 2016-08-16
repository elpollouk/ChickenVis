(function () {
	"use strict";

	// External libs
	Test.addScripts(
		"http://elpollouk.github.io/libs/ChickenFW.js"
	);

	//              System under test                   Test script
	Test.addScripts("../js/utils.js");
	Test.addScripts("../js/loader.js",					"loader.tests.js");
	Test.addScripts("../js/updateloop.js",				"updateloop.tests.js");

})();
