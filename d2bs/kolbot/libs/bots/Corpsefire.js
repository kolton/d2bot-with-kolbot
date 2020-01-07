/**
*	@filename	Corpsefire.js
*	@author		kolton
*	@desc		kill Corpsefire and optionally clear Den of Evil
*/

function Corpsefire() {
	Town.doChores();
	Pather.useWaypoint(3);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([2, 8], true, Config.ClearPath) || !Pather.moveToPreset(me.area, 1, 774, 0, 0, Config.ClearPath, true)) {
		throw new Error("Failed to move to Corpsefire");
	}

	Attack.clear(15, 0, getLocaleString(3319)); // Corpsefire

	if (Config.Corpsefire.ClearDen) {
		Attack.clearLevel();
	}

	return true;
}