/**
*	@filename	Tombs.js
*	@author		kolton
*	@desc		clear Tal Rasha's Tombs
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Tombs() {
	var i;

	Town.doChores();
	Pather.useWaypoint(Areas.Act2.Canyon_Of_The_Magi);
	Precast.doPrecast(true);

    for (i = Areas.Act2.Tal_Rashas_Tomb_1; i <= Areas.Act2.Tal_Rashas_Tomb_7; i += 1) {
		if (!Pather.moveToExit(i, true)) {
			throw new Error("Failed to move to tomb");
		}

		Attack.clearLevel(Config.ClearType);

        if (i === Areas.Act2.Tal_Rashas_Tomb_4) {
			Precast.doPrecast(true);
		}

        if (!Pather.moveToExit(Areas.Act2.Canyon_Of_The_Magi, true)) {
			throw new Error("Failed to move to Canyon");
		}
	}

	return true;
}