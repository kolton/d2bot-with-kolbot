/**
*	@filename	Izual.js
*	@author		kolton
*	@desc		kill Izual
*/

function Izual(Config) {
	Town.doChores();

	if (!me.journeyToPreset(105, 1, 256)) {
		throw new Error("Failed to move to Izual.");
	}

	Attack.kill(256); // Izual
	Pickit.pickItems();

	return true;
}