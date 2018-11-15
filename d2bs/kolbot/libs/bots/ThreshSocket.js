/**
*	@filename	ThreshSocket.js
*	@author		kolton
*	@desc		kill Thresh Socket
*/

function ThreshSocket() {
	Town.doChores();
	Pather.useWaypoint(112);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(113, false)) {
		throw new Error("Failed to move to Thresh Socket");
	}

	Attack.kill(getLocaleString(22498)); // Thresh Socket
	Pickit.pickItems();

	return true;
}