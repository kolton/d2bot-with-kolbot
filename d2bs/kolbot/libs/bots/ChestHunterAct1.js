/**
*	@filename	ChestBot.js
*	@author		Talltree
*	@desc		opens good chests in Act1
*/

function ChestHunterAct1() {
	Town.doChores();
	
	if (Config.ChestHunterAct1.Hole) {
		Pather.useWaypoint(6);
		Precast.doPrecast(true);
		if (!Pather.moveToExit([6, 11], true)) {
			throw new Error("Failed to move to Hole Level 1.");
		}
		if (!Pather.moveToExit([11, 15], true)) {
			throw new Error("Failed to move to Hole Level 1.");
		}
		Misc.openChestsInArea(15);//Hole Level 2
		Town.goToTown(1);
	}
	
	if (Config.ChestHunterAct1.Cave) {
		Pather.useWaypoint(3);
		Precast.doPrecast();
		if (!Pather.moveToExit([3, 9], true)) {
			throw new Error("Failed to move to Cave Level 1.");
		}
		if (!Pather.moveToExit([9, 13], true)) {
			throw new Error("Failed to move to Cave Level 2.");
		}
		Misc.openChestsInArea(13);//Cave Level 2
		Town.goToTown(1);
	}
	
	if (Config.ChestHunterAct1.Pit) {
		Pather.useWaypoint(6);
		Precast.doPrecast();
		if (!Pather.moveToExit([6, 7], true)) {
			throw new Error("Failed to move to Tamoe Highland.");
		}
		if (!Pather.moveToExit([7, 12], true)) {
			throw new Error("Failed to move to Pit Level 1.");
		}
		if (!Pather.moveToExit([12, 16], true)) {
			throw new Error("Failed to move to Pit Level 2.");
		}
		Misc.openChestsInArea(16);//Pit Level 2
		Town.goToTown(1);
	}
	
	if (Config.ChestHunterAct1.MausoCrypt) {
		Pather.useWaypoint(3);
		Precast.doPrecast();
		if (!Pather.moveToExit([17, 18], true)) {
			throw new Error("Failed to move to the Crypt.");
		}
		Misc.openChestsInArea(18);//Crypta
		Pather.moveToExit(17);
		if (!Pather.moveToExit([17, 19], true)) {
			throw new Error("Failed to move to Mausoleum.");
		}
		Misc.openChestsInArea(19);//Mausoleum
		Town.goToTown(1);
	}
	return true;
}