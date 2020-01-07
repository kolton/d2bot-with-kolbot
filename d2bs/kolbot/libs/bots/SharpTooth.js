/**
*	@filename	Sharptooth.js
*	@author		loshmi
*	@desc		kill Thresh Socket
*/

function SharpTooth() {
	Town.doChores();
	Pather.useWaypoint(111);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 1, 790, 0, 0, Config.ClearPath)) {
		throw new Error("Failed to move to Sharptooth Slayer");
	}

	Attack.kill(getLocaleString(22493)); // Sharptooth Slayer
	Pickit.pickItems();

	return true;
}