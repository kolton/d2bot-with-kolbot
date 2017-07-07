/**
*	@filename	Corpsefire.js
*	@author		kolton
*	@desc		kill Corpsefire and optionally clear Den of Evil
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Corpsefire() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Cold_Plains);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act1.Blood_Moor, Areas.Act1.Den_Of_Evil], true) || !Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Corpsefire, 0, 0, false, true)) {
		throw new Error("Failed to move to Corpsefire");
	}

	Attack.clear(15, 0, getLocaleString(3319)); // Corpsefire

	if (Config.Corpsefire.ClearDen) {
		Attack.clearLevel();
	}

	return true;
}