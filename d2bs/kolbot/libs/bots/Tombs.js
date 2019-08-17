/**
*	@filename	Tombs.js
*	@author		kolton
*	@desc		clear Tal Rasha's Tombs
*/

function Tombs(Config, Attack, Pickit) {
	var i;

	Town.doChores();
	Pather.journeyTo(46);

	for (i = 66; i <= 72; i += 1) {
		if (!Pather.moveToExit(i, true)) {
			throw new Error("Failed to move to tomb");
		}

		Attack.clearLevel(Config.ClearType);

		if (i === 69) {
			Precast.doPrecast(true);
		}

		if (!Pather.moveToExit(46, true)) {
			throw new Error("Failed to move to Canyon");
		}
	}

	return true;
}