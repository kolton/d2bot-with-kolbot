var Hooks = {
	monsters: {
		monsterHooks: [],

		check: function () {
			var i, unit;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (!copyUnit(this.monsterHooks[i].unit).x) {
					this.monsterHooks[i].hook[0].remove();
					this.monsterHooks[i].hook[1].remove();
					this.monsterHooks.splice(i, 1);

					i -= 1;
				}
			}

			unit = getUnit(1);

			if (unit) {
				do {
					if (Attack.checkMonster(unit)) {
						if (!this.getHook(unit)) {
							this.add(unit);
						} else {
							this.updateCoords(unit);
						}
					} else {
						this.remove(unit);
					}
				} while (unit.getNext());
			}
		},

		newHook: function (unit) {
			var arr = [];

			arr.push(new Line(unit.x - 5, unit.y, unit.x + 5, unit.y, (unit.spectype & 0xF) ? 0x68 : 0x62, true));
			arr.push(new Line(unit.x, unit.y - 5, unit.x, unit.y + 5, (unit.spectype & 0xF) ? 0x68 : 0x62, true));

			return arr;
		},

		add: function (unit) {
			this.monsterHooks.push({
				unit: copyUnit(unit),
				hook: this.newHook(unit)
			});
		},

		updateCoords: function (unit) {
			var hook = this.getHook(unit);

			if (!hook) {
				return false;
			}

			hook[0].x = unit.x - 5;
			hook[0].x2 = unit.x + 5;
			hook[0].y = unit.y;
			hook[0].y2 = unit.y;
			hook[1].x = unit.x;
			hook[1].x2 = unit.x;
			hook[1].y = unit.y - 5;
			hook[1].y2 = unit.y + 5;

			return true;
		},

		getHook: function (unit) {
			var i;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (this.monsterHooks[i].unit.gid === unit.gid) {
					return this.monsterHooks[i].hook;
				}
			}

			return false;
		},

		remove: function (unit) {
			var i;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (this.monsterHooks[i].unit.gid === unit.gid) {
					this.monsterHooks[i].hook[0].remove();
					this.monsterHooks[i].hook[1].remove();
					this.monsterHooks.splice(i, 1);

					return true;
				}
			}

			return false;
		}
	},

	text: {
		textHooks: [],

		check: function () {
			if (!this.getHook("ping")) {
				this.add("ping");
			} else {
				this.getHook("ping").hook.text = "Ping: " + me.ping;
			}

			if (!this.getHook("time")) {
				this.add("time");
			} else {
				this.getHook("time").hook.text = this.timer();
			}

			if (!this.getHook("ip")) {
				this.add("ip");
			}
		},

		add: function (name) {
			switch (name) {
			case "ping":
				this.textHooks.push({
					name: "ping",
					hook: new Text("Ping: " + me.ping, 785, 56 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			case "time":
				this.textHooks.push({
					name: "time",
					hook: new Text(this.timer(), 785, 72 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			case "ip":
				this.textHooks.push({
					name: "ip",
					hook: new Text("IP: " + (me.gameserverip.length > 0 ? me.gameserverip.split(".")[3] : "0"), 785, 88 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			}
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.textHooks.length; i += 1) {
				if (this.textHooks[i].name === name) {
					return this.textHooks[i];
				}
			}

			return false;
		},

		timer: function () {
			var min, sec;

			min = Math.floor((getTickCount() - me.gamestarttime) / 60000).toString();

			if (min <= 9) {
				min = "0" + min;
			}

			sec = (Math.floor((getTickCount() - me.gamestarttime) / 1000) % 60).toString();

			if (sec <= 9) {
				sec = "0" + sec;
			}

			return min + ":" + sec;
		},

		flush: function () {
			if (getUIFlag(0x0D)) {
				return;
			}

			while (this.textHooks.length) {
				this.textHooks.shift().hook.remove();
			}
		}
	},

	vector: {
		vectorHooks: [],
		currArea: 0,

		check: function () {
			if (me.area !== this.currArea) {
				this.flush();

				var i, exits, wp, poi;

				this.currArea = me.area;
				exits = getArea().exits;

				if (exits) {
					for (i = 0; i < exits.length; i += 1) {
						this.add(exits[i].x, exits[i].y, me.area === 46 && exits[i].target === getRoom().correcttomb ? 0x8F : 0x99);
					}
				}

				wp = this.getWP();

				if (wp) {
					this.add(wp.x, wp.y, 0xA8);
				}

				poi = this.getPOI();

				if (poi) {
					this.add(poi.x, poi.y, 0x7D);
				}
			} else {
				this.update();
			}
		},

		add: function (x, y, color) {
			this.vectorHooks.push(new Line(me.x, me.y, x, y, color, true));
		},

		update: function () {
			var i;

			for (i = 0; i < this.vectorHooks.length; i += 1) {
				this.vectorHooks[i].x = me.x;
				this.vectorHooks[i].y = me.y;
			}
		},

		flush: function () {
			while (this.vectorHooks.length) {
				this.vectorHooks.shift().remove();
			}

			this.currArea = 0;
		},

		getWP: function () {
			var i, presets,
				wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

			presets = getPresetUnits(me.area, 2);

			for (i = 0; i < presets.length; i += 1) {
				if (wpIDs.indexOf(presets[i].id) > -1) {
					return {
						x: presets[i].roomx * 5 + presets[i].x,
						y: presets[i].roomy * 5 + presets[i].y
					};
				}
			}

			return false;
		},

		getPOI: function () {
			var unit;

			switch (me.area) {
			case 4: // Stony Field
				unit = getPresetUnit(me.area, 1, 737);

				break;
			case 5: // Dark Wood
				unit = getPresetUnit(me.area, 2, 30);

				break;
			case 49: // Sewers 3
				unit = getPresetUnit(me.area, 2, 355);

				break;
			case 60: // Halls of the Dead 3
				unit = getPresetUnit(me.area, 2, 354);

				break;
			case 74: // Arcane Sanctuary
				unit = getPresetUnit(me.area, 2, 357);

				break;
			case 66: // Tal Rasha's Tombs
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 72:
				unit = getPresetUnit(me.area, 2, 152);

				break;
			case 78: // Flayer Jungle
				unit = getPresetUnit(me.area, 2, 252);

				break;
			case 102: // Durance of Hate 3
				unit = {
					x: 17588,
					y: 8069
				};

				break;
			case 105: // Plains of Despair
				unit = getPresetUnit(me.area, 1, 256);

				break;
			case 107: // River of Flame
				unit = getPresetUnit(me.area, 2, 376);

				break;
			case 108: // Chaos Sanctuary
				unit = getPresetUnit(me.area, 2, 255);

				break;
			case 111: // Frigid Highlands
			case 112: // Arreat Plateau
			case 117: // Frozen Tundra
				unit = getPresetUnit(me.area, 2, 60);

				break;
			case 124: // Halls of Vaught
				unit = getPresetUnit(me.area, 2, 462);

				break;
			}

			if (unit) {
				if (unit instanceof PresetUnit) {
					return {
						x: unit.roomx * 5 + unit.x,
						y: unit.roomy * 5 + unit.y
					};
				}

				return {
					x: unit.x,
					y: unit.y
				};
			}

			return false;
		}
	},

	update: function () {
		this.monsters.check();
		this.text.check();
		this.vector.check();
	},

	flush: function () {
		while (this.monsters.monsterHooks.length) {
			this.monsters.monsterHooks[0].hook[0].remove();
			this.monsters.monsterHooks[0].hook[1].remove();
			this.monsters.monsterHooks.shift();
		}

		this.text.flush();
		this.vector.flush();

		return true;
	}
};

function main() {
	print("ÿc9Map Thread Loaded");
	include("common/attack.js");

	var revealedAreas = [];

	this.revealArea = function (area) {
		var room = getRoom(area);

		delay(200);

		do {
			if (room instanceof Room && room.area === area) {
				room.reveal();
			}
		} while (room.getNext());
	};

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(100);
		}

		if (revealedAreas.indexOf(me.area) === -1) {
			this.revealArea(me.area);
			revealedAreas.push(me.area);
		}

		if (getUIFlag(0x0A)) {
			Hooks.update();
		} else {
			Hooks.flush();
		}

		delay(20);

		while (getUIFlag(0x09) || getUIFlag(0x0C) || getUIFlag(0x0D)) {
			Hooks.flush();
			delay(100);
		}
	}
}