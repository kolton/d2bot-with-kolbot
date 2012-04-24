/**
*	@filename	Summoner.js
*	@author		kolton
*	@desc		kill the Summoner
*/

function Summoner() {
	Town.doChores();
	Pather.useWaypoint(74);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 2, 357)) {
		throw new Error("Failed to move to Summoner");
	}

	Attack.kill(250); // The Summoner
	Pickit.pickItems();

	return true;
}