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

		if (Config.Countess.KillGhosts && [21, 22, 23, 24, 25].indexOf(me.area) > -1) {
			monList = Attack.getMob(38, 0, 30);

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
	walkDistance: 5,
	teleDistance: 40,
	cancelFlags: [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x17, 0x19, 0x1A],
	wpAreas: [1, 3, 4, 5, 6, 27, 29, 32, 35, 40, 48, 42, 57, 43, 44, 52, 74, 46, 75, 76, 77, 78, 79, 80, 81, 83, 101, 103, 106, 107, 109, 111, 112, 113, 115, 123, 117, 118, 129],
	recursion: true,

	useTeleport: function () {
		return this.teleport && !me.getState(139) && !me.getState(140) && !me.inTown && ((me.classid === 1 && me.getSkill(54, 1)) || me.getStat(97, 54));
	},

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

		var i, path, adjustedNode, cleared, useTeleport,
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

		useTeleport = this.useTeleport();

		/* Disabling getPath optimizations, they are causing desync -- noah
		// Teleport without calling getPath if the spot is close enough
		if (useTeleport && getDistance(me, x, y) <= this.teleDistance) {
			//Misc.townCheck();

			return this.teleportTo(x, y);
		}

		// Walk without calling getPath if the spot is close enough
		if (!useTeleport && (getDistance(me, x, y) <= 5 || (getDistance(me, x, y) <= 25 && !CollMap.checkColl(me, {x: x, y: y}, 0x1)))) {
			return this.walkTo(x, y);
		}
		*/

		path = getPath(me.area, x, y, me.x, me.y, useTeleport ? 1 : 0, useTeleport ? ([62, 63, 64].indexOf(me.area) > -1 ? 30 : this.teleDistance) : this.walkDistance);

		if (!path) {
			throw new Error("moveTo: Failed to generate path.");
		}

		path.reverse();

		if (pop) {
			path.pop();
		}

		PathDebug.drawPath(path);

		if (useTeleport && Config.TeleSwitch && path.length > 5) {
			Attack.weaponSwitch(Attack.getPrimarySlot() ^ 1);
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
				if ([62, 63, 64].indexOf(me.area) > -1) {
					adjustedNode = this.getNearestWalkable(node.x, node.y, 15, 3, 0x1 | 0x4 | 0x800 | 0x1000);

					if (adjustedNode) {
						node.x = adjustedNode[0];
						node.y = adjustedNode[1];
					}
				}

				if (useTeleport ? this.teleportTo(node.x, node.y) : this.walkTo(node.x, node.y, (fail > 0 || me.inTown) ? 2 : 4)) {
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
					if (fail > 0 && !useTeleport && !me.inTown) {
						// Don't go berserk on longer paths
						if (!cleared) {
							Attack.clear(5);

							cleared = true;
						}

						if (fail > 1 && me.getSkill(143, 1)) {
							Skill.cast(143, 0, node.x, node.y);
						}
					}

					// Reduce node distance in new path
					path = getPath(me.area, x, y, me.x, me.y, useTeleport ? 1 : 0, useTeleport ? rand(25, 35) : rand(10, 15));
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

					if (fail > 0) {
						Packet.flash(me.gid);

						if (fail >= retry) {
							break;
						}
					}
				}
			}

			delay(5);
		}

		if (useTeleport && Config.TeleSwitch) {
			Attack.weaponSwitch(Attack.getPrimarySlot());
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
				Skill.setSkill(54, 0);
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

			if (Config.Charge && me.classid === 3 && me.mp >= 9 && getDistance(me.x, me.y, x, y) > 8 && Skill.setSkill(107, 1)) {
				if (Config.Vigor) {
					Skill.setSkill(115, 0);
				}

				Misc.click(0, 1, x, y);

				while (me.mode !== 1 && me.mode !== 5 && !me.dead) {
					delay(40);
				}
			}
		}

		if (me.inTown && me.runwalk === 0) {
			me.runwalk = 1;
		}

		while (getDistance(me.x, me.y, x, y) > minDist && !me.dead) {
			if (me.classid === 3 && Config.Vigor) {
				Skill.setSkill(115, 0);
			}

			if (this.openDoors(x, y) && getDistance(me.x, me.y, x, y) <= minDist) {
				return true;
			}

			Misc.click(0, 0, x, y);

			attemptCount += 1;
			nTimer = getTickCount();

ModeLoop:
			while (me.mode !== 2 && me.mode !== 3 && me.mode !== 6) {
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
			while (getDistance(me.x, me.y, x, y) > minDist && me.mode !== 1 && me.mode !== 5 && !me.dead) {
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
			door = getUnit(2, "door", 0);

		if (door) {
			do {
				if ((getDistance(door, x, y) < 4 && getDistance(me, door) < 9) || getDistance(me, door) < 4) {
					for (i = 0; i < 3; i += 1) {
						Misc.click(0, 0, door);
						//door.interact();

						tick = getTickCount();

						while (getTickCount() - tick < 1000) {
							if (door.mode === 2) {
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
		var useTeleport = this.useTeleport();

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

		if (!useTeleport) {
			// The unit will most likely be moving so call the first walk with 'pop' parameter
			this.moveTo(unit.x + offX, unit.y + offY, 0, clearPath, true);
		}

		return this.moveTo(unit.x + offX, unit.y + offY, useTeleport && unit.type && unit.type === 1 ? 3 : 0, clearPath, pop);
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
							if (!this.openExit(areas[i]) && !this.useUnit(5, currExit.tileid, areas[i])) {
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
		Pather.openExit(targetArea);
		targetArea - area id of where the unit leads to
	*/
	openExit: function (targetArea) {
		switch (targetArea) {
		case 47:
			if (me.area === 40 && getDistance(me, 5218, 5180) < 20) {
				break;
			}
		case 65:
			return this.useUnit(2, 74, targetArea);
		case 93:
			return this.useUnit(2, 366, targetArea);
		case 94:
		case 95:
		case 96:
		case 97:
		case 98:
		case 99:
			return this.useUnit(2, "stair", targetArea);
		case 100:
			if (me.area === 101) {
				break;
			}

			return this.useUnit(2, 386, targetArea);
		case 128:
			if (me.area === 129) {
				break;
			}

			return this.useUnit(2, 547, targetArea);
		}

		return false;
	},

	/*
		Pather.openUnit(id);
		type - type of the unit to open
		id - id of the unit to open
	*/
	openUnit: function (type, id) {
		var i, tick, unit, coord;

		for (i = 0; i < 5; i += 1) {
			unit = getUnit(type, id);

			if (unit) {
				break;
			}

			delay(200);
		}

		if (!unit) {
			throw new Error("openUnit: Unit not found. ID: " + unit);
		}

		if (unit.mode != 0) {
			return true;
		}

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) > 5) {
				this.moveToUnit(unit);
			}

			delay(300);
			sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);

			tick = getTickCount();

			while (getTickCount() - tick < 1500) {
				if (unit.mode != 0) {
					delay(100);

					return true;
				}

				delay(10);
			}

			coord = CollMap.getRandCoordinate(me.x, -1, 1, me.y, -1, 1, 3);
			this.moveTo(coord.x, coord.y);
		}

		return false;
	},

	/*
		Pather.useUnit(type, id, targetArea);
		type - type of the unit to use
		id - id of the unit to use
		targetArea - area id of where the unit leads to
	*/
	useUnit: function (type, id, targetArea) {
		var i, tick, unit, coord,
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

			if (type === 2 && unit.mode === 0) {
				if ((me.area === 83 && targetArea === 100 && me.getQuest(21, 0) !== 1) || (me.area === 120 && targetArea === 128 && me.getQuest(39, 0) !== 1)) {
					throw new Error("useUnit: Incomplete quest.");
				}

				if (me.area === 92) {
					this.openUnit(2, 367);
				} else {
					this.openUnit(2, id);
				}
			}

			delay(300);

			if (type === 5) {
				Misc.click(0, 0, unit);
			} else {
				sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 3000) {
				if ((!targetArea && me.area !== preArea) || me.area === targetArea) {
					delay(100);

					return true;
				}

				delay(10);
			}

			coord = CollMap.getRandCoordinate(me.x, -1, 1, me.y, -1, 1, 3);
			this.moveTo(coord.x, coord.y);
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

		var i, tick, wp, coord, retry, npc;

		for (i = 0; i < 12; i += 1) {
			if (me.area === targetArea || me.dead) {
				break;
			}

			if (me.inTown) {
				npc = getUnit(1, NPC.Warriv);

				if (me.area === 40 && npc && getDistance(me, npc) < 50) {
					if (npc && npc.openMenu()) {
						Misc.useMenu(0x0D37);

						if (!Misc.poll(function () {
							return me.area === 1;
						}, 2000, 100)) {
							throw new Error("Failed to go to act 1 using Warriv");
						}
					}
				}

				Town.move("waypoint");
			}

			wp = getUnit(2, "waypoint");

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
						if (getUIFlag(0x14)) { // Waypoint screen is open
							delay(500);

							switch (targetArea) {
							case "random":
								while (true) {
									targetArea = this.wpAreas[rand(0, this.wpAreas.length - 1)];

									// get a valid wp, avoid towns
									if ([1, 40, 75, 103, 109].indexOf(targetArea) === -1 && getWaypoint(this.wpAreas.indexOf(targetArea))) {
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

					if (!getUIFlag(0x14)) {
						print("waypoint retry " + (i + 1));
						retry = Math.min(i + 1, 5)
						coord = CollMap.getRandCoordinate(me.x, -5 * retry, 5 * retry, me.y, -5 * retry, 5 * retry);
						this.moveTo(coord.x, coord.y);
						delay(200 + me.ping);

						Packet.flash(me.gid);

						continue;
					}
				}

				if (!check || getUIFlag(0x14)) {
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

			tpTome = me.findItem("tbk", 0, 3);

			if (!tpTome) {
				throw new Error("makePortal: No TP tomes.");
			}

			if (!tpTome.getStat(70)) {
				throw new Error("makePortal: No scrolls.");
			}

			oldPortal = getUnit(2, "portal");

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
				portal = getUnit(2, "portal");

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

		var i, tick, portal,
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
				if (portal.area === me.area) {
					if (getDistance(me, portal) > 5) {
						this.moveToUnit(portal);
					}

					if (i < 2) {
						sendPacket(1, 0x13, 4, 0x2, 4, portal.gid);
					} else {
						Misc.click(0, 0, portal);
					}
				}

				if (portal.classid === 298 && portal.mode !== 2) { // Portal to/from Arcane
					Misc.click(0, 0, portal);

					tick = getTickCount();

					while (getTickCount() - tick < 2000) {
						if (portal.mode === 2 || me.area === 74) {
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
		var portal = getUnit(2, "portal");

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
			return me.getQuest(7, 0) === 1;
		case 3:
			return me.getQuest(15, 0) === 1;
		case 4:
			return me.getQuest(23, 0) === 1;
		case 5:
			return me.getQuest(28, 0) === 1;
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
			wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

		if (area !== me.area) {
			this.journeyTo(area);
		}

		for (i = 0; i < wpIDs.length; i += 1) {
			preset = getPresetUnit(area, 2, wpIDs[i]);

			if (preset) {
				this.moveToUnit(preset, 0, 0, clearPath);

				wp = getUnit(2, "waypoint");

				if (wp) {
					for (j = 0; j < 10; j += 1) {
						Misc.click(0, 0, wp);
						//wp.interact();

						if (getUIFlag(0x14)) {
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
		if (target.course.indexOf(78) > -1) {
			Town.goToTown(3); // without initiated act, getArea().exits will crash

			special = getArea(78);

			if (special) {
				special = special.exits;

				for (i = 0; i < special.length; i += 1) {
					if (special[i].target === 77) {
						target.course.splice(target.course.indexOf(78), 0, 77); // add great marsh if needed

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
			} else if (me.area === 109 && target.course[0] === 110) { // Harrogath -> Bloody Foothills
				this.moveTo(5026, 5095);

				unit = getUnit(2, 449); // Gate

				if (unit) {
					for (i = 0; i < 3; i += 1) {
						if (unit.mode) {
							break;
						}

						Misc.click(0, 0, unit);
						//unit.interact();

						tick = getTickCount();

						while (getTickCount() - tick < 3000) {
							if (unit.mode) {
								delay(1000);

								break;
							}

							delay(10);
						}
					}
				}

				this.moveToExit(target.course[0], true);
			} else if (me.area === 4 && target.course[0] === 38) { // Stony Field -> Tristram
				this.moveToPreset(me.area, 1, 737, 0, 0, false, true);

				for (i = 0; i < 5; i += 1) {
					if (this.usePortal(38)) {
						break;
					}

					delay(1000);
				}
			} else if (me.area === 40 && target.course[0] === 47) { // Lut Gholein -> Sewers Level 1 (use Trapdoor)
				this.moveToPreset(me.area, 5, 19);
				this.useUnit(2, 74, 47);
			} else if (me.area === 74 && target.course[0] === 46) { // Arcane Sanctuary -> Canyon of the Magi
				this.moveToPreset(me.area, 2, 357);

				for (i = 0; i < 5; i += 1) {
					unit = getUnit(2, 357);

					Misc.click(0, 0, unit);
					delay(1000);
					me.cancel();

					if (this.usePortal(46)) {
						break;
					}
				}
			} else if (me.area === 54 && target.course[0] === 74) { // Palace -> Arcane
				this.moveTo(10073, 8670);
				this.usePortal(null);
			} else if (me.area === 109 && target.course[0] === 121) { // Harrogath -> Nihlathak's Temple
				Town.move(NPC.Anya);
				this.usePortal(121);
			} else if (me.area === 111 && target.course[0] === 125) { // Abaddon
				this.moveToPreset(111, 2, 60);
				this.usePortal(125);
			} else if (me.area === 112 && target.course[0] === 126) { // Pits of Archeon
				this.moveToPreset(112, 2, 60);
				this.usePortal(126);
			} else if (me.area === 117 && target.course[0] === 127) { // Infernal Pit
				this.moveToPreset(117, 2, 60);
				this.usePortal(127);
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
			previousAreas = [0, 0, 1, 2, 3, 10, 5, 6, 2, 3, 4, 6, 7, 9, 10, 11, 12, 3, 17, 17, 6, 20, 21, 22, 23, 24, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 4, 1, 1, 40, 41, 42, 43, 44, 74, 40, 47, 48, 40, 50, 51, 52, 53, 41, 42, 56, 45, 55, 57, 58, 43, 62, 63, 44, 46, 46, 46, 46, 46, 46, 46, 1, 54, 1, 75, 76, 76, 78, 79, 80, 81, 82, 76, 76, 78, 86, 78, 88, 87, 89, 80, 92, 80, 80, 81, 81, 82, 82, 83, 100, 101, 1, 103, 104, 105, 106, 107, 1, 109, 110, 111, 112, 113, 113, 115, 115, 117, 118, 118, 109, 121, 122, 123, 111, 112, 117, 120, 128, 129, 130, 131, 109, 109, 109, 109],
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
		if (src === 46 && dest === 74) {
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