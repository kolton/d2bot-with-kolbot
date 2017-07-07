/**
*	@filename	Icehawk.js
*	@author		kolton
*	@desc		kill Icehawk Riftwing
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Icehawk() {
	Town.doChores();
	Pather.useWaypoint(Areas.Act3.Kurast_Bazaar);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act3.A3_Sewers_Level_1, Areas.Act3.A3_Sewers_Level_2], false)) {
		throw new Error("Failed to move to Icehawk");
	}

	Attack.clear(15, 0, getLocaleString(2864)); // Icehawk Riftwing

	return true;
}