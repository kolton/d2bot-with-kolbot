/**
*	@filename	Stormtree.js
*	@author		kolton
*	@desc		kill Stormtree
*/

function Stormtree(Config) {
	Town.doChores();

	if (!Pather.journeyTo(78)) {
		throw new Error("Failed to move to Stormtree");
	}

	Attack.clear(15, 0, getLocaleString(2866)); // Stormtree
}