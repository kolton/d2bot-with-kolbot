/**
*	@filename	Bonesaw.js
*	@author		kolton
*	@desc		kill Bonesaw Breaker
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Bonesaw() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Glacial_Trail);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(Areas.Act5.Glacial_Trail, UnitType.Object, UniqueObjectIds.Special_Chest, 15, 15)) {
		throw new Error("Failed to move to Bonesaw");
	}

	Attack.clear(15, 0, getLocaleString(22502)); // Bonesaw Breaker

    if (Config.Bonesaw.ClearDrifterCavern && Pather.moveToExit(Areas.Act5.Drifter_Cavern, true)) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}