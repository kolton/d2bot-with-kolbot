/**
*	@filename	KurastChests.js
*	@author		kolton
*	@desc		open chests in Lower Kurast and optionally Kurast Bazaar
*/

function KurastChests() {
	Town.doChores();
	Pather.useWaypoint(79);
	Precast.doPrecast(true);

	Misc.openChestsInArea(79);

	if (Config.KurastChests.Bazaar) {
		Misc.openChestsInArea(80);
	}

	Town.goToTown(4);

	return true;
}