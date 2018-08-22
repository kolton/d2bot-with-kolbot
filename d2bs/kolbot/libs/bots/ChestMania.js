/**
*	@filename	ChestMania.js
*	@author		kolton
*	@desc		Open chests in configured areas
*/

function ChestMania() {
	var prop, i;

	Town.doChores();

	for (prop in Config.ChestMania) {
		if (Config.ChestMania.hasOwnProperty(prop)) {
			for (i = 0; i < Config.ChestMania[prop].length; i += 1) {
				Pather.journeyTo(Config.ChestMania[prop][i]);
				Precast.doPrecast(i == 0 ? true : false);
				Misc.openChestsInArea(Config.ChestMania[prop][i]);
			}

			Town.doChores();
		}
	}

	return true;
}