/**
*	@filename	Treehead.js
*	@author		kolton
*	@desc		kill Treehead
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Treehead() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Dark_Wood);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Inifuss_Tree, 5, 5)) {
		throw new Error("Failed to move to Treehead");
	}

	Attack.clear(15, 0, getLocaleString(2873)); // Treehead Woodfist

	return true;
}