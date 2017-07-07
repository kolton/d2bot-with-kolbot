/**
*	@filename	Frozenstein.js
*	@author		kolton
*	@desc		kill Frozensteinand optionally clear Frozen River
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Frozenstein() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Crystalized_Passage);
	Precast.doPrecast(true);

    if (!Pather.moveToExit(Areas.Act5.Frozen_River, true) || !Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Drehya_Outside_Town, -5, -5)) {
		throw new Error("Failed to move to Frozenstein");
	}

	Attack.clear(15, 0, getLocaleString(22504)); // Frozenstein

	if (Config.Frozenstein.ClearFrozenRiver) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}