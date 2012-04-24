/**
*	@filename	Endugu.js
*	@author		kolton
*	@desc		kill Witch Doctor Endugu
*/

function Endugu() {
	Town.doChores();
	Pather.useWaypoint(78);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([88, 89, 91], true) || !Pather.moveToPreset(me.area, 2, 406)) {
		throw new Error("Failed to move to Endugu");
	}

	Attack.clear(15, 0, getLocaleString(2867)); // Witch Doctor Endugu

	return true;
}