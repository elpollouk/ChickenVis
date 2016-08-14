(function () {
	"use strict";

	// External libs
	Test.addScripts(
		"http://elpollouk.github.io/libs/ChickenFW.js"
	);

	//              System under test                   Test script
	Test.addScripts("../js/loader.js",					"loader.tests.js");

})();
