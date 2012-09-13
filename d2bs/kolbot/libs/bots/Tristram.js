/**
*	@filename	Tristram.js
*	@author		kolton
*	@desc		clear Tristram
*/

function Tristram() {
	if (!me.getQuest(4, 0)) {
		throw new Error("You don't have the Cain quest");
	}

	var i;

	Town.doChores();
	Pather.useWaypoint(4);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 1, 737, 0, 0, false, true)) {
		throw new Error("Failed to move to Rakanishu");
	}

	Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu

	for (i = 0; i < 5; i += 1) {
		if (Pather.usePortal(38)) {
			break;
		}

		delay(1000);
	}
	
	if (Config.Tristram.PortalLeech) {

		Pather.makePortal();
		delay(1000);
		Attack.clearLevel(0);

	} else {

		Attack.clearLevel(Config.ClearType);

	}

	return true;
}