/**
*	@filename	UndergroundPassage.js
*	@author		loshmi
*	@desc		Move and clear Underground passage level 2
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function UndergroundPassage() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Stony_Field);
	Precast.doPrecast(true);

    if (!Pather.moveToExit([Areas.Act1.Underground_Passage_Level_1, Areas.Act1.Underground_Passage_Level_2], true)) {
		throw new Error("Failed to move to Underground passage level 2");
	}

	Attack.clearLevel();

	return true;
}