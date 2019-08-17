/**
*	@filename	Endugu.js
*	@author		kolton
*	@desc		kill Witch Doctor Endugu
*/

function Endugu(Config, Attack) {
	Town.doChores();
	if (!me.journeyToPreset(91, 2, 406)) {
		throw new Error("Failed to move to Endugu");
	}

	Attack.clear(15, 0, getLocaleString(2867)); // Witch Doctor Endugu

	return true;
}