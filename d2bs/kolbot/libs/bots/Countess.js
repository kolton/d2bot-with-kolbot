/**
*	@filename	Countess.js
*	@author		kolton
*	@desc		kill The Countess and optionally kill Ghosts along the way
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Countess() {
	var i, poi;

	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Black_Marsh);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act1.Forgotten_Tower, Areas.Act1.Tower_Cellar_Level_1, Areas.Act1.Tower_Cellar_Level_2, Areas.Act1.Tower_Cellar_Level_3, Areas.Act1.Tower_Cellar_Level_4, Areas.Act1.Tower_Cellar_Level_5], true)) {
		throw new Error("Failed to move to Countess");
	}

    poi = getPresetUnit(me.area, UnitType.Object, 580);

	if (!poi) {
		throw new Error("Failed to move to Countess (preset not found)");
	}

	switch (poi.roomx * 5 + poi.x) {
	case 12565:
		Pather.moveTo(12578, 11043);
		break;
	case 12526:
		Pather.moveTo(12548, 11083);
		break;
	}

	Attack.clear(20, 0, getLocaleString(2875)); // The Countess

	if (Config.OpenChests) {
		Misc.openChestsInArea();
	}

	return true;
}