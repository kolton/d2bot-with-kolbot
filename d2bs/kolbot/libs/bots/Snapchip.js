/**
*	@filename	Snapchip.js
*	@author		kolton
*	@desc		kill Snapchip and optionally clear Icy Cellar
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Snapchip() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Ancients_Way);
	Precast.doPrecast(true);

    if (!Pather.moveToExit(Areas.Act5.Icy_Cellar, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Sparklychest)) {
		throw new Error("Failed to move to Snapchip Shatter");
	}

	Attack.clear(15, 0, getLocaleString(22496)); // Snapchip Shatter

	if (Config.Snapchip.ClearIcyCellar) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}