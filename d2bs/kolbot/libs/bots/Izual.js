/**
*	@filename	Izual.js
*	@author		kolton
*	@desc		kill Izual
*/

function Izual() {
	Town.doChores();
	Pather.useWaypoint(106);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(105, 1, 256, 0, 0, Config.ClearPath)) {
		throw new Error("Failed to move to Izual.");
	}

	Attack.kill(256); // Izual
	Pickit.pickItems();

	return true;
}