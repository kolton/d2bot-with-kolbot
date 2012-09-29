/**
*	@filename	UndergroundPassage.js
*	@author		loshmi
*	@desc		Move and clear Underground passage level 2
*/

function UndergroundPassage() {
	Town.doChores();
	Pather.useWaypoint(4);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([10, 14], true)) {
		throw new Error("Failed to move to Underground passage level 2");
	}

	Attack.clearLevel();

	return true;
}