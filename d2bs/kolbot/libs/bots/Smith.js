/**
*	@filename	Smith.js
*	@author		kolton
*	@desc		kill the Smith
*/

function Smith(Config, Attack, Pickit) {
	Town.doChores();
	if (!me.journeyToPreset(28, 2, 108)) {
		throw new Error("Failed to move to the Smith");
	}

	Attack.kill(getLocaleString(2889)); // The Smith
	Pickit.pickItems();

	return true;
}