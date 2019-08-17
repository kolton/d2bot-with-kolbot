/**
*	@filename	Frozenstein.js
*	@author		kolton
*	@desc		kill Frozensteinand optionally clear Frozen River
*/

function Frozenstein(Config, Attack) {
	Town.doChores();
	if (!me.journeyToPreset(114, 2, 460, -5, -5)) {
		throw new Error("Failed to move to Frozenstein");
	}

	Attack.clear(15, 0, getLocaleString(22504)); // Frozenstein

	if (Config.Frozenstein.ClearFrozenRiver) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}