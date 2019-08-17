/**
*	@filename	Tristram.js
*	@author		kolton, cuss
*	@desc		clear Tristram
*/

function Tristram(Config, Attack, Pickit) {
	var tree, scroll, akara, stones, gibbet;

	if (!me.getQuest(4, 4) && !me.getItem(525)) {
		if (!me.getItem(524)) {
			// print("We need Scroll of Inifuss");
			Town.doChores();
			if (!me.journeyToPreset(sdk.areas.DarkWood, 2, 30, 5, 5)) {
				throw new Error("Failed to move to Tree of Inifuss");
			}

			tree = getUnit(2, 30);

			Misc.openChest(tree);
			delay(300);

			scroll = getUnit(4, 524);

			Pickit.pickItem(scroll);
			Town.goToTown();
		}

		// print("We need Key to the Cairn Stones");
		Town.move(NPC.Akara);

		akara = getUnit(1, NPC.Akara);

		akara.openMenu();
		me.cancel();
	}

	Pather._teleport = Pather.teleport;

	Town.doChores();
	if (!me.journeyToPreset(sdk.areas.StonyField, 1, 737, 0, 0, false, true)) {
		throw new Error("Failed to move to Rakanishu");
	}

	if (!me.getQuest(4, 4)) {
		stones = [getUnit(2, 17), getUnit(2, 18), getUnit(2, 19), getUnit(2, 20), getUnit(2, 21)];
	}

	Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu

	while (!me.getQuest(4, 4)) {
		stones.forEach(function (stone) {
			if (!stone.mode) {
				Attack.securePosition(stone.x, stone.y, 10, me.ping * 2);
				Misc.click(0, 0, stone);
			}
		});
	}

	while (!Pather.usePortal(38)) {
		Attack.securePosition(me.x, me.y, 10, 1000);
	}

	Pather.moveTo(me.x, me.y + 6);

	if (Config.Tristram.PortalLeech) {
		Pather.makePortal();
		delay(1000);
		Pather.teleport = !Config.Tristram.WalkClear && Pather._teleport;
	}

	gibbet = getUnit(2, 26);

	if (!gibbet.mode) {
		if (!me.journeyToPreset(sdk.areas.Tristram, 2, 26, 0, 0, true, true)) {
			throw new Error("Failed to move to Cain's Gibbet");
		}

		Misc.openChest(gibbet);
	}

	if (Config.Tristram.PortalLeech) {
		Attack.clearLevel(0);
	} else {
		Attack.clearLevel(Config.ClearType);
	}

	Pather.teleport = Pather._teleport;
}