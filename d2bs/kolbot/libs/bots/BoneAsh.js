/**
*	@filename	BoneAsh.js
*	@author		kolton
*	@desc		kill Bone Ash
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function BoneAsh() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Inner_Cloister);
	Precast.doPrecast(true);

	if (!Pather.moveTo(20047, 4898)) {
		throw new Error("Failed to move to Bone Ash");
	}

	Attack.kill(getLocaleString(2878)); // Bone Ash
	Pickit.pickItems();

	return true;
}