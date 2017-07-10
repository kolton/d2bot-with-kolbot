/**
*	@filename	Rakanishu.js
*	@author		kolton
*	@desc		kill Rakanishu and optionally Griswold
*/

function Rakanishu() {
	Town.doChores();
	Pather.useWaypoint(Areas.Act1.Stony_Field);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Rakanishu, 0, 0, false, true)) {
		throw new Error("Failed to move to Rakanishu");
	}

	Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu

	if (Config.Rakanishu.KillGriswold && me.getQuest(Quests.Act1.The_Search_for_Cain, 4)) {
		if (!Pather.usePortal(Areas.Act1.Tristram)) {
			throw new Error("Failed to move to Tristram");
		}

		Pather.moveTo(25149, 5180);
		Attack.clear(20, 0xF, UnitClassID.griswold); // Griswold
	}

	return true;
}