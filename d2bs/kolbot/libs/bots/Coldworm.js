/**
*	@filename	Coldworm.js
*	@author		kolton, edited by 13ack.Stab
*	@desc		kill Coldworm; optionally kill Beetleburst and clear Maggot Lair
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Coldworm() {
	var i;

	Town.doChores();
    Pather.useWaypoint(Areas.Act2.Far_Oasis);
	Precast.doPrecast(true);
	
	// Beetleburst, added by 13ack.Stab
	if (Config.Coldworm.KillBeetleburst) {
        if (!Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Beetleburst)) {
			throw new Error("Failed to move to Beetleburst");
		}
			
		Attack.clear(15, 0, getLocaleString(2882));
	}

	for (i = 62; i <= 64; i += 1) {
		if (!Pather.moveToExit(i, true)) {
			throw new Error("Failed to move to Coldworm");
		}

		if (Config.Coldworm.ClearMaggotLair) {
			Attack.clearLevel(Config.ClearType);
		}
	}

	if (!Config.Coldworm.ClearMaggotLair) {
        if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Staff_Of_Kings_Chest)) {
			throw new Error("Failed to move to Coldworm");
		}

        Attack.clear(15, 0, UnitClassID.maggotqueen1);
	}

	return true;
}
