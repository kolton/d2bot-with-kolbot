/**
*	@filename	Radament.js
*	@author		kolton
*	@desc		kill Radament
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Radament() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act2.A2_Sewers_Level_2);
	Precast.doPrecast(true);

    if (!Pather.moveToExit(Areas.Act2.A2_Sewers_Level_3, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horadric_Scroll_Chest)) {
		throw new Error("Failed to move to Radament");
	}

    Attack.kill(UnitClassID.radament); // Radament
	Pickit.pickItems();
	Attack.openChests(20);

	return true;
}