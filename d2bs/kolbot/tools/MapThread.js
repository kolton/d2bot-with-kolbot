var Hooks = {
	monsters: {
		hooks: [],

		check: function () {
			var i, unit;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (!copyUnit(this.hooks[i].unit).x) {
					this.hooks[i].hook[0].remove();
					this.hooks[i].hook[1].remove();
					this.hooks.splice(i, 1);

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
			this.hooks.push({
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

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].unit.gid === unit.gid) {
					return this.hooks[i].hook;
				}
			}

			return false;
		},

		remove: function (unit) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].unit.gid === unit.gid) {
					this.hooks[i].hook[0].remove();
					this.hooks[i].hook[1].remove();
					this.hooks.splice(i, 1);

					return true;
				}
			}

			return false;
		}
	},

	text: {
		hooks: [],

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
				this.hooks.push({
					name: "ping",
					hook: new Text("Ping: " + me.ping, 785, 56 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			case "time":
				this.hooks.push({
					name: "time",
					hook: new Text(this.timer(), 785, 72 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			case "ip":
				this.hooks.push({
					name: "ip",
					hook: new Text("IP: " + (me.gameserverip.length > 0 ? me.gameserverip.split(".")[3] : "0"), 785, 88 + 16 * (Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename)), 4, 1, 1)
				});

				break;
			}
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].name === name) {
					return this.hooks[i];
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

			while (this.hooks.length) {
				this.hooks.shift().hook.remove();
			}
		}
	},

	vector: {
		hooks: [],
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
			this.hooks.push(new Line(me.x, me.y, x, y, color, true));
		},

		update: function () {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				this.hooks[i].x = me.x;
				this.hooks[i].y = me.y;
			}
		},

		flush: function () {
			while (this.hooks.length) {
				this.hooks.shift().remove();
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
			var unit, name;

			switch (me.area) {
			case 4: // Stony Field
				unit = getPresetUnit(me.area, 1, 737);
				name = "Cairn Stones";

				break;
			case 5: // Dark Wood
				unit = getPresetUnit(me.area, 2, 30);
				name = "Tree";

				break;
			case 49: // Sewers 3
				unit = getPresetUnit(me.area, 2, 355);
				name = "Radament";

				break;
			case 60: // Halls of the Dead 3
				unit = getPresetUnit(me.area, 2, 354);
				name = "Cube";

				break;
			case 74: // Arcane Sanctuary
				unit = getPresetUnit(me.area, 2, 357);
				name = "Summoner";

				break;
			case 64: // Maggot Lair 3
				unit = getPresetUnit(me.area, 1, 749);
				name = "Fat Worm";

				break;
			case 66: // Tal Rasha's Tombs
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 72:
				unit = getPresetUnit(me.area, 2, 152);
				name = "Orifice";

				break;
			case 78: // Flayer Jungle
				unit = getPresetUnit(me.area, 2, 252);
				name = "Gidbinn";

				break;
			case 102: // Durance of Hate 3
				unit = {
					x: 17588,
					y: 8069
				};
				name = "Mephisto";

				break;
			case 105: // Plains of Despair
				unit = getPresetUnit(me.area, 1, 256);
				name = "Izual";

				break;
			case 107: // River of Flame
				unit = getPresetUnit(me.area, 2, 376);
				name = "Hephasto";

				break;
			case 108: // Chaos Sanctuary
				unit = getPresetUnit(me.area, 2, 255);
				name = "Star";

				break;
			case 111: // Frigid Highlands
			case 112: // Arreat Plateau
			case 117: // Frozen Tundra
				unit = getPresetUnit(me.area, 2, 60);
				name = "Hell Entrance";

				break;
			case 124: // Halls of Vaught
				unit = getPresetUnit(me.area, 2, 462);
				name = "Nihlathak";

				break;
			}

			if (unit) {
				if (unit instanceof PresetUnit) {
					return {
						x: unit.roomx * 5 + unit.x,
						y: unit.roomy * 5 + unit.y,
						name: name
					};
				}

				return {
					x: unit.x,
					y: unit.y,
					name: name
				};
			}

			return false;
		}
	},

	tele: {
		hooks: [],
		action: null,
		currArea: 0,
		prevAreas: [0, 0, 1, 2, 3, 10, 5, 6, 2, 3, 4, 6, 7, 9, 10, 11, 12, 3, 17, 17, 6, 20, 21, 22, 23, 24, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
					36, 4, 1, 1, 40, 41, 42, 43, 44, 74, 40, 47, 48, 40, 50, 51, 52, 53, 41, 42, 56, 45, 55, 57, 58, 43, 62, 63, 44, 46, 46, 46, 46, 46,
					46, 46, 1, 54, 1, 75, 76, 76, 78, 79, 80, 81, 82, 76, 76, 78, 86, 78, 88, 87, 89, 80, 92, 80, 80, 81, 81, 82, 82, 83, 100, 101, 102,
					103, 104, 105, 106, 107, 103, 109, 110, 111, 112, 113, 113, 115, 115, 117, 118, 118, 109, 121, 122, 123, 111, 112, 117, 120, 128, 129,
					130, 131, 109, 109, 109, 109],

		event: function (keycode) {
			Hooks.tele.action = keycode;
		},

		check: function () {
			if (this.action) {
				var hook;

				switch (this.action) {
				case 96: // Numpad 0
					hook = this.getHook("Next Area");

					break;
				case 97: // Numpad 1
					hook = this.getHook("Previous Area");

					break;
				case 98: // Numpad 2
					hook = this.getHook("Waypoint");

					break;
				case 99: // Numpad 3
					hook = this.getHook("POI");

					break;
				}

				if (hook) {
					scriptBroadcast(typeof hook.destination === "number" ? hook.destination.toString() : hook.destination.x + "," + hook.destination.y);
				}

				this.action = null;
			}

			if (me.area !== this.currArea) {
				this.flush();
				this.add(me.area);
				addEventListener("keyup", this.event);

				this.currArea = me.area;
			}
		},

		add: function (area) {
			var i, exits, wp, poi;

			poi = Hooks.vector.getPOI();

			if (poi) {
				this.hooks.push({
					name: "POI",
					destination: {x: poi.x, y: poi.y},
					hook: new Text("Num 3: " + poi.name, 150, 525 - (this.hooks.length * 10))
				});
			}

			wp = Hooks.vector.getWP();

			if (wp) {
				this.hooks.push({
					name: "Waypoint",
					destination: {x: wp.x, y: wp.y},
					hook: new Text("Num 2: WP", 150, 525 - (this.hooks.length * 10))
				});
			}

			exits = getArea(area).exits;

			if (exits) {
				for (i = 0; i < exits.length; i += 1) {
					if (exits[i].target === this.prevAreas[me.area]) {
						this.hooks.push({
							name: "Previous Area",
							destination: this.prevAreas[me.area],
							hook: new Text("Num 1: " + getArea(this.prevAreas[me.area]).name, 150, 525 - (this.hooks.length * 10))
						});
					}

					if (exits[i].target === this.prevAreas.indexOf(me.area)) {
						this.hooks.push({
							name: "Next Area",
							destination: this.prevAreas.indexOf(me.area),
							hook: new Text("Num 0: " + getArea(this.prevAreas.indexOf(me.area)).name, 150, 525 - (this.hooks.length * 10))
						});
					}
				}
			}
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].name === name) {
					return this.hooks[i];
				}
			}

			return false;
		},

		flush: function () {
			while (this.hooks.length) {
				this.hooks.shift().hook.remove();
			}

			removeEventListener("keyup", this.event);

			this.currArea = 0;
		}
	},

	update: function () {
		while (!me.gameReady) {
			delay(100);
		}

		this.monsters.check();
		this.text.check();
		this.vector.check();
		this.tele.check();
	},

	flush: function () {
		while (this.monsters.hooks.length) {
			this.monsters.hooks[0].hook[0].remove();
			this.monsters.hooks[0].hook[1].remove();
			this.monsters.hooks.shift();
		}

		this.text.flush();
		this.vector.flush();
		this.tele.flush();

		return true;
	}
};

function main() {
	include("common/attack.js");
	load("tools/maphelper.js");
	print("ÿc9Map Thread Loaded");

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(100);
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