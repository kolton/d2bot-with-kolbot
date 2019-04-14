
var Mercenary = {
	variants: {
		"271": [7, 11],
		"338": [[99, 104, 108], [103, 114, 98]],	//Normal/Hell, Nightmare
		"359": [41, 55, 38],
		"560": [126]
	},

	classIds: [
		-1,
		271, 	//Act 1 - Rogue
		338,	//Act 2 - Guard
		359,	//Act 3 - Iron Wolf
		-1,
		560		//Act 5 - Barb
	],

	availableMercs: [],

	getMerc: function () {
		if (!Config.UseMerc) {
			return null;
		}

		var merc = null;

		// me.getMerc() might return null if called right after taking a portal, that's why there's retry attempts
		for (var i = 0; i < 3; i++) {
			merc = me.getMerc();

			if (merc && merc.mode === 0 && merc.mode === 12) {
				return null;
			} else if (merc) {
				break;
			}

			delay(100);

		}

		return merc;

	},

	getVariant: function () {
		var merc = this.getMerc();

		if (!merc) {
			return null;
		}

		for (var i = 0; i < this.variants[merc.classid].length; i++) {
			if (Array.isArray(this.variants[merc.classid][i])) {
				for (var j = 0; j < this.variants[merc.classid][i].length; j++) {
					if (merc.getSkill(this.variants[merc.classid][i][j], 1)) {
						return this.variants[merc.classid][i][j];
					}
				}
			} else {
				if (merc.getSkill(this.variants[merc.classid][i], 1)) {
					return this.variants[merc.classid][i];
				}

			}

		}

		throw new Error("Mercenary.getVariant: Couldn't determine merc variant.");

	},

	hasMerc: function (mercType, variant) {
		if (!Config.UseMerc) {
			return true;	//We don't want a merc
		}

		if (mercType === undefined) {
			if (typeof Config.UseMerc === "object") {
				mercType = Config.UseMerc.mercType;
			} else {
				mercType = Config.UseMerc;
			}

		}

		if (variant === undefined) {
			if (typeof Config.UseMerc === "object") {
				variant = Config.UseMerc.variant;
			} else {
				variant = -1;
			}

		}

		if (mercType < 1 || mercType > 5 || mercType === 4) {
			throw new Error("Mercenary.hasMerc: Incorrect value for mercType");
		}

		var merc = this.getMerc();

		if (!merc && (me.mercrevivecost === 0 || me.gametype === 0)) {
			return true;	//We never had a merc
		} else if (this.isDead()) {
			return true;	//Merc is dead so we can't determine the variant or type
		} else if (this.classIds[mercType] !== merc.classid) {
			return false;	//We want a different type of merc

		}

		//If the variant was specified, determine if the merc variant is the same
		if (variant !== -1) {
			if (this.getVariant() !== variant) {
				return false;	//We want a different variant of merc

			}

		}

		return true;

	},

	isDead: function () {
		return me.mercrevivecost > 0;

	},

	needMerc: function () {
		if (me.gold < me.mercrevivecost) {
			return false;
		}

		return Config.UseMerc && (this.isDead() || !this.hasMerc());

	},

	canHire: function (mercType) {
		if (mercType === undefined) {
			if (typeof Config.UseMerc === "object") {
				mercType = Config.UseMerc.mercType;
			} else {
				mercType = Config.UseMerc;
			}

		}

		var canHire = false;

		switch (mercType) {
		case 1:

			if ((this._checkQuest(2, 1) || this._checkQuest(2, 0)) || me.charlvl >= 8) {
				canHire = true;
			}

			break;

		case 2:
			if (me.getQuest(6, 0) || me.getQuest(6, 1)) {
				canHire = true;
			}

			break;

		case 3:
			if (me.getQuest(14, 0) || me.getQuest(14, 1) || me.getQuest(14, 3) || me.getQuest(14, 4)) {
				canHire = true;
			}

			break;

		case 5:
			if (me.getQuest(36, 0)) {
				canHire = true;
			}

			break;

		default:
			throw new Error("Mercenary.canHire: Incorrect value for mercType: " + mercType);

		}

		return canHire;

	},

	hire: function (args) {
		if (args === undefined) {
			return false;
		}

		if (args.mercType === undefined) {
			throw new Error("Mercenary.hire: args.mercType is required");
		}

		if (args.mercType < 1 || args.mercType === 4 || args.mercType > 5) {
			throw new Error("Mercenary.hire: Invalid mercType");
		}

		if (args.replace === undefined) {
			args.replace = false;
		}	//useful if the merc level is far behind our level and we want a new one to catch up

		if (args.variant === undefined) {
			args.variant = -1;
		}

		if (!args.replace && this.hasMerc(args.mercType, args.variant)) {
			return true;
		}

		if (!this.canHire(args.mercType)) {
			print("Mercenary.hire:  Can't hire merc of type " + args.mercType);

			return false;

		}

		print("Mercenary.hire: Hiring new Merc of type " + args.mercType + " and variant " + args.variant);

		if (!Town.goToTown(args.mercType)) {
			return false;
		}

		if (this.isDead()) {
			this.revive();
		}	//Revive so we can pull the equipment off, just in case

		if (!this.unloadEquipment()) {
			return false;
		}	//Bail out if we can't unload the merc's equipment, just in case

		Town.move(Town.tasks[args.mercType - 1].Merc);	//Move to Merc NPC for the mercType act
		Pather.moveTo(me.x + rand(-3, 3), me.y + rand(-3, 3));
		Town.move(Town.tasks[args.mercType - 1].Merc);

		delay(1000);

		addEventListener("gamepacket", this._gamePacket);
		var hire = getUnit(1, Town.tasks[args.mercType - 1].Merc);

		if (!hire || !hire.openMenu()) {
			sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
			delay(1000 + me.ping);
			Town.move(Town.tasks[args.mercType - 1].Merc);
			sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
			hire = getUnit(1, Town.tasks[args.mercType - 1].Merc);
			hire.openMenu();

			if (!hire || !hire.openMenu()) {
				throw new Error("Mercenary.hireMerc: failed to open npc menu");
			}
		}

		delay(1000 + me.ping * 2);

		removeEventListener("gamepacket", this._gamePacket);

		//Hire mercs until we get the right one.
		if (Mercenary.availableMercs.length) {
			do {
				print("Trying to hire a merc");
				//print(Mercenary.availableMercs.toSource());
				Misc.useMenu(0x0D45);
				sendPacket(1, 0x36, 4, hire.gid, 4, Mercenary.availableMercs.pop());

				delay(2000 + me.ping * 2);

				var v = this.getVariant();
				print("my new merc variant is: " + v + " - desired variant: " + args.variant);

				if (args.variant === v) {
					break;
				}

			} while (!this.hasMerc(args.mercType, args.variant) && Mercenary.availableMercs.length > 0);

		} else {
			print("No mercs available");

			me.cancel();

			return false;

		}

		me.cancel();

		return true;

	},

	revive: function () {
		if (!this.needMerc()) {
			print("I don't need to revive my merc");

			return true;
		}

		if (!this.isDead()) {
			return true;
		}

		// Fuck Aheara
		if (me.act === 3) {
			Town.goToTown(2);
		}

		var i, tick, dialog, lines,
			preArea = me.area,
			npc = Town.initNPC("Merc", "reviveMerc");

		if (!npc) {
			return false;
		}

		MainLoop:
		for (i = 0; i < 3; i += 1) {
			dialog = getDialogLines();

			for (lines = 0; lines < dialog.length; lines += 1) {
				if (dialog[lines].text.match(":", "gi")) {
					dialog[lines].handler();
					delay(Math.max(750, me.ping * 2));
				}

				// "You do not have enough gold for that."
				if (dialog[lines].text.match(getLocaleString(3362), "gi")) {
					return false;
				}
			}

			while (getTickCount() - tick < 2000) {
				if (me.getMerc()) {
					delay(Math.max(750, me.ping * 2));

					break MainLoop;
				}

				delay(200);
			}
		}

		Attack.checkInfinity();

		if (me.getMerc()) {
			if (Config.MercWatch && !me.inTown) { // Cast BO on merc so he doesn't just die again
				print("MercWatch precast");
				Pather.useWaypoint("random");
				Precast.doPrecast(true);
				Pather.useWaypoint(preArea);
			}

			return true;
		}

		return false;

	},

	unloadEquipment: function () {
		print("Unloading merc equipment");
		var cursorItem;

		//ok this is a bit stupid
		clickItem(4, 4);
		delay(me.ping + 500);

		if (me.itemoncursor) {
			delay(me.ping + 500);
			cursorItem = getUnit(100);

			if (cursorItem) {
				if (!Storage.Inventory.MoveTo(cursorItem)) {
					return false;
				}

				delay(me.ping + 1000);

				if (me.itemoncursor) {
					Misc.click(0, 0, me);
					delay(me.ping + 500);
				}
			}
		}

		clickItem(4, 3);
		delay(me.ping + 500);

		if (me.itemoncursor) {
			delay(me.ping + 500);
			cursorItem = getUnit(100);

			if (cursorItem) {
				if (!Storage.Inventory.MoveTo(cursorItem)) {
					return false;
				}

				delay(me.ping + 1000);

				if (me.itemoncursor) {
					Misc.click(0, 0, me);
					delay(me.ping + 500);
				}

			}

		}

		clickItem(4, 1);
		delay(me.ping + 500);

		if (me.itemoncursor) {
			delay(me.ping + 500);
			cursorItem = getUnit(100);

			if (cursorItem) {
				if (!Storage.Inventory.MoveTo(cursorItem)) {
					return false;
				}

				delay(me.ping + 500);

				if (me.itemoncursor) {
					Misc.click(0, 0, me);
					delay(me.ping + 500);
				}
			}
		}

		return true;

	},

	_gamePacket: function (bytes) {
		switch (bytes[0]) {
		case 0x4e:
			//print("bytes " + bytes.toSource());
			var id = (bytes[2] << 8) + bytes[1];

			if (Mercenary.availableMercs.indexOf(id) !== -1) {
				//print("length = 0");
				Mercenary.availableMercs.length = 0;
			}

			Mercenary.availableMercs.push(id);
			break;
		}
	},

	_checkQuest: function (id, state) {
		sendPacket(1, 0x40);
		delay(500);

		return me.getQuest(id, state);
	}

};
