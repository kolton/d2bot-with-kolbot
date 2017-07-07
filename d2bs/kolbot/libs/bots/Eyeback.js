/**
*	@filename	Eyeback.js
*	@author		kolton
*	@desc		kill Eyeback the Unleashed
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Eyeback() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Arreat_Plateau);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(Areas.Act5.Frigid_Highlands, UnitType.NPC, SuperUniques.Eyeback_Unleashed)) {
		throw new Error("Failed to move to Eyeback the Unleashed");
	}

	Attack.clear(15, 0, getLocaleString(22499)); // Eyeback the Unleashed

	return true;
}