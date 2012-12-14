/**
*	@filename	Worldstone.js
*	@author		kolton
*	@desc		Clear Worldstone levels
*/

function Worldstone() {
	Town.doChores();
	Pather.useWaypoint(129);
	Precast.doPrecast(true);
	Attack.clearLevel(Config.ClearType);

	if (Pather.moveToExit(128, true)) {
		Attack.clearLevel(Config.ClearType);
	}

	if (Pather.moveToExit([129, 130], true)) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}