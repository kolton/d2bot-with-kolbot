/**
*	@filename	Icehawk.js
*	@author		kolton
*	@desc		kill Icehawk Riftwing
*/

function Icehawk(Config) {
	Town.doChores();

	if (!Pather.journeyTo(93)) {
		throw new Error("Failed to move to Icehawk");
	}

	Attack.clear(15, 0, getLocaleString(2864)); // Icehawk Riftwing

	return true;
}