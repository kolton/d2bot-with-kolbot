/**
*	@filename	KurastChests.js
*	@author		kolton
*	@desc		open chests in Lower Kurast and optionally Kurast Bazaar
*/

function KurastChests() {
	Town.doChores();

	if (Config.KurastChests.LowerKurast) {
		Pather.useWaypoint(79);
		Precast.doPrecast(true);
		Misc.openChestsInArea(79);
	}

	if (Config.KurastChests.Bazaar) {
		if (me.inTown) {
			Pather.useWaypoint(80);
			Precast.doPrecast(true);
		}

		Misc.openChestsInArea(80);
	}

	if (Config.KurastChests.Sewers1) {
		if (me.inTown) {
			Pather.useWaypoint(80);
			Precast.doPrecast(true);
		}

		Pather.moveToExit(me.area === 80 ? 92 : [80, 92], true);
		Misc.openChestsInArea(92);
	}

	if (Config.KurastChests.Sewers2) {
		if (me.inTown) {
			Pather.useWaypoint(80);
			Precast.doPrecast(true);
		}

		Pather.moveToExit(me.area === 92 ? 93 : me.area === 80 ? [92, 93] : [80, 92, 93], true);
		Misc.openChestsInArea(93);
	}

	Town.goToTown(4);

	return true;
}