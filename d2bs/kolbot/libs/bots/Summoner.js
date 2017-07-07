/**
*	@filename	Summoner.js
*	@author		kolton
*	@desc		kill the Summoner
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Summoner() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act2.Arcane_Sanctuary);
	Precast.doPrecast(true);

	if (Config.Summoner.FireEye) {
		if (!Pather.usePortal(null)) {
			throw new Error("Failed to move to Fire Eye");
		}

		Attack.clear(15, 0, getLocaleString(2885)); // Fire Eye

		if (!Pather.usePortal(null)) {
			throw new Error("Failed to move to Summoner");
		}
	}

    if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal, -3, -3)) {
		throw new Error("Failed to move to Summoner");
	}

    Attack.clear(15, 0, UnitClassID.summoner); // The Summoner

	return true;
}