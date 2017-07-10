/**
*	@filename	BattleOrders.js
*	@author		kolton
*	@desc		give or receive Battle Orders buff
*/

function BattleOrders() {
	this.giveBO = function (list) {
		var i, unit,
			failTimer = 60,
			tick = getTickCount();

		for (i = 0; i < list.length; i += 1) {
			unit = getUnit(0, list[i]);

			if (unit) {
				while (!unit.getState(States.BATTLEORDERS) && copyUnit(unit).x) {
					if (getTickCount() - tick >= failTimer * 1000) {
						showConsole();
						print("ÿc1BO timeout fail.");
						quit();
					}

					Precast.doPrecast(true);
					delay(1000);
				}
			}
		}

		return true;
	};

	Town.doChores();

	try {
		Pather.useWaypoint(Areas.Act1.Catacombs_Level_2, true); // catacombs
	} catch (wperror) {
		showConsole();
		print("ÿc1Failed to take waypoint.");
		quit();
	}

	Pather.moveTo(me.x + 6, me.y + 6);

	var i,
		tick = getTickCount(),
		failTimer = 60;

MainLoop:
	while (true) {
		switch (Config.BattleOrders.Mode) {
		case 0: // Give BO
			for (i = 0; i < Config.BattleOrders.Getters.length; i += 1) {
				while (!Misc.inMyParty(Config.BattleOrders.Getters[i]) || !getUnit(0, Config.BattleOrders.Getters[i])) {
					if (getTickCount() - tick >= failTimer * 1000) {
						showConsole();
						print("ÿc1BO timeout fail.");
						quit();
					}

					delay(500);
				}
			}

			if (this.giveBO(Config.BattleOrders.Getters)) {
				break MainLoop;
			}

			break;
		case 1: // Get BO
			if (me.getState(States.BATTLEORDERS)) {
				delay(1000);

				break MainLoop;
			}

			if (getTickCount() - tick >= failTimer * 1000) {
				showConsole();
				print("ÿc1BO timeout fail.");
				quit();
			}

			break;
		}

		delay(500);
	}

	Pather.useWaypoint(Areas.Act1.Rogue_Encampment);

	if (Config.BattleOrders.Mode === 0 && Config.BattleOrders.Wait) {
		for (i = 0; i < Config.BattleOrders.Getters.length; i += 1) {
			while (Misc.inMyParty(Config.BattleOrders.Getters[i])) {
				delay(500);
			}
		}
	}

	return true;
}