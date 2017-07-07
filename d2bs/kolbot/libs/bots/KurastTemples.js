/**
*	@filename	KurastTemples.js
*	@author		kolton
*	@desc		clear Kurast Temples
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function KurastTemples() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act3.Kurast_Bazaar);
	Precast.doPrecast(true);

	var i,
        areas = [Areas.Act3.Ruined_Temple, Areas.Act3.Disused_Fane, Areas.Act3.Forgotten_Reliquary, Areas.Act3.Forgotten_Temple, Areas.Act3.Ruined_Fane, Areas.Act3.Disused_Reliquary];

	for (i = 0; i < 6; i += 1) {
        if (me.area !== Areas.Act3.Kurast_Bazaar + Math.floor(i / 2)) {
			if (!Pather.moveToExit(80 + Math.floor(i / 2), true)) {
				throw new Error("Failed to change area");
			}
		}

		if (!Pather.moveToExit(areas[i], true)) {
			throw new Error("Failed to move to the temple");
		}

		if (i === 3) {
			Precast.doPrecast(true);
		}

		Attack.clearLevel(Config.ClearType);

		if (i < 5 && !Pather.moveToExit(80 + Math.floor(i / 2), true)) {
			throw new Error("Failed to move out of the temple");
		}
	}

	return true;
}