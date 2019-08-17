/**
*	@filename	UndergroundPassage.js
*	@author		loshmi
*	@desc		Move and clear Underground passage level 2
*/

function UndergroundPassage(Config) {
	Town.doChores();

	if (!Pather.journeyTo(14)) {
		throw new Error("Failed to move to Underground passage level 2");
	}

	Attack.clearLevel();
}