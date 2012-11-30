/**
*	@filename	ChestHunterAct2.js
*	@author		Talltree
*	@desc		opens good chests in Act2
*/

function ChestHunterAct2() {
	Town.doChores();
		
	if (Config.ChestHunterAct2.StonyTomb) {	
		Pather.useWaypoint(42);
		Precast.doPrecast(true);
		if (!Pather.moveToExit([42, 41], true)) {
			throw new Error("Failed to move to the Rocky Waste.");
		}
		if (!Pather.moveToExit([55, 55], true)) {
			throw new Error("Failed to move to the Stony Tomb Level 1.");
		}
		Misc.openChestsInArea(55);//stony Tomb
		if (!Pather.moveToExit([55, 59], true)) {
			throw new Error("Failed to move to the Stony Tomb Level 2.");
		}
		Misc.openChestsInArea(59);
		Town.goToTown(2);
	}
	
	if (Config.ChestHunterAct2.AncientTunnels) {	
		Pather.useWaypoint(44);
		Precast.doPrecast();
		if (!Pather.moveToExit([44, 65], true)) {
			throw new Error("Failed to move to the Ancient Tunnels.");
		}
		Misc.openChestsInArea(65);
		Town.goToTown(2);
	}
	
	if (Config.ChestHunterAct2.ArcaneSanctuary) {
		Precast.doPrecast();
		Pather.useWaypoint(74);
		Misc.openChestsInArea(74);//Arcane Sactuary
		Town.goToTown(2);
	}
	
	if (Config.ChestHunterAct2.TalTombs) {
		Pather.useWaypoint(46);
		if (!Pather.moveToExit([46, 66], true)) {
			throw new Error("Failed to move to the TalTomb1.");
		}
		Misc.openChestsInArea(66);
		Pather.moveToExit(46);

		if (!Pather.moveToExit([46, 67], true)) {
			throw new Error("Failed to move to the TalTomb2.");
		}
		Misc.openChestsInArea(67);
		Pather.moveToExit(46);
	
		if (!Pather.moveToExit([46, 68], true)) {
			throw new Error("Failed to move to the TalTomb3.");
		}
		Misc.openChestsInArea(68);
		Pather.moveToExit(46);
	
		if (!Pather.moveToExit([46, 69], true)) {
			throw new Error("Failed to move to the TalTomb4.");
		}
		Misc.openChestsInArea(69);
		Pather.moveToExit(46);
	
		if (!Pather.moveToExit([46, 70], true)) {
			throw new Error("Failed to move to the TalTomb5.");
		}
		Misc.openChestsInArea(70);
		Pather.moveToExit(46);
	
		if (!Pather.moveToExit([46, 71], true)) {
			throw new Error("Failed to move to the TalTomb6.");
		}
		Misc.openChestsInArea(71);
		Pather.moveToExit(46);
	
		if (!Pather.moveToExit([46, 72], true)) {
			throw new Error("Failed to move to the TalTomb7.");
		}
		Misc.openChestsInArea(72);
		Town.goToTown(2);
		
	}
	return true;
}