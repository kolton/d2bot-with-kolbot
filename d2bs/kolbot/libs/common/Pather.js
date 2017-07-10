/**
*	@filename	Pather.js
*	@author		kolton
*	@desc		handle player movement
*/

// Perform certain actions after moving to each node
var NodeAction = {
	// Run all the functions within NodeAction (except for itself)
	go: function (arg) {
		var i;

		for (i in this) {
			if (this.hasOwnProperty(i) && typeof this[i] === "function" && i !== "go") {
				this[i](arg);
			}
		}
	},

	// Kill monsters while pathing
	killMonsters: function (arg) {
		var monList;

		if (Config.Countess.KillGhosts && [Areas.Act1.Tower_Cellar_Level_1, Areas.Act1.Tower_Cellar_Level_2, Areas.Act1.Tower_Cellar_Level_3, Areas.Act1.Tower_Cellar_Level_4, Areas.Act1.Tower_Cellar_Level_5].indexOf(me.area) > -1) {
			monList = Attack.getMob(MonsterClassID.wraith1.hcIdx, 0, 30);

			if (monList) {
				Attack.clearList(monList);
			}
		}

		if ((typeof Config.ClearPath === "number" || typeof Config.ClearPath === "object") && arg.clearPath === false) {
			switch (typeof Config.ClearPath) {
			case "number":
				Attack.clear(30, Config.ClearPath);

				break;
			case "object":
				if (!Config.ClearPath.hasOwnProperty("Areas") || Config.ClearPath.Areas.length === 0 || Config.ClearPath.Areas.indexOf(me.area) > -1) {
					Attack.clear(Config.ClearPath.Range, Config.ClearPath.Spectype);
				}

				break;
			}
		}

		if (arg.clearPath !== false) {
			Attack.clear(15, typeof arg.clearPath === "number" ? arg.clearPath : 0);
		}
	},

	// Open chests while pathing
	popChests: function () {
		if (!!Config.OpenChests) {
			Misc.openChests(20);
		}
	},

	// Scan shrines while pathing
	getShrines: function () {
		if (!!Config.ScanShrines && Config.ScanShrines.length > 0) {
			Misc.scanShrines();
		}
	}
};

var PathDebug = {
	hooks: [],
	enableHooks: false,

	drawPath: function (path) {
		if (!this.enableHooks) {
			return;
		}

		this.removeHooks();

		var i;

		if (path.length < 2) {
			return;
		}

		for (i = 0; i < path.length - 1; i += 1) {
			this.hooks.push(new Line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, 0x84, true));
		}
	},

	removeHooks: function () {
		var i;

		for (i = 0; i < this.hooks.length; i += 1) {
			this.hooks[i].remove();
		}

		this.hooks = [];
	},

	coordsInPath: function (path, x, y) {
		var i;

		for (i = 0; i < path.length; i += 1) {
			if (getDistance(x, y, path[i].x, path[i].y) < 5) {
				return true;
			}
		}

		return false;
	}
};

