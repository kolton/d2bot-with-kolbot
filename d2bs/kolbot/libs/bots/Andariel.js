/**
*	@filename	Andariel.js
*	@author		kolton
*	@desc		kill Andariel
*/

function Andariel(Config, Attack, Pickit) {
	Town.doChores();
	if (!Pather.journeyTo(sdk.areas.CatacombsLvl4)) {
		throw Error('Failed to move to Andariel');
	}

	Pather.moveTo(22549, 9520);
	Attack.kill(156); // Andariel

	delay(2000); // Wait for minions to die.
	Pickit.pickItems();

	return true;
}
