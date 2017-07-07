/**
*	@filename	Pindleskin.js
*	@author		kolton
*	@desc		kill Pindleskin and optionally Nihlathak
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Pindleskin() {
	var anya;

	Town.goToTown(Config.Pindleskin.UseWaypoint ? undefined : 5);
	Town.doChores();

	if (Config.Pindleskin.UseWaypoint) {
		Pather.useWaypoint(Areas.Act5.Halls_Of_Pain);
		Precast.doPrecast(true);

        if (!Pather.moveToExit([Areas.Act5.Halls_Of_Anguish, Areas.Act5.Nihlathaks_Temple], true)) {
			throw new Error("Failed to move to Nihlahak's Temple");
		}
	} else {
		Town.move("anya");

        if (!Pather.getPortal(Areas.Act5.Nihlathaks_Temple) && me.getQuest(Quests.Act5.Prison_of_Ice, 1)) {
            anya = getUnit(UnitType.NPC, NPC.Anya);

			if (anya) {
				anya.openMenu();
				me.cancel();
			}
		}

        if (!Pather.usePortal(Areas.Act5.Nihlathaks_Temple)) {
			throw new Error("Failed to use portal.");
		}

		Precast.doPrecast(true);
	}

	Pather.moveTo(10058, 13234);

	try {
		Attack.clear(15, 0, getLocaleString(22497)); // Pindleskin
	} catch (e) {
		print(e);
	}

	if (Config.Pindleskin.KillNihlathak) {
        if (!Pather.moveToExit([Areas.Act5.Halls_Of_Anguish, Areas.Act5.Halls_Of_Pain, Areas.Act5.Halls_Of_Vaught], true)) {
			throw new Error("Failed to move to Halls of Vaught");
		}

        Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Nihlathak_Outside_Town, 10, 10);

        if (Config.Pindleskin.ViperQuit && getUnit(UnitType.NPC, UnitClassID.clawviper9)) {
			print("Tomb Vipers found.");

			return true;
		}
		
		if (Config.Pindleskin.ClearVipers) {
            Attack.clearList(Attack.getMob(UnitClassID.clawviper9, 0, 20));
		}

        Attack.kill(UnitClassID.nihlathakboss); // Nihlathak
		//Attack.clear(15, 0, 526);
		Pickit.pickItems();
	}

	return true;
}
