/**
*	@filename	Frozenstein.js
*	@author		kolton
*	@desc		kill Frozensteinand optionally clear Frozen River
*/

function Frozenstein() {
	Town.doChores();
	Pather.useWaypoint(113);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(114, true) || !Pather.moveToPreset(me.area, 2, 460, -5, -5)) {
		throw new Error("Failed to move to Frozenstein");
	}

	Attack.clear(15, 0, getLocaleString(22504)); // Frozenstein

	if (Config.Frozenstein.ClearFrozenRiver) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}