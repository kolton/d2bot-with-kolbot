/**
*	@filename	Summoner.js
*	@author		kolton
*	@desc		kill the Summoner
*/

function Summoner () {
	// return the script position in the list of scripts to be ran
	this.scriptIndex = function (script) {
		let s, charScripts = [];

		for (s in Scripts) {
			if (Scripts[s]) {
				charScripts.push(s);
			}
		}

		return charScripts.indexOf(script);
	};

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

	if (Scripts.Duriel && this.scriptIndex("Duriel") === this.scriptIndex("Summoner") + 1) {
		let journal = getUnit(2, 357);

		if (!journal) {
			throw new Error("Journal not found");
		}

		Pather.moveTo(journal.x, journal.y);
		journal.interact();
		delay(500);
		me.cancel();

		if (!Pather.usePortal(46)) {
			throw new Error("Failed to take arcane portal");
		}
	}

	return true;
}
