/**
*	@filename	Corpsefire.js
*	@author		kolton
*	@desc		kill Corpsefire and optionally clear Den of Evil
*/

function Corpsefire(Config, Attack) {
	Town.doChores();

	if (!me.journeyToPreset(me.area, 1, 774, 0, 0, false, true)) {
		throw new Error("Failed to move to Corpsefire");
	}

	Attack.clear(15, 0, getLocaleString(3319)); // Corpsefire

	if (Config.Corpsefire.ClearDen) {
		Attack.clearLevel();
	}
}