/**
*	@filename	ChestHunterAct3.js
*	@author		Talltree
*	@desc		Open All good Chests
*/

function ChestHunterAct3() {
	
	Pather.useWaypoint(76);
	Precast.doPrecast(true);
	if (!Pather.moveToExit([76,84], true)) {
		throw new Error("Failed to move to the Spider Cave.");
	}
	Misc.openChestsInArea(84);
	Pather.moveToExit(76);
		if (!Pather.moveToExit([76,85], true)) {
		throw new Error("Failed to move to the Spider Cavern.");
	}
	Misc.openChestsInArea(85);
	Town.goToTown(3)
	return true;
}