/**
*	@filename	Worldstone.js
*	@author		kolton
*	@desc		Clear Worldstone levels
*/

function Worldstone(Config, Attack, Pickit) {
	Town.doChores();
	Pather.journeyTo(129);
	Attack.clearLevel(Config.ClearType);

	if (Pather.journeyTo(128, true)) {
		Attack.clearLevel(Config.ClearType);
	}

	if (Pather.journeyTo([129, 130], true)) {
		Attack.clearLevel(Config.ClearType);
	}
}