/**
*	@filename	Worldstone.js
*	@author		kolton
*	@desc		Clear Worldstone levels
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Worldstone() {
	Town.doChores();
	Pather.useWaypoint(Areas.Act5.The_Worldstone_Keep_Level_2);
	Precast.doPrecast(true);
	Attack.clearLevel(Config.ClearType);

    if (Pather.moveToExit(Areas.Act5.The_Worldstone_Keep_Level_1, true)) {
		Attack.clearLevel(Config.ClearType);
	}

    if (Pather.moveToExit([Areas.Act5.The_Worldstone_Keep_Level_2, Areas.Act5.The_Worldstone_Keep_Level_3], true)) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}