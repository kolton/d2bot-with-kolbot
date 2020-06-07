/**
*	@filename	CreepingFeature.js
*	@author		3CoRmEuM
*	@desc		clear Creeping Feature
*/

function CreepingFeature() {
	Town.doChores();
	Pather.useWaypoint(Config.RandomPrecast ? "random" : 42);
	Precast.doPrecast(true);

	if (me.area !== 42) {
		Pather.useWaypoint(42);
	}

	if (!(Pather.moveToExit([41, 55, 59], true) && Pather.moveToPreset(me.area, 1, 748))) {

		throw new Error("Failed to move to Creeping Feature");
	}

	Attack.clear(20, Config.ClearType, getLocaleString(2883)); // Creeping Feature
	Pickit.pickItems();

	return true;
}