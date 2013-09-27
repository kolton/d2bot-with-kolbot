/**
*   @filename   TravincalLeech.js
*   @author	 ToS/XxXGoD/YGM
*   @desc	   Travinical Leech
*/

function TravincalLeech() {
	Town.goToTown(3);
	Town.move("portalspot");

	while (!Misc.inMyParty(Config.Leader)) {
		delay(500);
	}

	while (Misc.inMyParty(Config.Leader)) {
		if (me.inTown && Pather.getPortal(83, Config.Leader)) {
			Pather.usePortal(83, Config.Leader);
			Town.getCorpse();
		}

		if (me.mode === 17) {
			me.revive();

			while (!me.inTown) {
				delay(100);
			}

			Town.move("portalspot");
		}

		delay(100);
	}

	return true;
}