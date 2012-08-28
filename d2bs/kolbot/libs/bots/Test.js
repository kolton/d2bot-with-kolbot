function Test() {
	print("ÿc8TESTING");

	var c;

	//include("automule.js");

	function KeyDown(key) {
		if (key === 45) {
			c = true;
		}
	}

	addEventListener("keydown", KeyDown);

	while (true) {
		if (c) {
			test();

			c = false;
		}

		delay(10);
	}
}

function test() {
	Misc.logItem("TEST", getUnit(101) || me.getItem());
}

function thawingadventure() {
	var i, items,
		item = me.getItem("bhm"),
		count = me.itemcount,
		u = getUnit(101);

	if (!u) {
		return;
	}

	while (true) {
		sendPacket(1, 0x32, 4, getInteractedNPC().gid, 4, u.gid, 4, 0, 4, 0);

		if (me.itemcount >= count + 40) {
			while (me.itemcount !== count) {
				items = me.getItems();

				for (i = 0; i < items.length; i += 1) {
					if (items[i].mode === 0 && items[i].location === 3) {
						sendPacket(1, 0x27, 4, item.gid, 4, items[i].gid);

						delay(10);
					}
				}

				delay(10);
			}
		}

		delay(10);
	}
}