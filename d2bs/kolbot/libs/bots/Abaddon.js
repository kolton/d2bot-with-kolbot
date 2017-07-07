/**
*	@filename	Abaddon.js
*	@author		kolton
*	@desc		clear Abaddon
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Abaddon() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Frigid_Highlands);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(Areas.Act5.Frigid_Highlands, UnitType.Object, UniqueObjectIds.Permanent_Town_Portal) || !Pather.usePortal(Areas.Act5.Abaddon)) {
		throw new Error("Failed to move to Abaddon");
	}

	Attack.clearLevel(Config.ClearType);

	return true;
}