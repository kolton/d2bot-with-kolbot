/**
*	@filename	Pit.js
*	@author		kolton
*	@desc		clear Pit
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Pit() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Black_Marsh);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act1.Tamoe_Highland, Areas.Act1.Pit_Level_1], true)) {
		throw new Error("Failed to move to Pit level 1");
	}

	if (Config.Pit.ClearPit1) {
		Attack.clearLevel(Config.ClearType);
	}

    if (!Pather.moveToExit(Areas.Act1.Pit_Level_2, true, Config.Pit.ClearPath)) {
		throw new Error("Failed to move to Pit level 2");
	}

	Attack.clearLevel();

	return true;
}