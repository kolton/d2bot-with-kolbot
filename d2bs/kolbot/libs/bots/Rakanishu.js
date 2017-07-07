/**
*	@filename	Rakanishu.js
*	@author		kolton
*	@desc		kill Rakanishu and optionally Griswold
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Rakanishu() {
	
	//this.getLeg = function () {
	//	var i, portal, wirt, leg, gid;
    //
	//	if (me.getItem(88)) {
	//		return me.getItem(88);
	//	}
    //
	//	Pather.useWaypoint(4);
	//	Precast.doPrecast(true);
	//	Pather.moveToPreset(me.area, 1, 737, 8, 8);
    //
	//	for (i = 0; i < 6; i += 1) {
	//		portal = Pather.getPortal(38);
    //
	//		if (portal) {
	//			Pather.usePortal(null, null, portal);
    //
	//			break;
	//		}
    //
	//		delay(500);
	//	}
    //
	//	if (!portal) {
	//		throw new Error("Tristram portal not found");
	//	}
    //
	//	Pather.moveTo(25048, 5177);
    //
	//	wirt = getUnit(2, 268);
    //
	//	for (i = 0; i < 8; i += 1) {
	//		wirt.interact();
	//		delay(500);
    //
	//		leg = getUnit(4, 88);
    //
	//		if (leg) {
	//			gid = leg.gid;
    //
	//			Pickit.pickItem(leg);
	//			Town.goToTown();
    //
	//			return me.getItem(-1, -1, gid);
	//		}
	//	}
    //
	//	throw new Error("Failed to get the leg");
	//};
	
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
		//if(Config.Rakanishu.GetGriswoldsLeg) {
		//	this.getLeg();
		//}
	}

	return true;
}