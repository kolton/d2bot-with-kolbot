/**
*	@filename	Snapchip.js
*	@author		kolton
*	@desc		kill Snapchip and optionally clear Icy Cellar
*/

function Snapchip() {
	Town.doChores();
	Pather.useWaypoint(118);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(119, true) || !Pather.moveToPreset(me.area, 2, 397)) {
		throw new Error("Failed to move to Snapchip Shatter");
	}

	Attack.clear(15, 0, getLocaleString(22496)); // Snapchip Shatter

	if (Config.Snapchip.ClearIcyCellar) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}