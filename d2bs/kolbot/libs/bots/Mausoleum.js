/**
*	@filename	Mausoleum.js
*	@author		kolton
*	@desc		clear Mausoleum
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Mausoleum() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Cold_Plains);
	Precast.doPrecast(true);

    if (!Pather.moveToExit(Areas.Act1.Burial_Grounds, true)) {
		throw new Error("Failed to move to Burial Grounds");
	}

	if (Config.Mausoleum.KillBloodRaven) {
        Pather.moveToPreset(Areas.Act1.Burial_Grounds, UnitType.NPC, 805);
		Attack.kill(getLocaleString(3111)); // Blood Raven
		Pickit.pickItems();
	}

    if (!Pather.moveToExit(Areas.Act1.Mausoleum, true)) {
		throw new Error("Failed to move to Mausoleum");
	}

	Attack.clearLevel(Config.ClearType);

	if (Config.Mausoleum.ClearCrypt) {
		// Crypt exit is... awkward
        if (!(Pather.moveToExit(Areas.Act1.Burial_Grounds, true) && Pather.moveToPreset(Areas.Act1.Burial_Grounds, UnitType.Warp, 6, 5, 0) && Pather.moveToExit(Areas.Act1.Crypt, true))) {
			throw new Error("Failed to move to Crypt");
		}

		Attack.clearLevel(Config.ClearType);
	}

	return true;
}