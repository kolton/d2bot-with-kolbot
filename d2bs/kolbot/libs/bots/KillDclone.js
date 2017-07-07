/**
*	@filename	KillDclone.js
*	@author		kolton
*	@desc		Got to Palace Cellar level 3 and kill Diablo Clone.
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function KillDclone() {
	//Town.doChores();
    Pather.useWaypoint(Areas.Act2.Arcane_Sanctuary);
	Precast.doPrecast(true);

	if (!Pather.usePortal(null)) {
		throw new Error("Failed to move to Palace Cellar");
	}

    Attack.kill(UnitClassID.diabloclone);
	Pickit.pickItems();

	if (AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("torchMuleInfo")) {
		scriptBroadcast("muleAnni");
	}

	return true;
}