var Pather = {
	teleport: true,
	walkDistance: 10,
	teleDistance: 40,
	cancelFlags: [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x17, 0x19, 0x1A],
	wpAreas: [Areas.Act1.Rogue_Encampment, Areas.Act1.Cold_Plains, Areas.Act1.Stony_Field, Areas.Act1.Dark_Wood, Areas.Act1.Black_Marsh, Areas.Act1.Outer_Cloister, Areas.Act1.Jail_Level_1, Areas.Act1.Inner_Cloister, Areas.Act1.Catacombs_Level_2,
		Areas.Act2.Lut_Gholein, Areas.Act2.A2_Sewers_Level_2, Areas.Act2.Dry_Hills, Areas.Act2.Halls_Of_The_Dead_Level_2, Areas.Act2.Far_Oasis, Areas.Act2.Lost_City, Areas.Act2.Palace_Cellar_Level_1, Areas.Act2.Arcane_Sanctuary, Areas.Act2.Canyon_Of_The_Magi,
		Areas.Act3.Kurast_Docktown, Areas.Act3.Spider_Forest, Areas.Act3.Great_Marsh, Areas.Act3.Flayer_Jungle, Areas.Act3.Lower_Kurast, Areas.Act3.Kurast_Bazaar, Areas.Act3.Upper_Kurast, Areas.Act3.Travincal, Areas.Act3.Durance_Of_Hate_Level_2,
		Areas.Act4.The_Pandemonium_Fortress, Areas.Act4.City_Of_The_Damned, Areas.Act4.River_Of_Flame,
		Areas.Act5.Harrogath, Areas.Act5.Frigid_Highlands, Areas.Act5.Arreat_Plateau, Areas.Act5.Crystalized_Passage, Areas.Act5.Glacial_Trail, Areas.Act5.Halls_Of_Pain, Areas.Act5.Frozen_Tundra, Areas.Act5.Ancients_Way, Areas.Act5.The_Worldstone_Keep_Level_2],
	recursion: true,

	/*
		Pather.moveTo(x, y, retry, clearPath, pop);
		x - the x coord to move to
		y - the y coord to move to
		retry - number of attempts before aborting
		clearPath - kill monsters while moving
		pop - remove last node
	*/
	moveTo: function (x, y, retry, clearPath, pop) {
		if (me.dead) { // Abort if dead
			return false;
		}

		var i, path, adjustedNode, cleared,
			node = {x: x, y: y},
			fail = 0;

		for (i = 0; i < this.cancelFlags.length; i += 1) {
			if (getUIFlag(this.cancelFlags[i])) {
				me.cancel();
			}
		}

		if (getDistance(me, x, y) < 2) {
			return true;
		}

		if (x === undefined || y === undefined) {
			throw new Error("moveTo: Function must be called with at least 2 arguments.");
		}

		if (typeof x !== "number" || typeof y !== "number") {
			throw new Error("moveTo: Coords must be numbers");
		}

		if (retry === undefined) {
			retry = 3;
		}

		if (clearPath === undefined) {
			clearPath = false;
		}

		if (pop === undefined) {
			pop = false;
		}

		this.useTeleport = this.teleport && !me.getState(States.WOLF) && !me.getState(States.WOLF) && !me.inTown &&
			((me.classid === ClassID.Sorceress && me.getSkill(Skills.Sorceress.Teleport, 1)) || me.getStat(Stats.item_nonclassskill, Skills.Sorceress.Teleport));

		// Teleport without calling getPath if the spot is close enough
		if (this.useTeleport && getDistance(me, x, y) <= this.teleDistance) {
			//Misc.townCheck();

			return this.teleportTo(x, y);
		}

		// Walk without calling getPath if the spot is close enough
		if (!this.useTeleport && (getDistance(me, x, y) <= 5 || (getDistance(me, x, y) <= 25 && !CollMap.checkColl(me, {x: x, y: y}, 0x1)))) {
			return this.walkTo(x, y);
		}

		path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? ([Areas.Act2.Maggot_Lair_Level_1, Areas.Act2.Maggot_Lair_Level_2, Areas.Act2.Maggot_Lair_Level_3].indexOf(me.area) > -1 ? 30 : this.teleDistance) : this.walkDistance);

		if (!path) {
			throw new Error("moveTo: Failed to generate path.");
		}

		path.reverse();

		if (pop) {
			path.pop();
		}

		PathDebug.drawPath(path);

		if (this.useTeleport && Config.TeleSwitch) {
			Misc.teleSwitch();
		}

		while (path.length > 0) {
			if (me.dead) { // Abort if dead
				return false;
			}

			for (i = 0; i < this.cancelFlags.length; i += 1) {
				if (getUIFlag(this.cancelFlags[i])) {
					me.cancel();
				}
			}

			node = path.shift();

			/* Right now getPath's first node is our own position so it's not necessary to take it into account
				This will be removed if getPath changes
			*/
			if (getDistance(me, node) > 2) {
				// Make life in Maggot Lair easier
				if ([Areas.Act2.Maggot_Lair_Level_1, Areas.Act2.Maggot_Lair_Level_2, Areas.Act2.Maggot_Lair_Level_3].indexOf(me.area) > -1) {
					adjustedNode = this.getNearestWalkable(node.x, node.y, 15, 3, 0x1 | 0x4 | 0x800 | 0x1000);

					if (adjustedNode) {
						node.x = adjustedNode[0];
						node.y = adjustedNode[1];
					}
				}

				if (this.useTeleport ? this.teleportTo(node.x, node.y) : this.walkTo(node.x, node.y, (fail > 0 || me.inTown) ? 2 : 4)) {
					if (!me.inTown) {
						if (this.recursion) {
							this.recursion = false;

							NodeAction.go({clearPath: clearPath});

							if (getDistance(me, node.x, node.y) > 5) {
								this.moveTo(node.x, node.y);
							}

							this.recursion = true;
						}

						Misc.townCheck();
					}
				} else {
					if (fail > 0 && !this.useTeleport && !me.inTown) {
						// Don't go berserk on longer paths
						if (!cleared) {
							Attack.clear(5);

							cleared = true;
						}

						if (fail > 1 && me.getSkill(Skills.Barbarian.Leap_Attack, 1)) {
							Skill.cast(Skills.Barbarian.Leap_Attack, 0, node.x, node.y);
						}
					}

					// Reduce node distance in new path
					path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? rand(25, 35) : rand(10, 15));
					fail += 1;

					if (!path) {
						throw new Error("moveTo: Failed to generate path.");
					}

					path.reverse();
					PathDebug.drawPath(path);

					if (pop) {
						path.pop();
					}

					print("move retry " + fail);

					if (fail > 0 && fail >= retry) {
						break;
					}
				}
			}

			delay(5);
		}

		if (this.useTeleport && Config.TeleSwitch) {
			Precast.weaponSwitch(Misc.oldSwitch);
		}

		PathDebug.removeHooks();

		return getDistance(me, node.x, node.y) < 5;
	},

	/*
		Pather.teleportTo(x, y);
		x - the x coord to teleport to
		y - the y coord to teleport to
	*/
	teleportTo: function (x, y, maxRange) {
		var i, tick;

		if (maxRange === undefined) {
			maxRange = 5;
		}

MainLoop:
		for (i = 0; i < 3; i += 1) {
			if (Config.PacketCasting) {
				Skill.setSkill(Skills.Sorceress.Teleport, 0);
				Packet.castSkill(0, x, y);
			} else {
				Skill.cast(54, 0, x, y);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping * 2 + 200)) {
				if (getDistance(me.x, me.y, x, y) < maxRange) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	/*
		Pather.walkTo(x, y);
		x - the x coord to walk to
		y - the y coord to walk to
		minDist - minimal distance from x/y before returning true
	*/
	walkTo: function (x, y, minDist) {
		while (!me.gameReady) {
			delay(100);
		}

		if (minDist === undefined) {
			minDist = me.inTown ? 2 : 4;
		}

		var i, angle, angles, nTimer, whereToClick, tick,
			nFail = 0,
			attemptCount = 0;

		// Stamina handler and Charge
		if (!me.inTown && !me.dead) {
			if (me.runwalk === 1 && me.stamina / me.staminamax * 100 <= 20) {
				me.runwalk = 0;
			}

			if (me.runwalk === 0 && me.stamina / me.staminamax * 100 >= 50) {
				me.runwalk = 1;
			}

			if (Config.Charge && me.classid === ClassID.Paladin && me.mp >= 9 && getDistance(me.x, me.y, x, y) > 8 && Skill.setSkill(Skills.Paladin.Charge, 1)) {
				if (Config.Vigor) {
					Skill.setSkill(Skills.Paladin.Vigor, 0);
				}

				Misc.click(0, 1, x, y);

				while (me.mode !== PlayerModes.Neutral && me.mode !== PlayerModes.Town_Neutral && !me.dead) {
					delay(40);
				}
			}
		}

		if (me.inTown && me.runwalk === 0) {
			me.runwalk = 1;
		}

		while (getDistance(me.x, me.y, x, y) > minDist && !me.dead) {
			if (me.classid === ClassID.Paladin && Config.Vigor) {
				Skill.setSkill(Skills.Paladin.Vigor, 0);
			}

			if (this.openDoors(x, y) && getDistance(me.x, me.y, x, y) <= minDist) {
				return true;
			}

			Misc.click(0, 0, x, y);

			attemptCount += 1;
			nTimer = getTickCount();

ModeLoop:
			while (me.mode !== PlayerModes.Walk && me.mode !== PlayerModes.Run && me.mode !== PlayerModes.Town_Walk) {
				if (me.dead) {
					return false;
				}

				if ((getTickCount() - nTimer) > 500) {
					nFail += 1;

					if (nFail >= 3) {
						return false;
					}

					angle = Math.atan2(me.y - y, me.x - x);
					angles = [Math.PI / 2, -Math.PI / 2];

					for (i = 0; i < angles.length; i += 1) {
						// TODO: might need rework into getnearestwalkable
						whereToClick = {
							x: Math.round(Math.cos(angle + angles[i]) * 5 + me.x),
							y: Math.round(Math.sin(angle + angles[i]) * 5 + me.y)
						};

						if (Attack.validSpot(whereToClick.x, whereToClick.y)) {
							Misc.click(0, 0, whereToClick.x, whereToClick.y);

							tick = getTickCount();

							while (getDistance(me, whereToClick) > 2 && getTickCount() - tick < 1000) {
								delay(40);
							}

							break;
						}
					}

					break ModeLoop;
				}

				delay(10);
			}

			// Wait until we're done walking - idle or dead
			while (getDistance(me.x, me.y, x, y) > minDist && me.mode !== PlayerModes.Neutral && me.mode !== PlayerModes.Town_Neutral && !me.dead) {
				delay(10);
			}

			if (attemptCount >= 3) {
				return false;
			}
		}

		return !me.dead && getDistance(me.x, me.y, x, y) <= minDist;
	},

	/*
		Pather.openDoors(x, y);
		x - the x coord of the node close to the door
		y - the y coord of the node close to the door
	*/
	openDoors: function (x, y) {
		if (me.inTown) {
			return false;
		}

		// Regular doors
		var i, tick,
			door = getUnit(UnitType.Object, "door", ObjectModes.Neutral);

		if (door) {
			do {
				if ((getDistance(door, x, y) < 4 && getDistance(me, door) < 9) || getDistance(me, door) < 4) {
					for (i = 0; i < 3; i += 1) {
						Misc.click(0, 0, door);
						//door.interact();

						tick = getTickCount();

						while (getTickCount() - tick < 1000) {
							if (door.mode === ObjectModes.Opened) {
								me.overhead("Opened a door!");

								return true;
							}

							delay(10);
						}
					}
				}
			} while (door.getNext());
		}

		// DO: Monsta doors (Barricaded)

		return false;
	},

	/*
		Pather.moveToUnit(unit, offX, offY, clearPath, pop);
		unit - a valid Unit or PresetUnit object
		offX - offset from unit's x coord
		offY - offset from unit's x coord
		clearPath - kill monsters while moving
		pop - remove last node
	*/
	moveToUnit: function (unit, offX, offY, clearPath, pop) {
		this.useTeleport = this.teleport && !me.getState(States.WOLF) && !me.getState(States.BEAR) && !me.inTown &&
			((me.classid === ClassID.Sorceress && me.getSkill(Skills.Sorceress.Teleport, 1)) || me.getStat(Stats.item_nonclassskill, Skills.Sorceress.Teleport));

		if (offX === undefined) {
			offX = 0;
		}

		if (offY === undefined) {
			offY = 0;
		}

		if (clearPath === undefined) {
			clearPath = false;
		}

		if (pop === undefined) {
			pop = false;
		}

		if (!unit || !unit.hasOwnProperty("x") || !unit.hasOwnProperty("y")) {
			throw new Error("moveToUnit: Invalid unit.");
		}

		if (unit instanceof PresetUnit) {
			return this.moveTo(unit.roomx * 5 + unit.x + offX, unit.roomy * 5 + unit.y + offY, 3, clearPath);
		}

		if (!this.useTeleport) {
			// The unit will most likely be moving so call the first walk with 'pop' parameter
			this.moveTo(unit.x + offX, unit.y + offY, 0, clearPath, true);
		}

		return this.moveTo(unit.x + offX, unit.y + offY, this.useTeleport && unit.type && unit.type === UnitType.NPC ? 3 : 0, clearPath, pop);
	},

	/*
		Pather.moveToPreset(area, unitType, unitId, offX, offY, clearPath, pop);
		area - area of the preset unit
		unitType - type of the preset unit
		unitId - preset unit id
		offX - offset from unit's x coord
		offY - offset from unit's x coord
		clearPath - kill monsters while moving
		pop - remove last node
	*/
	moveToPreset: function (area, unitType, unitId, offX, offY, clearPath, pop) {
		if (area === undefined || unitType === undefined || unitId === undefined) {
			throw new Error("moveToPreset: Invalid parameters.");
		}

		if (offX === undefined) {
			offX = 0;
		}

		if (offY === undefined) {
			offY = 0;
		}

		if (clearPath === undefined) {
			clearPath = false;
		}

		if (pop === undefined) {
			pop = false;
		}

		var presetUnit = getPresetUnit(area, unitType, unitId);

		if (!presetUnit) {
			throw new Error("moveToPreset: Couldn't find preset unit - id " + unitId);
		}

		return this.moveTo(presetUnit.roomx * 5 + presetUnit.x + offX, presetUnit.roomy * 5 + presetUnit.y + offY, 3, clearPath, pop);
	},

	/*
		Pather.moveToExit(targetArea, use, clearPath);
		targetArea - area id or array of area ids to move to
		use - enter target area or last area in the array
		clearPath - kill monsters while moving
	*/
	moveToExit: function (targetArea, use, clearPath) {
		var i, j, area, exits, targetRoom, dest, currExit,
			areas = [];

		if (targetArea instanceof Array) {
			areas = targetArea;
		} else {
			areas.push(targetArea);
		}

		for (i = 0; i < areas.length; i += 1) {
			area = getArea();

			if (!area) {
				throw new Error("moveToExit: error in getArea()");
			}

			exits = area.exits;

			if (!exits || !exits.length) {
				return false;
			}

			for (j = 0; j < exits.length; j += 1) {
				currExit = {
					x: exits[j].x,
					y: exits[j].y,
					type: exits[j].type,
					target: exits[j].target,
					tileid: exits[j].tileid
				};

				if (currExit.target === areas[i]) {
					dest = this.getNearestWalkable(currExit.x, currExit.y, 5, 1);

					if (!dest) {
						return false;
					}

					if (!this.moveTo(dest[0], dest[1], 3, clearPath)) {
						return false;
					}

					/* i < areas.length - 1 is for crossing multiple areas.
						In that case we must use the exit before the last area.
					*/
					if (use || i < areas.length - 1) {
						switch (currExit.type) {
						case 1: // walk through
							targetRoom = this.getNearestRoom(areas[i]);

							if (targetRoom) {
								this.moveTo(targetRoom[0], targetRoom[1]);
							} else {
								// might need adjustments
								return false;
							}

							break;
						case 2: // stairs
							if (!this.useUnit(5, currExit.tileid, areas[i])) {
								return false;
							}

							break;
						}
					}

					break;
				}
			}
		}

		if (use) {
			return typeof targetArea === "object" ? me.area === targetArea[targetArea.length - 1] : me.area === targetArea;
		}

		return true;
	},

	/*
		Pather.getNearestRoom(area);
		area - the id of area to search for the room nearest to the player character
	*/
	getNearestRoom: function (area) {
		var i, x, y, dist, room,
			minDist = 10000;

		for (i = 0; i < 5; i += 1) {
			room = getRoom(area);

			if (room) {
				break;
			}

			delay(200);
		}

		if (!room) {
			return false;
		}

		do {
			dist = getDistance(me, room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2);

			if (dist < minDist) {
				x = room.x * 5 + room.xsize / 2;
				y = room.y * 5 + room.ysize / 2;
				minDist = dist;
			}
		} while (room.getNext());

		room = getRoom(area, x, y);

		if (room) {
			CollMap.addRoom(room);

			return this.getNearestWalkable(x, y, 20, 4);
		}

		return [x, y];
	},

	/*
		Pather.useUnit(type, id, targetArea);
		type - type of the unit to use
		id - id of the unit to use
		targetArea - area id of where the unit leads to
	*/
	useUnit: function (type, id, targetArea) {
		var i, tick, unit,
			preArea = me.area;

		for (i = 0; i < 5; i += 1) {
			unit = getUnit(type, id);

			if (unit) {
				break;
			}

			delay(200);
		}

		if (!unit) {
			throw new Error("useUnit: Unit not found. ID: " + id);
		}

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) > 5) {
				this.moveToUnit(unit);
			}

			delay(300);
			sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);

			tick = getTickCount();

			while (getTickCount() - tick < 3000) {
				if ((!targetArea && me.area !== preArea) || me.area === targetArea) {
					delay(100);

					return true;
				}

				delay(10);
			}

			this.moveTo(me.x + 3 * rand(-1, 1), me.y + 3 * rand(-1, 1));
		}

		return targetArea ? me.area === targetArea : me.area !== preArea;
	},

	/*
		Pather.moveTo(targetArea, check);
		targetArea - id of the area to enter
		check - force the waypoint menu
	*/
	useWaypoint: function useWaypoint(targetArea, check) {
		switch (targetArea) {
		case undefined:
			throw new Error("useWaypoint: Invalid targetArea parameter: " + targetArea);
		case null:
		case "random":
			check = true;

			break;
		default:
			if (typeof targetArea !== "number") {
				throw new Error("useWaypoint: Invalid targetArea parameter");
			}

			if (this.wpAreas.indexOf(targetArea) < 0) {
				throw new Error("useWaypoint: Invalid area");
			}

			break;
		}

		var i, tick, wp;

		for (i = 0; i < 12; i += 1) {
			if (me.area === targetArea || me.dead) {
				break;
			}

			if (me.inTown) {
				Town.move("waypoint");
			}

			wp = getUnit(UnitType.Object, "waypoint");

			if (wp && wp.area === me.area) {
				if (!me.inTown && getDistance(me, wp) > 7) {
					this.moveToUnit(wp);
				}

				if (check || Config.WaypointMenu) {
					if (getDistance(me, wp) > 5) {
						this.moveToUnit(wp);
					}

					Misc.click(0, 0, wp);

					tick = getTickCount();

					while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
						if (getUIFlag(UIFlags.waypoint)) { // Waypoint screen is open
							delay(500);

							switch (targetArea) {
							case "random":
								while (true) {
									targetArea = this.wpAreas[rand(0, this.wpAreas.length - 1)];

									// get a valid wp, avoid towns
									if ([Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act3.Kurast_Docktown, Areas.Act4.The_Pandemonium_Fortress, Areas.Act5.Harrogath].indexOf(targetArea) === -1 && getWaypoint(this.wpAreas.indexOf(targetArea))) {
										break;
									}

									delay(5);
								}

								break;
							case null:
								me.cancel();

								return true;
							}

							if (!getWaypoint(this.wpAreas.indexOf(targetArea))) {
								me.cancel();
								me.overhead("Trying to get the waypoint");

								if (this.getWP(targetArea)) {
									return true;
								}

								throw new Error("Pather.useWaypoint: Failed to go to waypoint");
							}

							break;
						}

						delay(10);
					}

					if (!getUIFlag(UIFlags.waypoint)) {
						print("waypoint retry " + (i + 1));
						this.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
						Packet.flash(me.gid);

						continue;
					}
				}

				if (!check || getUIFlag(UIFlags.waypoint)) {
					delay(200);
					wp.interact(targetArea);

					tick = getTickCount();

					while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
						if (me.area === targetArea) {
							delay(100);

							return true;
						}

						delay(10);
					}

					me.cancel(); // In case lag causes the wp menu to stay open
				}

				Packet.flash(me.gid);

				if (i > 1) { // Activate check if we fail direct interact twice
					check = true;
				}
			} else {
				Packet.flash(me.gid);
			}

			delay(200 + me.ping);
		}

		if (me.area === targetArea) {
			return true;
		}

		throw new Error("useWaypoint: Failed to use waypoint");
	},

	/*
		Pather.makePortal(use);
		use - use the portal that was made
	*/
	makePortal: function (use) {
		if (me.inTown) {
			return true;
		}

		var i, portal, oldPortal, oldGid, tick, tpTome;

		for (i = 0; i < 5; i += 1) {
			if (me.dead) {
				break;
			}

			tpTome = me.findItem("tbk", ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory);

			if (!tpTome) {
				throw new Error("makePortal: No TP tomes.");
			}

			if (!tpTome.getStat(Stats.quantity)) {
				throw new Error("makePortal: No scrolls.");
			}

			oldPortal = getUnit(UnitType.Object, "portal");

			if (oldPortal) {
				do {
					if (oldPortal.getParent() === me.name) {
						oldGid = oldPortal.gid;

						break;
					}
				} while (oldPortal.getNext());
			}

			tpTome.interact();

			tick = getTickCount();

MainLoop:
			while (getTickCount() - tick < Math.max(500 + i * 100, me.ping * 2 + 100)) {
				portal = getUnit(UnitType.Object, "portal");

				if (portal) {
					do {
						if (portal.getParent() === me.name && portal.gid !== oldGid) {
							if (use) {
								if (this.usePortal(null, null, copyUnit(portal))) {
									return true;
								}

								break MainLoop; // don't spam usePortal
							} else {
								return copyUnit(portal);
							}
						}
					} while (portal.getNext());
				}

				delay(10);
			}

			Packet.flash(me.gid);
			delay(200 + me.ping);
		}

		return false;
	},

	/*
		Pather.usePortal(targetArea, owner, unit);
		targetArea - id of the area the portal leads to
		owner - name of the portal's owner
		unit - use existing portal unit
	*/
	usePortal: function (targetArea, owner, unit) {
		if (targetArea && me.area === targetArea) {
			return true;
		}

		me.cancel();

		var i, tick, portal, useTK,
			preArea = me.area;

		for (i = 0; i < 10; i += 1) {
			if (me.dead) {
				break;
			}

			if (i > 0 && owner && me.inTown) {
				Town.move("portalspot");
			}

			portal = unit ? copyUnit(unit) : this.getPortal(targetArea, owner);

			if (portal) {
				if (i === 0) {
					useTK = me.classid === ClassID.Sorceress && me.getSkill(Skills.Sorceress.Telekinesis, 1) && me.inTown && portal.getParent();
				}

				if (portal.area === me.area) {
					if (useTK) {
						if (getDistance(me, portal) > 13) {
							Attack.getIntoPosition(portal, 13, 0x4);
						}

						Skill.cast(Skills.Sorceress.Telekinesis, 0, portal);
					} else {
						if (getDistance(me, portal) > 5) {
							this.moveToUnit(portal);
						}

						if (i < 2) {
							sendPacket(1, 0x13, 4, 0x2, 4, portal.gid);
						} else {
							Misc.click(0, 0, portal);
						}
					}
				}

				if (portal.classid === UniqueObjectIds.Arcane_Portal && portal.mode !== ObjectModes.Opened) { // Portal to/from Arcane
					Misc.click(0, 0, portal);

					tick = getTickCount();

					while (getTickCount() - tick < 2000) {
						if (portal.mode === ObjectModes.Opened || me.area === Areas.Act2.Arcane_Sanctuary) {
							break;
						}

						delay(10);
					}
				}

				tick = getTickCount();

				while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
					if (me.area !== preArea) {
						delay(100);

						return true;
					}

					delay(10);
				}

				if (i > 1) {
					Packet.flash(me.gid);

					useTK = false;
				}
			} else {
				Packet.flash(me.gid);
			}

			delay(200 + me.ping);
		}

		return targetArea ? me.area === targetArea : me.area !== preArea;
	},

	/*
		Pather.getPortal(targetArea, owner, unit);
		targetArea - id of the area the portal leads to
		owner - name of the portal's owner
	*/
	getPortal: function (targetArea, owner) {
		var portal = getUnit(UnitType.Object, "portal");

		if (portal) {
			do {
				if (typeof targetArea !== "number" || portal.objtype === targetArea) {
					switch (owner) {
					case undefined: // Pather.usePortal(area) - red portal
						if (!portal.getParent()) {
							return copyUnit(portal);
						}

						break;
					case null: // Pather.usePortal(area, null) - any blue portal leading to area
						if (portal.getParent() === me.name || Misc.inMyParty(portal.getParent())) {
							return copyUnit(portal);
						}

						break;
					default: // Pather.usePortal(null, owner) - any blue portal belonging to owner OR Pather.usePortal(area, owner) - blue portal matching area and owner
						if (portal.getParent() === owner && (owner === me.name || Misc.inMyParty(owner))) {
							return copyUnit(portal);
						}

						break;
					}
				}
			} while (portal.getNext());
		}

		return false;
	},

	/*
		Pather.moveTo(x, y, range, step, coll);
		x - the starting x coord
		y - the starting y coord
		range - maximum allowed range from the starting coords
		step - distance between each checked dot on the grid
		coll - collision flag to avoid
	*/
	getNearestWalkable: function (x, y, range, step, coll, size) {
		if (!step) {
			step = 1;
		}

		if (coll === undefined) {
			coll = 0x1;
		}

		var i, j,
			distance = 1,
			result = false;

		// Check if the original spot is valid
		if (this.checkSpot(x, y, coll, false, size)) {
			result = [x, y];
		}

MainLoop:
		while (!result && distance < range) {
			for (i = -distance; i <= distance; i += 1) {
				for (j = -distance; j <= distance; j += 1) {
					// Check outer layer only (skip previously checked)
					if (Math.abs(i) >= Math.abs(distance) || Math.abs(j) >= Math.abs(distance)) {
						if (this.checkSpot(x + i, y + j, coll, false, size)) {
							result = [x + i, y + j];

							break MainLoop;
						}
					}
				}
			}

			distance += step;
		}

		CollMap.reset();

		return result;
	},

	/*
		Pather.moveTo(x, y, coll, cacheOnly);
		x - the x coord to check
		y - the y coord to check
		coll - collision flag to search for
		cacheOnly - use only cached room data
	*/
	checkSpot: function (x, y, coll, cacheOnly, size) {
		var dx, dy, value;

		if (coll === undefined) {
			coll = 0x1;
		}

		if (!size) {
			size = 1;
		}

		for (dx = -size; dx <= size; dx += 1) {
			for (dy = -size; dy <= size; dy += 1) {
				if (Math.abs(dx) !== Math.abs(dy)) {
					value = CollMap.getColl(x + dx, y + dy, cacheOnly);

					if (value & coll) {
						return false;
					}
				}
			}
		}

		return true;
	},

	/*
		Pather.accessToAct(act);
		act - the act number to check for access
	*/
	accessToAct: function (act) {
		switch (act) {
		// Act 1 is always accessible
		case 1:
			return true;
		// For the other acts, check the "Able to go to Act *" quests
		case 2:
			return me.getQuest(Quests.Act1.Able_to_go_to_Act_II, 0) === 1;
		case 3:
			return me.getQuest(Quests.Act2.Able_to_go_to_Act_III, 0) === 1;
		case 4:
			return me.getQuest(Quests.Act3.Able_to_go_to_Act_IV, 0) === 1;
		case 5:
			return me.getQuest(Quests.Act4.Able_to_go_to_Act_V, 0) === 1;
		default:
			return false;
		}
	},

	/*
		Pather.getWP(area);
		area - the id of area to get the waypoint in
		clearPath - clear path
	*/
	getWP: function (area, clearPath) {
		var i, j, wp, preset,
			wpIDs = [UniqueObjectIds.Waypoint_Portal, UniqueObjectIds.Waypointi_Inner_Hell, UniqueObjectIds.Waypoint, UniqueObjectIds.WildernessWaypoint, UniqueObjectIds.Act3Waypoint_Town, UniqueObjectIds.Waypointh,
				UniqueObjectIds.Waypoint_Celler, UniqueObjectIds.SewerWaypoint, UniqueObjectIds.TravincalWaypoint, UniqueObjectIds.PandamoniaWaypoint, UniqueObjectIds.VallyWaypoint, UniqueObjectIds.Waypoint2,
				UniqueObjectIds.BaalWaypoint, UniqueObjectIds.WildernessWaypoint2, UniqueObjectIds.IcecaveWaypoint, UniqueObjectIds.TempleWaypoint];

		if (area !== me.area) {
			this.journeyTo(area);
		}

		for (i = 0; i < wpIDs.length; i += 1) {
			preset = getPresetUnit(area, UnitType.Object, wpIDs[i]);

			if (preset) {
				this.moveToUnit(preset, 0, 0, clearPath);

				wp = getUnit(UnitType.Object, "waypoint");

				if (wp) {
					for (j = 0; j < 10; j += 1) {
						Misc.click(0, 0, wp);
						//wp.interact();

						if (getUIFlag(UIFlags.waypoint)) {
							delay(500);
							me.cancel();

							return true;
						}

						delay(500);
					}
				}
			}
		}

		return false;
	},

	/*
		Pather.journeyTo(area);
		area - the id of area to move to
	*/
	journeyTo: function (area) {
		var i, special, unit, tick, target;

		target = this.plotCourse(area, me.area);

		print(target.course);

		if (target.useWP) {
			Town.goToTown();
		}

		// handle variable flayer jungle entrances
		if (target.course.indexOf(Areas.Act3.Flayer_Jungle) > -1) {
			Town.goToTown(3); // without initiated act, getArea().exits will crash

			special = getArea(Areas.Act3.Flayer_Jungle);

			if (special) {
				special = special.exits;

				for (i = 0; i < special.length; i += 1) {
					if (special[i].target === Areas.Act3.Great_Marsh) {
						target.course.splice(target.course.indexOf(Areas.Act3.Flayer_Jungle), 0, Areas.Act3.Great_Marsh); // add great marsh if needed

						break;
					}
				}
			}
		}

		while (target.course.length) {
			if (!me.inTown) {
				Precast.doPrecast(false);
			}

			if (this.wpAreas.indexOf(me.area) > -1 && !getWaypoint(this.wpAreas.indexOf(me.area))) {
				this.getWP(me.area);
			}

			if (me.inTown && this.wpAreas.indexOf(target.course[0]) > -1 && getWaypoint(this.wpAreas.indexOf(target.course[0]))) {
				this.useWaypoint(target.course[0], !this.plotCourse_openedWpMenu);
				Precast.doPrecast(false);
			} else if (me.area === Areas.Act5.Harrogath && target.course[0] === Areas.Act5.Bloody_Foothills) { // Harrogath -> Bloody Foothills
				this.moveTo(5026, 5095);

				unit = getUnit(UnitType.Object, UniqueObjectIds.Town_Main_Gate); // Gate

				if (unit) {
					for (i = 0; i < 3; i += 1) {
						Misc.click(0, 0, unit);
						//unit.interact();

						tick = getTickCount();

						while (getTickCount() - tick < 3000) {
							if (unit.mode === 2) {
								delay(1000);

								break;
							}

							delay(10);
						}
					}
				}

				this.moveToExit(target.course[0], true);
			} else if (me.area === Areas.Act1.Stony_Field && target.course[0] === Areas.Act1.Tristram) { // Stony Field -> Tristram
				this.moveToPreset(me.area, UnitType.Monster_or_NPC, SuperUniques.Rakanishu, 0, 0, false, true);

				for (i = 0; i < 5; i += 1) {
					if (this.usePortal(Areas.Act1.Tristram)) {
						break;
					}

					delay(1000);
				}
			} else if (me.area === Areas.Act2.Lut_Gholein && target.course[0] === Areas.Act2.A2_Sewers_Level_1) { // Lut Gholein -> Sewers Level 1 (use Trapdoor)
				this.moveToPreset(me.area, UnitType.Warp, UniqueObjectIds.StoneGamma); // 19
				this.useUnit(UnitType.Warp, UniqueObjectIds.StoneGamma, Areas.Act2.A2_Sewers_Level_1);
			} else if (me.area === Areas.Act2.Arcane_Sanctuary && target.course[0] === Areas.Act2.Canyon_Of_The_Magi) { // Arcane Sanctuary -> Canyon of the Magi
				this.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal);

				for (i = 0; i < 5; i += 1) {
					unit = getUnit(UnitType.Object, UniqueObjectIds.Horazons_Journal);

					Misc.click(0, 0, unit);
					delay(1000);
					me.cancel();

					if (this.usePortal(Areas.Act2.Canyon_Of_The_Magi)) {
						break;
					}
				}
			} else if (me.area === Areas.Act2.Palace_Cellar_Level_3 && target.course[0] === Areas.Act2.Arcane_Sanctuary) { // Palace -> Arcane
				this.moveTo(10073, 8670);
				this.usePortal(null);
			} else if (me.area === Areas.Act5.Harrogath && target.course[0] === Areas.Act5.Nihlathaks_Temple) { // Harrogath -> Nihlathak's Temple
				Town.move("anya");
				this.usePortal(Areas.Act5.Nihlathaks_Temple);
			} else if (me.area === Areas.Act5.Frigid_Highlands && target.course[0] ===  Areas.Act5.Abaddon) { // Abaddon
				this.moveToPreset(Areas.Act5.Frigid_Highlands, UnitType.Object, 60);
				this.usePortal(Areas.Act5.Abaddon);
			} else if (me.area === Areas.Act5.Arreat_Plateau && target.course[0] === Areas.Act5.Pit_Of_Acheron) { // Pits of Archeon
				this.moveToPreset(Areas.Act5.Arreat_Plateau, UnitType.Object, 60);
				this.usePortal(Areas.Act5.Pit_Of_Acheron);
			} else if (me.area === Areas.Act5.Frozen_Tundra && target.course[0] === Areas.Act5.Infernal_Pit) { // Infernal Pit
				this.moveToPreset(Areas.Act5.Frozen_Tundra, UnitType.Object, 60);
				this.usePortal(Areas.Act5.Infernal_Pit);
			} else {
				this.moveToExit(target.course[0], true);
			}

			target.course.shift();
		}

		return me.area === area;
	},

	plotCourse_openedWpMenu: false,

	/*
		Pather.plotCourse(dest, src);
		dest - destination area id
		src - starting area id
	*/
	plotCourse: function (dest, src) {
		var node, prevArea,
			useWP = false,
			arr = [],
			previousAreas = [Areas.None, Areas.None, Areas.Act1.Rogue_Encampment, Areas.Act1.Blood_Moor, Areas.Act1.Cold_Plains, Areas.Act1.Underground_Passage_Level_1, Areas.Act1.Dark_Wood,
				Areas.Act1.Black_Marsh, Areas.Act1.Blood_Moor, Areas.Act1.Cold_Plains, Areas.Act1.Stony_Field, Areas.Act1.Black_Marsh, Areas.Act1.Tamoe_Highland, Areas.Act1.Cave_Level_1,
				Areas.Act1.Underground_Passage_Level_1, Areas.Act1.Hole_Level_1, Areas.Act1.Pit_Level_1, Areas.Act1.Cold_Plains, Areas.Act1.Burial_Grounds, Areas.Act1.Burial_Grounds,
				Areas.Act1.Black_Marsh, Areas.Act1.Forgotten_Tower, Areas.Act1.Tower_Cellar_Level_1, Areas.Act1.Tower_Cellar_Level_2, Areas.Act1.Tower_Cellar_Level_3,
				Areas.Act1.Tower_Cellar_Level_4, Areas.Act1.Tamoe_Highland, Areas.Act1.Monastery_Gate, Areas.Act1.Outer_Cloister, Areas.Act1.Barracks, Areas.Act1.Jail_Level_1,
				Areas.Act1.Jail_Level_2, Areas.Act1.Jail_Level_3, Areas.Act1.Inner_Cloister, Areas.Act1.Cathedral, Areas.Act1.Catacombs_Level_1, Areas.Act1.Catacombs_Level_2,
				Areas.Act1.Catacombs_Level_3, Areas.Act1.Stony_Field, Areas.Act1.Rogue_Encampment, Areas.Act1.Rogue_Encampment, Areas.Act2.Lut_Gholein, Areas.Act2.Rocky_Waste,
				Areas.Act2.Dry_Hills, Areas.Act2.Far_Oasis, Areas.Act2.Lost_City, Areas.Act2.Arcane_Sanctuary, Areas.Act2.Lut_Gholein, Areas.Act2.A2_Sewers_Level_1, Areas.Act2.A2_Sewers_Level_2,
				Areas.Act2.Lut_Gholein, Areas.Act2.Harem_Level_1, Areas.Act2.Harem_Level_2, Areas.Act2.Palace_Cellar_Level_1, Areas.Act2.Palace_Cellar_Level_2, Areas.Act2.Rocky_Waste,
				Areas.Act2.Dry_Hills, Areas.Act2.Halls_Of_The_Dead_Level_1, Areas.Act2.Valley_Of_Snakes, Areas.Act2.Stony_Tomb_Level_1, Areas.Act2.Halls_Of_The_Dead_Level_2,
				Areas.Act2.Claw_Viper_Temple_Level_1, Areas.Act2.Far_Oasis, Areas.Act2.Maggot_Lair_Level_1, Areas.Act2.Maggot_Lair_Level_2, Areas.Act2.Lost_City, Areas.Act2.Canyon_Of_The_Magi,
				Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi, Areas.Act2.Canyon_Of_The_Magi,
				Areas.Act2.Canyon_Of_The_Magi, Areas.Act1.Rogue_Encampment, Areas.Act2.Palace_Cellar_Level_3, Areas.Act1.Rogue_Encampment, Areas.Act3.Kurast_Docktown, Areas.Act3.Spider_Forest,
				Areas.Act3.Spider_Forest, Areas.Act3.Flayer_Jungle, Areas.Act3.Lower_Kurast, Areas.Act3.Kurast_Bazaar, Areas.Act3.Upper_Kurast, Areas.Act3.Kurast_Causeway,
				Areas.Act3.Spider_Forest, Areas.Act3.Spider_Forest, Areas.Act3.Flayer_Jungle, Areas.Act3.Swampy_Pit_Level_1, Areas.Act3.Flayer_Jungle, Areas.Act3.Flayer_Dungeon_Level_1,
				Areas.Act3.Swampy_Pit_Level_2, Areas.Act3.Flayer_Dungeon_Level_2, Areas.Act3.Kurast_Bazaar, Areas.Act3.A3_Sewers_Level_1, Areas.Act3.Kurast_Bazaar, Areas.Act3.Kurast_Bazaar,
				Areas.Act3.Upper_Kurast, Areas.Act3.Upper_Kurast, Areas.Act3.Kurast_Causeway, Areas.Act3.Kurast_Causeway, Areas.Act3.Travincal, Areas.Act3.Durance_Of_Hate_Level_1,
				Areas.Act3.Durance_Of_Hate_Level_2, Areas.Act1.Rogue_Encampment, Areas.Act4.The_Pandemonium_Fortress, Areas.Act4.Outer_Steppes, Areas.Act4.Plains_Of_Despair,
				Areas.Act4.City_Of_The_Damned, Areas.Act4.River_Of_Flame, Areas.Act1.Rogue_Encampment, Areas.Act5.Harrogath, Areas.Act5.Bloody_Foothills, Areas.Act5.Frigid_Highlands,
				Areas.Act5.Arreat_Plateau, Areas.Act5.Crystalized_Passage, Areas.Act5.Crystalized_Passage, Areas.Act5.Glacial_Trail, Areas.Act5.Glacial_Trail, Areas.Act5.Frozen_Tundra,
				Areas.Act5.Ancients_Way, Areas.Act5.Ancients_Way, Areas.Act5.Harrogath, Areas.Act5.Nihlathaks_Temple, Areas.Act5.Halls_Of_Anguish, Areas.Act5.Halls_Of_Pain,
				Areas.Act5.Frigid_Highlands, Areas.Act5.Arreat_Plateau, Areas.Act5.Frozen_Tundra, Areas.Act5.Arreat_Summit, Areas.Act5.The_Worldstone_Keep_Level_1,
				Areas.Act5.The_Worldstone_Keep_Level_2, Areas.Act5.The_Worldstone_Keep_Level_3, Areas.Act5.Throne_Of_Destruction, Areas.Act5.Harrogath, Areas.Act5.Harrogath,
				Areas.Act5.Harrogath, Areas.Act5.Harrogath],
			visitedNodes = [],
			toVisitNodes = [{from: dest, to: null}];

		if (!src) {
			src = me.area;
		}

		if (!this.plotCourse_openedWpMenu && me.inTown && Pather.useWaypoint(null)) {
			this.plotCourse_openedWpMenu = true;
		}

		while (toVisitNodes.length > 0) {
			node = toVisitNodes[0];

			// If we've already visited it, just move on
			if (visitedNodes[node.from] === undefined) {
				visitedNodes[node.from] = node.to;

				if (this.areasConnected(node.from, node.to)) {
					// If we have this wp we can start from there
					if ((me.inTown || // check wp in town
							((src !== previousAreas[dest] && dest !== previousAreas[src]) && // check wp if areas aren't linked
								previousAreas[src] !== previousAreas[dest])) && // check wp if areas aren't linked with a common area
								Pather.wpAreas.indexOf(node.from) > 0 && getWaypoint(Pather.wpAreas.indexOf(node.from))
							) {
						if (node.from !== src) {
							useWP = true;
						}

						src = node.from;
					}

					// We found it, time to go
					if (node.from === src) {
						break;
					}

					if ((prevArea = previousAreas[node.from]) !== 0 && visitedNodes.indexOf(prevArea) === -1) {
						toVisitNodes.push({from: prevArea, to: node.from});
					}

					for (prevArea = 1; prevArea < previousAreas.length; prevArea += 1) {
						// Only interested in those connected to node
						if (previousAreas[prevArea] === node.from && visitedNodes.indexOf(prevArea) === -1) {
							toVisitNodes.push({from: prevArea, to: node.from});
						}
					}
				}

				toVisitNodes.shift();
			} else {
				useWP = true;
			}
		}

		arr.push(src);

		node = src;

		while (node !== dest && node !== undefined) {
			arr.push(node = visitedNodes[node]);
		}

		// Something failed
		if (node === undefined) {
			return false;
		}

		return {course: arr, useWP: useWP};
	},

	/*
		Pather.areasConnected(src, dest);
		dest - destination area id
		src - starting area id
	*/
	areasConnected: function (src, dest) {
		if (src === Areas.Act2.Canyon_Of_The_Magi && dest === Areas.Act2.Arcane_Sanctuary) {
			return false;
		}

		return true;
	},

	/*
		Pather.getAreaName(area);
		area - id of the area to get the name for
	*/
	getAreaName: function (area) {
		var areas = [
			"None",
			"Rogue Encampment",
			"Blood Moor",
			"Cold Plains",
			"Stony Field",
			"Dark Wood",
			"Black Marsh",
			"Tamoe Highland",
			"Den Of Evil",
			"Cave Level 1",
			"Underground Passage Level 1",
			"Hole Level 1",
			"Pit Level 1",
			"Cave Level 2",
			"Underground Passage Level 2",
			"Hole Level 2",
			"Pit Level 2",
			"Burial Grounds",
			"Crypt",
			"Mausoleum",
			"Forgotten Tower",
			"Tower Cellar Level 1",
			"Tower Cellar Level 2",
			"Tower Cellar Level 3",
			"Tower Cellar Level 4",
			"Tower Cellar Level 5",
			"Monastery Gate",
			"Outer Cloister",
			"Barracks",
			"Jail Level 1",
			"Jail Level 2",
			"Jail Level 3",
			"Inner Cloister",
			"Cathedral",
			"Catacombs Level 1",
			"Catacombs Level 2",
			"Catacombs Level 3",
			"Catacombs Level 4",
			"Tristram",
			"Moo Moo Farm",
			"Lut Gholein",
			"Rocky Waste",
			"Dry Hills",
			"Far Oasis",
			"Lost City",
			"Valley Of Snakes",
			"Canyon Of The Magi",
			"Sewers Level 1",
			"Sewers Level 2",
			"Sewers Level 3",
			"Harem Level 1",
			"Harem Level 2",
			"Palace Cellar Level 1",
			"Palace Cellar Level 2",
			"Palace Cellar Level 3",
			"Stony Tomb Level 1",
			"Halls Of The Dead Level 1",
			"Halls Of The Dead Level 2",
			"Claw Viper Temple Level 1",
			"Stony Tomb Level 2",
			"Halls Of The Dead Level 3",
			"Claw Viper Temple Level 2",
			"Maggot Lair Level 1",
			"Maggot Lair Level 2",
			"Maggot Lair Level 3",
			"Ancient Tunnels",
			"Tal Rashas Tomb #1",
			"Tal Rashas Tomb #2",
			"Tal Rashas Tomb #3",
			"Tal Rashas Tomb #4",
			"Tal Rashas Tomb #5",
			"Tal Rashas Tomb #6",
			"Tal Rashas Tomb #7",
			"Duriels Lair",
			"Arcane Sanctuary",
			"Kurast Docktown",
			"Spider Forest",
			"Great Marsh",
			"Flayer Jungle",
			"Lower Kurast",
			"Kurast Bazaar",
			"Upper Kurast",
			"Kurast Causeway",
			"Travincal",
			"Spider Cave",
			"Spider Cavern",
			"Swampy Pit Level 1",
			"Swampy Pit Level 2",
			"Flayer Dungeon Level 1",
			"Flayer Dungeon Level 2",
			"Swampy Pit Level 3",
			"Flayer Dungeon Level 3",
			"Sewers Level 1",
			"Sewers Level 2",
			"Ruined Temple",
			"Disused Fane",
			"Forgotten Reliquary",
			"Forgotten Temple",
			"Ruined Fane",
			"Disused Reliquary",
			"Durance Of Hate Level 1",
			"Durance Of Hate Level 2",
			"Durance Of Hate Level 3",
			"The Pandemonium Fortress",
			"Outer Steppes",
			"Plains Of Despair",
			"City Of The Damned",
			"River Of Flame",
			"Chaos Sanctuary",
			"Harrogath",
			"Bloody Foothills",
			"Frigid Highlands",
			"Arreat Plateau",
			"Crystalline Passage",
			"Frozen River",
			"Glacial Trail",
			"Drifter Cavern",
			"Frozen Tundra",
			"Ancient's Way",
			"Icy Cellar",
			"Arreat Summit",
			"Nihlathak's Temple",
			"Halls Of Anguish",
			"Halls Of Pain",
			"Halls Of Vaught",
			"Abaddon",
			"Pit Of Acheron",
			"Infernal Pit",
			"Worldstone Keep Level 1",
			"Worldstone Keep Level 2",
			"Worldstone Keep Level 3",
			"Throne Of Destruction",
			"The Worldstone Chamber",
			"Matron's Den",
			"Fogotten Sands",
			"Furnace of Pain",
			"Tristram"];

		return areas[area];
	}
};
