/**
*	@filename	Countess.js
*	@author		kolton
*	@desc		kill The Countess and optionally kill Ghosts along the way
*/

function Countess() {
	var i, poi;

	Town.doChores();
	Pather.useWaypoint(6);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([20, 21, 22, 23, 24, 25], true)) {
		throw new Error("Failed to move to Countess");
	}

	poi = getPresetUnit(me.area, 2, 580);

	if (!poi) {
		throw new Error("Failed to move to Countess (preset not found)");
	}

	switch (poi.roomx * 5 + poi.x) {
	case 12565:
		Pather.moveTo(12578, 11043);
		break;
	case 12526:
		Pather.moveTo(12548, 11083);
		break;
	}

	Attack.clear(20, 0, getLocaleString(2875)); // The Countess

	if (Config.OpenChests) {
		Misc.openChestsInArea();
	}

	return true;
}