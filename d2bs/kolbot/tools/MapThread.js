if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Hooks = {
	monsters: {
		hooks: [],
		enabled: true,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}

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
		},

		flush: function () {
			while (this.hooks.length) {
				this.hooks[0].hook[0].remove();
				this.hooks[0].hook[1].remove();
				this.hooks.shift();
			}
		}
	},

	text: {
		hooks: [],
		enabled: true,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}

			if (!this.getHook("monsterStatus")) {
				this.add("monsterStatus");
			}

			if (!this.getHook("vectorStatus")) {
				this.add("vectorStatus");
			}

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
			case "monsterStatus":
				this.hooks.push({
					name: "monsterStatus",
					hook: new Text("Num 7: Disable Monsters", 525, 515)
				});

				break;
			case "vectorStatus":
				this.hooks.push({
					name: "vectorStatus",
					hook: new Text("Num 8: Disable Vectors", 525, 525)
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
            if (getUIFlag(UIFlags.alt_show_items)) {
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
		enabled: true,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}

			if (me.area !== this.currArea) {
				this.flush();

				var i, exits, wp, poi;

				this.currArea = me.area;
				exits = getArea().exits;

				if (exits) {
					for (i = 0; i < exits.length; i += 1) {
                        this.add(exits[i].x, exits[i].y, me.area === Areas.Act2.Canyon_Of_The_Magi && exits[i].target === getRoom().correcttomb ? 0x69 : 0x99);
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
			if (Pather.wpAreas.indexOf(me.area) === -1) {
				return false;
			}

			var i, preset,
				wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

			for (i = 0; i < wpIDs.length; i += 1) {
                preset = getPresetUnit(me.area, UnitType.Object, wpIDs[i]);

				if (preset) {
					return {
						x: preset.roomx * 5 + preset.x,
						y: preset.roomy * 5 + preset.y
					};
				}
			}

			return false;
		},

		getPOI: function () {
			var unit, name;

			switch (me.area) {
                case Areas.Act1.Stony_Field: // Stony Field
                    unit = getPresetUnit(me.area, UnitType.NPC, SuperUniques.Rakanishu);
				name = "Cairn Stones";

				break;
                case Areas.Act1.Dark_Wood: // Dark Wood
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Inifuss_Tree);
				name = "Tree";

				break;
                case Areas.Act2.A2_Sewers_Level_3: // Sewers 3
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Horadric_Scroll_Chest);
				name = "Radament";

				break;
                case Areas.Act2.Halls_Of_The_Dead_Level_3: // Halls of the Dead 3
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Horadric_Cube_Chest);
				name = "Cube";

				break;
                case Areas.Act2.Arcane_Sanctuary: // Arcane Sanctuary
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal);
				name = "Summoner";

				break;
                case Areas.Act2.Maggot_Lair_Level_3: // Maggot Lair 3
                    unit = getPresetUnit(me.area, UnitType.NPC, SuperUniques.Coldworm_the_Burrower);
				name = "Fat Worm";

				break;
                case Areas.Act2.Tal_Rashas_Tomb_1: // Tal Rasha's Tombs
			case Areas.Act2.Tal_Rashas_Tomb_2:
			case Areas.Act2.Tal_Rashas_Tomb_3:
			case Areas.Act2.Tal_Rashas_Tomb_4:
			case Areas.Act2.Tal_Rashas_Tomb_5:
			case Areas.Act2.Tal_Rashas_Tomb_6:
            case Areas.Act2.Tal_Rashas_Tomb_7:
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Holder_For_Horadric_Staff);
				name = "Orifice";

				break;
            case Areas.Act3.Flayer_Jungle: // Flayer Jungle
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Gidbinn_Decoy);
				name = "Gidbinn";

				break;
            case Areas.Act3.Durance_Of_Hate_Level_3: // Durance of Hate 3
				unit = {
					x: 17588,
					y: 8069
				};
				name = "Mephisto";

				break;
            case Areas.Act4.Plains_Of_Despair: // Plains of Despair
                    unit = getPresetUnit(me.area, UnitType.NPC, UnitClassID.izual);
				name = "Izual";

				break;
            case Areas.Act4.River_Of_Flame: // River of Flame
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Forge_Hell);
				name = "Hephasto";

				break;
            case Areas.Act4.Chaos_Sanctuary: // Chaos Sanctuary
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Diablo_Start_Point);
				name = "Star";

				break;
            case Areas.Act5.Frigid_Highlands: // Frigid Highlands
            case Areas.Act5.Arreat_Plateau: // Arreat Plateau
            case Areas.Act5.Frozen_Tundra: // Frozen Tundra
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Permanent_Town_Portal);
				name = "Hell Entrance";

				break;
            case Areas.Act5.Halls_Of_Vaught: // Halls of Vaught
                    unit = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Nihlathak_Outside_Town);
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
        currArea: Areas.None,
		enabled: true,
        prevAreas: [Areas.None, Areas.None, Areas.Act1.Rogue_Encampment, Areas.Act1.Blood_Moor, Areas.Act1.Cold_Plains, Areas.Act1.Underground_Passage_Level_1, Areas.Act1.Dark_Wood,
            Areas.Act1.Black_Marsh, Areas.Act1.Blood_Moor, Areas.Act1.Cold_Plains, Areas.Act1.Stony_Field, Areas.Act1.Black_Marsh, Areas.Act1.Tamoe_Highland, Areas.Act1.Cave_Level_1,
            Areas.Act1.Underground_Passage_Level_1, Areas.Act1.Hole_Level_1, Areas.Act1.Pit_Level_1, Areas.Act1.Cold_Plains, Areas.Act1.Burial_Grounds, Areas.Act1.Burial_Grounds,
            Areas.Act1.Black_Marsh, Areas.Act1.Forgotten_Tower, Areas.Act1.Tower_Cellar_Level_1, Areas.Act1.Tower_Cellar_Level_2, Areas.Act1.Tower_Cellar_Level_3, Areas.Act1.Tower_Cellar_Level_4,
            Areas.Act1.Tamoe_Highland, Areas.Act1.Monastery_Gate, Areas.Act1.Outer_Cloister, Areas.Act1.Barracks, Areas.Act1.Jail_Level_1, Areas.Act1.Jail_Level_2, Areas.Act1.Jail_Level_3,
            Areas.Act1.Inner_Cloister, Areas.Act1.Cathedral, Areas.Act1.Catacombs_Level_1, Areas.Act1.Catacombs_Level_2, Areas.Act1.Catacombs_Level_3, Areas.Act1.Stony_Field,
            Areas.Act1.Rogue_Encampment, Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act2.Rocky_Waste, Areas.Act2.Dry_Hills, Areas.Act2.Far_Oasis, Areas.Act2.Lost_City,
            Areas.Act2.Arcane_Sanctuary, Areas.Act2.Lut_Gholein, Areas.Act2.A2_Sewers_Level_1, Areas.Act2.A2_Sewers_Level_2, Areas.Act2.Lut_Gholein, Areas.Act2.Harem_Level_1,
            Areas.Act2.Harem_Level_2, Areas.Act2.Palace_Cellar_Level_1, Areas.Act2.Palace_Cellar_Level_2, Areas.Act2.Rocky_Waste, Areas.Act2.Dry_Hills, Areas.Act2.Halls_Of_The_Dead_Level_1,
            Areas.Act2.Valley_Of_Snakes, Areas.Act2.Stony_Tomb_Level_1, Areas.Act2.Halls_Of_The_Dead_Level_2, Areas.Act2.Claw_Viper_Temple_Level_1, Areas.Act2.Far_Oasis,
            Areas.Act2.Maggot_Lair_Level_1, Areas.Act2.Maggot_Lair_Level_2, Areas.Act2.Lost_City, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi,
            Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act1.Rogue_Encampment,
            Areas.Act2.Palace_Cellar_Level_3, Areas.Act1.Rogue_Encampment, Areas.Act3.Kurast_Docktown, Areas.Act3.Spider_Forest, Areas.Act3.Spider_Forest, Areas.Act3.Flayer_Jungle,
            Areas.Act3.Lower_Kurast, Areas.Act3.Kurast_Bazaar, Areas.Act3.Upper_Kurast, Areas.Act3.Kurast_Causeway, Areas.Act3.Spider_Forest, Areas.Act3.Spider_Forest, Areas.Act3.Flayer_Jungle,
            Areas.Act3.Swampy_Pit_Level_1, Areas.Act3.Flayer_Jungle, Areas.Act3.Flayer_Dungeon_Level_1, Areas.Act3.Swampy_Pit_Level_2, Areas.Act3.Flayer_Dungeon_Level_2, Areas.Act3.Upper_Kurast,
            Areas.Act3.A3_Sewers_Level_1, Areas.Act3.Kurast_Bazaar, Areas.Act3.Kurast_Bazaar, Areas.Act3.Upper_Kurast, Areas.Act3.Upper_Kurast, Areas.Act3.Kurast_Causeway,
            Areas.Act3.Kurast_Causeway, Areas.Act3.Travincal, Areas.Act3.Durance_Of_Hate_Level_1, Areas.Act3.Durance_Of_Hate_Level_2, Areas.Act3.Durance_Of_Hate_Level_3, Areas.Act4.The_Pandemonium_Fortress,
            Areas.Act4.Outer_Steppes, Areas.Act4.Plains_Of_Despair, Areas.Act4.City_Of_The_Damned, Areas.Act4.River_Of_Flame, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath,
            Areas.Act5.Bloody_Foothills, Areas.Act5.Frigid_Highlands, Areas.Act5.Arreat_Plateau, Areas.Act5.Crystalized_Passage, Areas.Act5.Crystalized_Passage, Areas.Act5.Glacial_Trail,
            Areas.Act5.Glacial_Trail, Areas.Act5.Frozen_Tundra, Areas.Act5.Ancients_Way, Areas.Act5.Ancients_Way, Areas.Act5.Harrogath, Areas.Act5.Nihlathaks_Temple, Areas.Act5.Halls_Of_Anguish,
            Areas.Act5.Halls_Of_Pain, Areas.Act5.Frigid_Highlands, Areas.Act5.Arreat_Plateau, Areas.Act5.Frozen_Tundra, Areas.Act5.Arreat_Summit, Areas.Act5.The_Worldstone_Keep_Level_1,
            Areas.Act5.The_Worldstone_Keep_Level_2, Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction, Areas.Act5.Harrogath, Areas.Act5.Harrogath, Areas.Act5.Harrogath, Areas.Act5.Harrogath],

		event: function (keycode) {
			Hooks.tele.action = keycode;
		},

		check: function () {
			if (!this.enabled) {
				return;
			}

			var hook,
				obj = {
					type: false,
					dest: false
				};

			if (this.action) {
				switch (this.action) {
				case 96: // Numpad 0
					hook = this.getHook("Next Area");
					obj.type = "area";

					break;
				case 97: // Numpad 1
					hook = this.getHook("Previous Area");
					obj.type = "area";

					break;
				case 98: // Numpad 2
					hook = this.getHook("Waypoint");
					obj.type = "wp";

					break;
				case 99: // Numpad 3
					hook = this.getHook("POI");
					obj.type = "unit";

					break;
				case 100: // Numpad 4
					hook = this.getHook("Side Area");
					obj.type = "area";

					break;
				}

				if (hook) {
					obj.dest = hook.destination;

					scriptBroadcast(JSON.stringify(obj));
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
			var i, exits, wp, poi, nextCheck,
				nextAreas = [];

			// Specific area override
            nextAreas[7] = Areas.Act1.Monastery_Gate;
            nextAreas[76] = Areas.Act3.Flayer_Jungle;
            nextAreas[77] = Areas.Act3.Flayer_Jungle;
            nextAreas[113] = Areas.Act5.Glacial_Trail;
            nextAreas[115] = Areas.Act5.Frozen_Tundra;
            nextAreas[118] = Areas.Act5.Arreat_Summit;

            if (me.area === Areas.Act2.Canyon_Of_The_Magi) {
				nextAreas[46] = getRoom().correcttomb;
			}

			switch (me.area) {
                case Areas.Act1.Blood_Moor: // Blood Moor
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act1.Den_Of_Evil,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act1.Den_Of_Evil), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act2.Far_Oasis: // Far Oasis
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act2.Maggot_Lair_Level_1,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act2.Maggot_Lair_Level_1), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act3.Spider_Forest:
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act3.Spider_Cavern,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act3.Spider_Cavern), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act3.Flayer_Jungle:
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act3.Flayer_Dungeon_Level_1,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act3.Flayer_Dungeon_Level_1), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act3.Kurast_Bazaar:
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act3.Ruined_Temple,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act3.Ruined_Temple), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act3.Upper_Kurast:
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act3.A3_Sewers_Level_1,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act3.A3_Sewers_Level_1), 150, 525 - (this.hooks.length * 10))
				});

				break;
                case Areas.Act5.Crystalized_Passage:
				this.hooks.push({
					name: "Side Area",
                    destination: Areas.Act5.Frozen_River,
                    hook: new Text("Num 4: " + Pather.getAreaName(Areas.Act5.Frozen_River), 150, 525 - (this.hooks.length * 10))
				});

				break;
			}

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
							hook: new Text("Num 1: " + Pather.getAreaName(this.prevAreas[me.area]), 150, 525 - (this.hooks.length * 10))
						});

						break;
					}
				}

				// Check nextAreas first
				for (i = 0; i < exits.length; i += 1) {
					if (exits[i].target === nextAreas[me.area]) {
						this.hooks.push({
							name: "Next Area",
							destination: nextAreas[me.area],
							hook: new Text("Num 0: " + Pather.getAreaName(nextAreas[me.area]), 150, 525 - (this.hooks.length * 10))
						});

						nextCheck = true;

						break;
					}
				}

				// In case the area isn't in nextAreas array, use this.prevAreas array
				if (!nextCheck) {
					for (i = 0; i < exits.length; i += 1) {
						if (exits[i].target === this.prevAreas.indexOf(me.area)) {
							this.hooks.push({
								name: "Next Area",
								destination: this.prevAreas.indexOf(me.area),
								hook: new Text("Num 0: " + Pather.getAreaName(this.prevAreas.indexOf(me.area)), 150, 525 - (this.hooks.length * 10))
							});

							break;
						}
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
		this.monsters.flush();
		this.text.flush();
		this.vector.flush();
		this.tele.flush();

		return true;
	}
};

