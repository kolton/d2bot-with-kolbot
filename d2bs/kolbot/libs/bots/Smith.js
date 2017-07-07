/**
*	@filename	Smith.js
*	@author		kolton
*	@desc		kill the Smith
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Smith() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Outer_Cloister);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(Areas.Act1.Barracks, UnitType.Object, UniqueObjectIds.Malus)) {
		throw new Error("Failed to move to the Smith");
	}

	Attack.kill(getLocaleString(2889)); // The Smith
	Pickit.pickItems();

	return true;
}