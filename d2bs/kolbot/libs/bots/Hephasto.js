/**
*	@filename	Hephasto.js
*	@author		kolton
*	@desc		kill Hephasto the Armorer
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Hephasto() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act4.River_Of_Flame);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Forge_Hell)) {
		throw new Error("Failed to move to Hephasto");
	}

	Attack.kill(getLocaleString(1067)); // Hephasto The Armorer
	Pickit.pickItems();

	return true;
}