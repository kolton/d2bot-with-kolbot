/**
*	@filename	Nihlathak.js
*	@author		kolton
*	@desc		kill Nihlathak
*/

function Nihlathak() {
	Town.doChores();
	Pather.useWaypoint(123);
	Precast.doPrecast(false);

	if (!Pather.moveToExit(124, true, Config.ClearPath)) {
		throw new Error("Failed to go to Nihlathak");
	}

	Pather.moveToPreset(me.area, 2, 462, 0, 0, Config.ClearPath, true);

	if (Config.Nihlathak.ViperQuit && getUnit(1, 597)) {
		print("Tomb Vipers found.");

		return true;
	}

	Attack.kill(526); // Nihlathak
	Pickit.pickItems();

	return true;
}