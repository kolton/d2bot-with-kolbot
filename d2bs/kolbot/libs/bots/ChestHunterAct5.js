/**
*	@filename	ChestHunterAct5.js
*	@author		Talltree
*	@desc		opens good chests in Act3
*/

function ChestHunterAct5() {
	Town.doChores();
	
	if (Config.ChestHunterAct5.GlacialDrifter) {
		Pather.useWaypoint(115);
		Precast.doPrecast(true);
		Misc.openChestsInArea(115); //Glacial Trail)
		if (!Pather.moveToExit([115, 116], true)) {
			throw new Error("Failed to move to the Glacial Trail.");
		}
		Misc.openChestsInArea(116); //DrifterChest
		Town.goToTown(5);
	}
	
	if (Config.ChestHunterAct5.FrozenCellar) {
		Pather.useWaypoint(118);	
		Precast.doPrecast();
		if (!Pather.moveToExit([118, 119], true)) {
			throw new Error("Failed to move to the Frozen Cellar.");
		}
		Misc.openChestsInArea(119); //CellarChest
		Town.goToTown(5);
	}
	
	if (Config.ChestHunterAct5.HellChests) {
		Pather.useWaypoint(117);
		Precast.doPrecast();
		if (!Pather.moveToPreset(117, 2, 60) || !Pather.usePortal(127)) {
			throw new Error("Failed to move to Hell3");
		}
		Misc.openChestsInArea(127); //InfernalChest
		Town.goToTown(5);
	
		Pather.useWaypoint(112);
		Precast.doPrecast();
		if (!Pather.moveToPreset(112, 2, 60) || !Pather.usePortal(126)) {
			throw new Error("Failed to move to Hell2");
		}
		Misc.openChestsInArea(126); //ArcheonChest
		Town.goToTown(5);
	
		Pather.useWaypoint(111);
		Precast.doPrecast();
		if (!Pather.moveToPreset(111, 2, 60) || !Pather.usePortal(125)) {
			throw new Error("Failed to move to Hell2");
		}
		Misc.openChestsInArea(125); //AbbadonChest
	}
	
	return true;
}