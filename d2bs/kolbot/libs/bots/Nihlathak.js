/**
*	@filename	Nihlathak.js
*	@author		kolton
*	@desc		kill Nihlathak
*/

function Nihlathak(Config, Attack) {
	Town.doChores();

	if (!me.journeyToPreset(124, 2, 462, 0, 0, false, true)) {
		throw new Error("Failed to go to Nihlathak");
	}

	if (Config.Nihlathak.ViperQuit && getUnit(1, 597)) {
		print("Tomb Vipers found.");
	}

	Attack.kill(526); // Nihlathak
	Pickit.pickItems();
}