/**
*	@filename	Summoner.js
*	@author		kolton
*	@desc		kill the Summoner
*/

function Summoner () {
	Town.doChores();
	Pather.useWaypoint(74);
	Precast.doPrecast(true);

	if (Config.Summoner.FireEye) {
		if (!Pather.usePortal(null)) {
			throw new Error("Failed to move to Fire Eye");
		}

		Attack.clear(15, 0, getLocaleString(2885)); // Fire Eye

		if (!Pather.usePortal(null)) {
			throw new Error("Failed to move to Summoner");
		}
	}

	if (!Pather.moveToPreset(me.area, 2, 357, -3, -3)) {
		throw new Error("Failed to move to Summoner");
	}

	Attack.clear(15, 0, 250); // The Summoner

	if (Loader.scriptName(1) === "Duriel") {
		let journal = getUnit(2, 357);

		if (!journal) {
			return true;
		}

		Pather.moveToUnit(journal);
		journal.interact();
		delay(500);
		me.cancel();

		if (!Pather.usePortal(46)) {
			return true;
		}

		Loader.skipTown.push("Duriel");
	}

	return true;
}
