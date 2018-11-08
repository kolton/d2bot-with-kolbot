/**
*	@filename	Coldworm.js
*	@author		kolton, edited by 13ack.Stab
*	@desc		kill Coldworm; optionally kill Beetleburst and clear Maggot Lair
*/

function Coldworm() {
	var i;

	Town.doChores();
	Pather.useWaypoint(43);
	Precast.doPrecast(true);

	// Beetleburst, added by 13ack.Stab
	if (Config.Coldworm.KillBeetleburst) {
		if (!Pather.moveToPreset(me.area, 1, 747)) {
			throw new Error("Failed to move to Beetleburst");
		}

		Attack.clear(15, 0, getLocaleString(2882));
	}

	for (i = 62; i <= 64; i += 1) {
		if (!Pather.moveToExit(i, true)) {
			throw new Error("Failed to move to Coldworm");
		}

		if (Config.Coldworm.ClearMaggotLair) {
			Attack.clearLevel(Config.ClearType);
		}
	}

	if (!Config.Coldworm.ClearMaggotLair) {
		if (!Pather.moveToPreset(me.area, 2, 356)) {
			throw new Error("Failed to move to Coldworm");
		}

		Attack.clear(15, 0, 284);
	}

	return true;
}
