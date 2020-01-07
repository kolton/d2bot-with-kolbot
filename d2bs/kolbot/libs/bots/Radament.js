/**
*	@filename	Radament.js
*	@author		kolton
*	@desc		kill Radament
*/

function Radament() {
	Town.doChores();
	Pather.useWaypoint(48);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(49, true, Config.ClearPath) || !Pather.moveToPreset(me.area, 2, 355, 0, 0, Config.ClearPath)) {
		throw new Error("Failed to move to Radament");
	}

	Attack.kill(229); // Radament
	Pickit.pickItems();
	Attack.openChests(20);

	return true;
}