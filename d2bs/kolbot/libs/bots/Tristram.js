/**
*	@filename	Tristram.js
*	@author		kolton, cuss
*	@desc		clear Tristram
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Tristram() {
	var tree, scroll, akara, stones, gibbet;

    if (!me.getQuest(Quests.Act1.The_Search_for_Cain, 4) && !me.getItem(ItemClassIds.Key_To_The_Cairn_Stones)) {
        if (!me.getItem(ItemClassIds.Scroll_Of_Inifuss)) {
			// print("We need Scroll of Inifuss");
			Town.doChores();
            Pather.useWaypoint(Areas.Act1.Dark_Wood);
			Precast.doPrecast(true);

            if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Inifuss_Tree, 5, 5)) {
				throw new Error("Failed to move to Tree of Inifuss");
			}

            tree = getUnit(UnitType.Object, UniqueObjectIds.Inifuss_Tree);

			Misc.openChest(tree);
			delay(300);

            scroll = getUnit(UnitType.Item, ItemClassIds.Scroll_Of_Inifuss);

			Pickit.pickItem(scroll);
			Town.goToTown();
		}

		// print("We need Key to the Cairn Stones");
		Town.move("akara");

        akara = getUnit(UnitType.NPC, "akara");

		akara.openMenu();
		me.cancel();
	}

	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Stony_Field);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Rakanishu, 0, 0, false, true)) {
		throw new Error("Failed to move to Rakanishu");
	}

    if (!me.getQuest(Quests.Act1.The_Search_for_Cain, 4)) {
        stones = [getUnit(UnitType.Object, UniqueObjectIds.StoneAlpha), getUnit(UnitType.Object, UniqueObjectIds.StoneBeta), getUnit(UnitType.Object, UniqueObjectIds.StoneGamma), getUnit(UnitType.Object, UniqueObjectIds.StoneDelta), getUnit(UnitType.Object, UniqueObjectIds.StoneLambda)];
	}

	Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu

    while (!me.getQuest(Quests.Act1.The_Search_for_Cain, 4)) {
		stones.forEach(function (stone) {
			if (!stone.mode) {
				Attack.securePosition(stone.x, stone.y, 10, me.ping * 2);
				Misc.click(0, 0, stone);
			}
		});
	}

    while (!Pather.usePortal(Areas.Act1.Tristram)) {
		Attack.securePosition(me.x, me.y, 10, 1000);
	}

	Pather.moveTo(me.x, me.y + 6);

	if (Config.Tristram.PortalLeech) {
		Pather.makePortal();
		delay(1000);
	}

    gibbet = getUnit(UnitType.Object, UniqueObjectIds.Cain_Captured);

	if (!gibbet.mode) {
        if (!Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Cain_Captured, 0, 0, true, true)) {
			throw new Error("Failed to move to Cain's Gibbet");
		}

		Misc.openChest(gibbet);
	}

	if (Config.Tristram.PortalLeech) {
		Attack.clearLevel(0);
	} else {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}