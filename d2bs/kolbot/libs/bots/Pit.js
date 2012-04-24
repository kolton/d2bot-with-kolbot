/**
*	@filename	Pit.js
*	@author		kolton
*	@desc		clear Pit
*/

function Pit() {
	Town.doChores();
	Pather.useWaypoint(6);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([7, 12], true)) {
		throw new Error("Failed to move to Pit level 1");
	}

	if (Config.Pit.ClearPit1) {
		Attack.clearLevel(Config.ClearType);
	}

	if (!Pather.moveToExit(16, true, Config.Pit.ClearPath)) {
		throw new Error("Failed to move to Pit level 2");
	}

	Attack.clearLevel();

	return true;
}