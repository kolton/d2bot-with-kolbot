/**
*   @filename   TravincalLeech.js
*   @author	 ToS/XxXGoD/YGM
*   @desc	   Travinical Leech
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function TravincalLeech() {
	Town.goToTown(3);
	Town.move("portalspot");

	while (!Misc.inMyParty(Config.Leader)) {
		delay(500);
	}

	while (Misc.inMyParty(Config.Leader)) {
        if (me.inTown && Pather.getPortal(Areas.Act3.Travincal, Config.Leader)) {
            Pather.usePortal(Areas.Act3.Travincal, Config.Leader);
			Town.getCorpse();
		}

        if (me.mode === PlayerModes.Dead) {
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