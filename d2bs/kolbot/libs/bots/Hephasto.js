/**
*	@filename	Hephasto.js
*	@author		kolton
*	@desc		kill Hephasto the Armorer
*/

function Hephasto() {
	Town.doChores();
	Pather.useWaypoint(107);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 2, 376, 0, 0, Config.ClearPath)) {
		throw new Error("Failed to move to Hephasto");
	}

	Attack.kill(getLocaleString(1067)); // Hephasto The Armorer
	Pickit.pickItems();

	return true;
}