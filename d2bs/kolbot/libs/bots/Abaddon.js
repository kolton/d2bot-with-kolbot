/**
*	@filename	Abaddon.js
*	@author		kolton
*	@desc		clear Abaddon
*/

function Abaddon() {
	Town.doChores();
	Pather.useWaypoint(111);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(111, 2, 60) || !Pather.usePortal(125)) {
		throw new Error("Failed to move to Abaddon");
	}

	Attack.clearLevel(Config.ClearType);

	return true;
}