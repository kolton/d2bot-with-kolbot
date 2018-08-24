/**
*	@filename	UserAddon.js
*	@author		kolton
*	@desc		Allows you to see more information about items, NPCs and players by placing the cursor over them.
*				Shows item level, items in sockets, classid, code and magic item prefix/suffix numbers.
*				Shows monster's classid, HP percent and resistances.
*				Shows other players' gear.
*/

function UserAddon() {
	var i, unit, title, dummy,
		info = new UnitInfo(),
		classes = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
		flags = [0x1, 0x2, 0x3, 0x4, 0x5, 0xf, 0x18, 0x19, 0xc, 0x9];

	this.keyEvent = function (key) {
		switch (key) {
		case 32:
			FileTools.copy("libs/config/" + classes[me.classid] + ".js", "libs/config/" + classes[me.classid] + "." + me.name + ".js");
			D2Bot.printToConsole("libs/config/" + classes[me.classid] + "." + me.name + ".js has been created.");
			D2Bot.printToConsole("Please configure your bot and start it again.");
			D2Bot.stop();

			break;
		}
	};

	if (!Config.FastPick) { // Make sure the item event is loaded
		addEventListener("itemaction", this.itemEvent);
	}

	if (!FileTools.exists("libs/config/" + classes[me.classid] + "." + me.name + ".js")) {
		showConsole();
		print("ÿc4UserAddonÿc0: Press HOME and then press SPACE if you want to create character config.");
		addEventListener("keyup", this.keyEvent);
	}

	while (true) {
		for (i = 0; i < flags.length; i += 1) {
			if (getUIFlag(flags[i])) {
				if (title) {
					title.remove();
					dummy.remove();

					title = false;
					dummy = false;
				}

				break;
			}
		}

		if (i === flags.length && !title) {
			title = new Text(":: kolbot user addon ::", 400, 525, 4, 0, 2);
			dummy = new Text("`", 1, 1); // Prevents crash
		}

		Pickit.fastPick();

		unit = getUnit(101);

		info.createInfo(unit);
		delay(20);
	}
}

function UnitInfo() {
	this.x = 200;
	this.y = 250;
	this.hooks = [];
	this.cleared = true;

	this.createInfo = function (unit) {
		if (typeof unit === "undefined") {
			this.remove();

			return;
		}

		switch (unit.type) {
		case 0:
			this.playerInfo(unit);

			break;
		case 1:
			this.monsterInfo(unit);

			break;
		case 4:
			this.itemInfo(unit);

			break;
		}
	};

	this.playerInfo = function (unit) {
		var i, items, string,
			frameXsize = 0,
			frameYsize = 20,
			quality = ["ÿc0", "ÿc0", "ÿc0", "ÿc0", "ÿc3", "ÿc2", "ÿc9", "ÿc4", "ÿc8"];

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y, 4, 13, 2));

		items = unit.getItems();

		if (items) {
			this.hooks.push(new Text("Equipped items:", this.x, this.y + 15, 4, 13, 2));
			frameYsize += 15;

			for (i = 0; i < items.length; i += 1) {
				if (items[i].getFlag(0x4000000)) {
					string = items[i].fname.split("\n")[1] + "ÿc0 " + items[i].fname.split("\n")[0];
				} else {
					string = quality[items[i].quality] + (items[i].quality > 4 && items[i].getFlag(0x10) ? items[i].fname.split("\n").reverse()[0].replace("ÿc4", "") : items[i].name);
				}

				this.hooks.push(new Text(string, this.x, this.y + (i + 2) * 15, 0, 13, 2));

				if (string.length > frameXsize) {
					frameXsize = string.length;
				}

				frameYsize += 15;
			}
		}

		this.cleared = false;

		this.hooks.push(new Box(this.x + 2, this.y - 15, Math.round(frameXsize * 7.5) - 4, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, Math.round(frameXsize * 7.5), frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.monsterInfo = function (unit) {
		var frameYsize = 125;

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y, 4, 13, 2));
		this.hooks.push(new Text("HP percent: ÿc0" + Math.round(unit.hp * 100 / 128), this.x, this.y + 15, 4, 13, 2));
		this.hooks.push(new Text("Fire resist: ÿc0" + unit.getStat(39), this.x, this.y + 30, 4, 13, 2));
		this.hooks.push(new Text("Cold resist: ÿc0" + unit.getStat(43), this.x, this.y + 45, 4, 13, 2));
		this.hooks.push(new Text("Lightning resist: ÿc0" + unit.getStat(41), this.x, this.y + 60, 4, 13, 2));
		this.hooks.push(new Text("Poison resist: ÿc0" + unit.getStat(45), this.x, this.y + 75, 4, 13, 2));
		this.hooks.push(new Text("Physical resist: ÿc0" + unit.getStat(36), this.x, this.y + 90, 4, 13, 2));
		this.hooks.push(new Text("Magic resist: ÿc0" + unit.getStat(37), this.x, this.y + 105, 4, 13, 2));

		this.cleared = false;

		this.hooks.push(new Box(this.x + 2, this.y - 15, 136, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, 140, frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.itemInfo = function (unit) {
		var i = 0,
			frameYsize = 50;

		if (!this.currentGid) {
			this.currentGid = unit.gid;
		}

		if (this.currentGid === unit.gid && !this.cleared) {
			return;
		}

		if (this.currentGid !== unit.gid) {
			this.remove();
			this.currentGid = unit.gid;
		}

		this.hooks.push(new Text("Classid: ÿc0" + unit.classid, this.x, this.y, 4, 13, 2));
		this.hooks.push(new Text("Code: ÿc0" + unit.code, this.x, this.y + 15, 4, 13, 2));
		this.hooks.push(new Text("Item level: ÿc0" + unit.ilvl, this.x, this.y + 30, 4, 13, 2));

		this.cleared = false;
		this.socketedItems = unit.getItems();

		if (this.socketedItems) {
			this.hooks.push(new Text("Socketed with:", this.x, this.y + 45, 4, 13, 2));
			frameYsize += 15;

			for (i = 0; i < this.socketedItems.length; i += 1) {
				this.hooks.push(new Text(this.socketedItems[i].fname.split("\n").reverse().join(" "), this.x, this.y + (i + 4) * 15, 0, 13, 2));

				frameYsize += 15;
			}
		}

		if (unit.quality === 4 && unit.getFlag(0x10)) {
			this.hooks.push(new Text("Prefix: ÿc0" + unit.prefixnum, this.x, this.y + frameYsize - 5, 4, 13, 2));
			this.hooks.push(new Text("Suffix: ÿc0" + unit.suffixnum, this.x, this.y + frameYsize + 10, 4, 13, 2));

			frameYsize += 30;
		}

		this.hooks.push(new Box(this.x + 2, this.y - 15, 116, frameYsize, 0x0, 1, 2));
		this.hooks.push(new Frame(this.x, this.y - 15, 120, frameYsize, 2));

		this.hooks[this.hooks.length - 2].zorder = 0;
	};

	this.remove = function () {
		while (this.hooks.length > 0) {
			this.hooks.shift().remove();
		}

		this.cleared = true;
	};
}