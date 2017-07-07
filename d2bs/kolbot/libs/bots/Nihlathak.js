/**
*	@filename	Nihlathak.js
*	@author		kolton
*	@desc		kill Nihlathak
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Nihlathak() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Halls_Of_Pain);
	Precast.doPrecast(false);

    if (!Pather.moveToExit(Areas.Act5.Halls_Of_Vaught, true)) {
		throw new Error("Failed to go to Nihlathak");
	}

    Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Nihlathak_Outside_Town, 0, 0, false, true);

    if (Config.Nihlathak.ViperQuit && getUnit(UnitType.NPC, UnitClassID.clawviper9)) {
		print("Tomb Vipers found.");

		return true;
	}

    Attack.kill(UnitClassID.nihlathakboss); // Nihlathak
	Pickit.pickItems();

	return true;
}