/**
*	@filename	Summoner.js
*	@author		kolton
*	@desc		kill the Summoner
*/

function Summoner(Config) {
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


// If we dont have the ancient quest, but can do it
if (!me.getQuest(39, 0) && me.charlvl >= 60) {

	// Create a promise
	new Promise(function (resolve) {

		// If we get the quest now,
		if (me.getQuest(39, 0)) {
			resolve('Baal');
		}

		if (me.area === 118 /*AncientWay*/) {
			// Let's see if we can find Korlic, is flagged dead, but cant find the the altar
			let unit = getUnit(1, 474/*Korlic*/);
			if (unit && unit.mode === 12 && !getUnit(1, 546/*altar*/)) {
				resolve('Baal');
			}
		}
	}).then(function (script) {
		// We come here once we resolved it.
		// This means we either got the quest(can be delayed),
		// or found a dead Korlic and no altar

		// We cant add anything to the script list, as its already running (it loops trough it once)
		// So we simply just start it. (stole here some my improved loader.js)
		!include("bots/" + script + ".js") && Misc.errorReport("Failed to include script: " + script);

		if (isIncluded("bots/" + script + ".js")) {
			try {
				print("ÿc2Starting script: ÿc9Baal");
				Messaging.sendToScript("tools/toolsthread.js", JSON.stringify({currScript: script}));
				global[script](Object.assign(typeof Scripts[script] === 'object' && Scripts[script] || {}, Config))
			} catch (error) {
				Misc.errorReport(error, script);
			}
		}
	})
}