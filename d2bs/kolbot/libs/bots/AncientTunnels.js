/**
*	@filename	AncientTunnels.js
*	@author		kolton
*	@desc		clear Ancient Tunnels
*/

function AncientTunnels() {
	Town.doChores();
	Pather.useWaypoint(44);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(65, true)) {
		throw new Error("Failed to move to Ancient Tunnels");
	}

	Attack.clearLevel(Config.ClearType);

	return true;
}