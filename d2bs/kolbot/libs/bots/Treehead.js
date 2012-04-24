/**
*	@filename	Treehead.js
*	@author		kolton
*	@desc		kill Treehead
*/

function Treehead() {
	Town.doChores();
	Pather.useWaypoint(5);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 2, 30, 5, 5)) {
		throw new Error("Failed to move to Treehead");
	}

	Attack.clear(15, 0, getLocaleString(2873)); // Treehead Woodfist

	return true;
}