function main() {
	include("json2.js");
	include("common/attack.js");
	include("common/pather.js");
	load("tools/maphelper.js");
	print("ÿc9Map Thread Loaded");

	this.revealArea = function (area) {
		if (!this.revealedAreas) {
			this.revealedAreas = [];
		}

		if (this.revealedAreas.indexOf(area) === -1) {
			delay(500);
			revealLevel(true);
			this.revealedAreas.push(area);
		}
	};

	this.keyEvent = function (key) {
		switch (key) {
		case 103: // Numpad 7
			if (Hooks.monsters.enabled) {
				Hooks.monsters.enabled = false;
				Hooks.text.getHook("monsterStatus").hook.text = "Num 7: Enable Monsters";
			} else {
				Hooks.monsters.enabled = true;
				Hooks.text.getHook("monsterStatus").hook.text = "Num 7: Disable Monsters";
			}

			break;
		case 104: // Numpad 8
			if (Hooks.vector.enabled) {
				Hooks.vector.enabled = false;
				Hooks.text.getHook("vectorStatus").hook.text = "Num 8: Enable Monsters";
			} else {
				Hooks.vector.enabled = true;
				Hooks.text.getHook("vectorStatus").hook.text = "Num 8: Disable Monsters";
			}

			break;
		}
	};

	var i,
		hideFlags = [0x09, 0x0C, 0x0D, 0x01, 0x02, 0x0F, 0x18, 0x19, 0x21];

	addEventListener("keyup", this.keyEvent);

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(100);
		}

		this.revealArea(me.area);

        if (getUIFlag(UIFlags.Automap_is_on)) {
			Hooks.update();
		} else {
			Hooks.flush();
		}

		delay(20);

		for (i = 0; i < hideFlags.length; i += 1) {
			while (getUIFlag(hideFlags[i])) {
				Hooks.flush();
				delay(100);
			}
		}
	}
}