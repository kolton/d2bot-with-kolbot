/**
*	@filename	Pindleskin.js
*	@author		kolton
*	@desc		kill Pindleskin and optionally Nihlathak
*/

function Pindleskin() {
	Town.goToTown(5);
	Town.doChores();
	Town.move("anya");

	if (!Pather.usePortal(121)) {
		throw new Error("Failed to use portal.");
	}

	Precast.doPrecast(true);
	Pather.moveTo(10058, 13234);
	try {
		Attack.clear(15, 0, getLocaleString(22497)); // Pindleskin
	} catch (e) {
		print(e);
	}

	if (Config.Pindleskin.KillNihlathak) {
		if (!Pather.moveToExit([122, 123, 124], true)) {
			throw new Error("Failed to move to Halls of Vaught");
		}

		Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);

		if (Config.Pindleskin.ViperQuit && getUnit(1, 597)) {
			print("Tomb Vipers found.");

			return true;
		}

		Attack.kill(526); // Nihlathak
		//Attack.clear(20);
		Pickit.pickItems();
	}

	return true;
}
