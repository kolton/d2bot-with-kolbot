/**
*	@filename	Eyeback.js
*	@author		kolton
*	@desc		kill Eyeback the Unleashed
*/

function Eyeback() {
	Town.doChores();
	Pather.useWaypoint(112);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(111, true)) {
		throw new Error("Failed to move to Eyeback the Unleashed");
	}

	Attack.clear(15, 0, getLocaleString(22499)); // Eyeback the Unleashed

	return true;
}