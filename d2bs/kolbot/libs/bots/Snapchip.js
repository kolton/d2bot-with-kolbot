/**
*	@filename	Snapchip.js
*	@author		kolton
*	@desc		kill Snapchip and optionally clear Icy Cellar
*/

function Snapchip(Config, Attack) {
	Town.doChores();
	if (!me.journeyToPreset(119, 2, 397)) {
		throw new Error("Failed to move to Snapchip Shatter");
	}

	Attack.clear(15, 0, getLocaleString(22496)); // Snapchip Shatter

	if (Config.Snapchip.ClearIcyCellar) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}