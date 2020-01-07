/**
*	@filename	Snapchip.js
*	@author		kolton
*	@desc		kill Snapchip and optionally clear Icy Cellar
*/

function Snapchip() {
	Town.doChores();
	Pather.useWaypoint(118);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(119, true, Config.ClearPath) || !Pather.moveToPreset(me.area, 2, 397, 0, 0, Config.ClearPath)) {
		throw new Error("Failed to move to Snapchip Shatter");
	}

	Attack.clear(15, 0, getLocaleString(22496)); // Snapchip Shatter

	if (Config.Snapchip.ClearIcyCellar) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}