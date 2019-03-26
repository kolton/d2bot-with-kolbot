/**
*	@filename	Radament.js
*	@author		kolton
*	@desc		kill Radament
*/

function Radament() {
	Town.doChores();
	Pather.useWaypoint(48);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(49, true) || !Pather.moveToPreset(me.area, 2, 355)) {
		throw new Error("Failed to move to Radament");
	}

	Attack.kill(229); // Radament
	Pickit.pickItems();
	Chest.scan(20);
	Chest.openChests();

	return true;
}