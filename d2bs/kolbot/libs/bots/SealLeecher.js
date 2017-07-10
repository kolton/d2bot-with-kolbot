function SealLeecher() {
	var monster,
		commands = [];

	Town.goToTown(4);
	Town.doChores();
	Town.move("portalspot");

	if (!Config.Leader) {
		D2Bot.printToConsole("You have to set Config.Leader");
		D2Bot.stop();

		return false;
	}

	addEventListener("chatmsg",
		function (nick, msg) {
			if (nick === Config.Leader) {
				commands.push(msg);
			}
		});

	// Wait until leader is partied
	while (!Misc.inMyParty(Config.Leader)) {
		delay(1000);
	}

	while (Misc.inMyParty(Config.Leader)) {
		if (commands.length > 0) {
			switch (commands[0]) {
			case "in":
				if (me.inTown) {
					Pather.usePortal(Areas.Act4.Chaos_Sanctuary, Config.Leader);
					delay(250);
				}

				if (getDistance(me, 7761, 5267) < 10) {
					Pather.walkTo(7761, 5267, 2);
				}

				commands.shift();

				break;
			case "out":
				if (!me.inTown) {
					Pather.usePortal(Areas.Act4.The_Pandemonium_Fortress, Config.Leader);
				}

				commands.shift();

				break;
			}
		}

		while (me.mode === 40) {
			delay(40);
		}

		if (me.mode === PlayerModes.Dead) {
			me.revive();

			while (!me.inTown) {
				delay(40);
			}
		}

		if (!me.inTown) {
			monster = getUnit(UnitType.NPC);

			if (monster) {
				do {
					if (Attack.checkMonster(monster) && getDistance(me, monster) < 20) {
						me.overhead("HOT");
						Pather.usePortal(Areas.Act4.The_Pandemonium_Fortress, Config.Leader);
					}
				} while (monster.getNext());
			}
		}

		delay(100);
	}

	return true;
}