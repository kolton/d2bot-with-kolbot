/**
*	@filename	Endugu.js
*	@author		kolton
*	@desc		kill Witch Doctor Endugu
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Endugu() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act3.Flayer_Jungle);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act3.Flayer_Dungeon_Level_1, Areas.Act3.Flayer_Dungeon_Level_2, Areas.Act3.Flayer_Dungeon_Level_3], true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Khalim_Chest2)) {
		throw new Error("Failed to move to Endugu");
	}

	Attack.clear(15, 0, getLocaleString(2867)); // Witch Doctor Endugu

	return true;
}