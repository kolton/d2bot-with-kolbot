/**
*	@filename	Rakanishu.js
*	@author		kolton
*	@desc		kill Rakanishu and optionally Griswold
*/

function Rakanishu(Config, Attack, Pickit) {
	Town.doChores();

	if (!me.journeyToPreset(4, 1, 737, 0, 0, false, true)) {
		throw new Error("Failed to move to Rakanishu");
	}

	Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu

	if (Config.Rakanishu.KillGriswold && me.getQuest(4, 4)) {
		if (!Pather.usePortal(38)) {
			throw new Error("Failed to move to Tristram");
		}

		Pather.moveTo(25149, 5180);
		Attack.clear(20, 0xF, 365); // Griswold
	}

	return true;
}