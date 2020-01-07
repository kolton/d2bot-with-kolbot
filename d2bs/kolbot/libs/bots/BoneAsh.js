/**
*	@filename	BoneAsh.js
*	@author		kolton
*	@desc		kill Bone Ash
*/

function BoneAsh() {
	Town.doChores();
	Pather.useWaypoint(32);
	Precast.doPrecast(true);

	if (!Pather.moveTo(20047, 4898, 3, Config.ClearPath)) {
		throw new Error("Failed to move to Bone Ash");
	}

	Attack.kill(getLocaleString(2878)); // Bone Ash
	Pickit.pickItems();

	return true;
}