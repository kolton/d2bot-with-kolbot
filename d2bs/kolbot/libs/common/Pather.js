/**
*	@filename	Pather.js
*	@author		kolton
*	@desc		handle player movement
*/

var Pather = {
	teleport: true,
	walkDistance: 15,
	teleDistance: 40,
	cancelFlags: [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f],
	wpAreas: [1, 3, 4, 5, 6, 27, 29, 32, 35, 40, 48, 42, 57, 43, 44, 52, 74, 46, 75, 76, 77, 78, 79, 80, 81, 83, 101, 103, 106, 107, 109, 111, 112, 113, 115, 123, 117, 118, 129],
	recursion: true,

	moveTo: function (x, y, retry, clearPath, pop) {
		if (me.dead) { // Abort if dead
			return false;
		}

		var i, path, mob,
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

		if (typeof x === "undefined" || typeof y === "undefined") {
			throw new Error("moveTo: Function must be called with at least 2 arguments.");
		}

		if (typeof x !== "number" || typeof y !== "number") {
			throw new Error("moveTo: Coords must be numbers");
		}

		if (typeof retry === "undefined") {
			retry = 3;
		}

		if (typeof clearPath === "undefined") {
			clearPath = false;
		}

		if (typeof pop === "undefined") {
			pop = false;
		}

		this.useTeleport = this.teleport && !me.inTown && ((me.classid === 1 && me.getSkill(54, 1)) || me.getStat(97, 54));

		// Teleport without calling getPath if the spot is close enough
		if (this.useTeleport && getDistance(me, x, y) <= this.teleDistance) {
			return this.teleportTo(x, y);
		}

		// Walk without calling getPath if the spot is close enough
		if (!this.useTeleport && getDistance(me, x, y) <= 5) {
			return this.walkTo(x, y);
		}

		if (!me.area) {
			throw new Error("moveTo: area error");
		}

		path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? this.teleDistance : this.walkDistance);

		if (!path) {
			throw new Error("moveTo: Failed to generate path.");
		}

		path.reverse();

		if (pop) {
			path.pop();
		}

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
			if (!this.useTeleport || getDistance(me, node) > 2) {
				if (!(this.useTeleport ? this.teleportTo(node.x, node.y) : this.walkTo(node.x, node.y))) {
					// Reduce node distance in new path
					path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? 30 : 10);

					if (!path) {
						throw new Error("moveTo: Failed to generate path.");
					}

					path.reverse();

					if (fail === 2 && !this.useTeleport) {
						Attack.clear(5);
					}

					fail += 1;

					//print("move retry " + fail);
				}

				if (fail >= retry) {
					break;
				}

				if (this.recursion) {
					this.recursion = false;

					if (Config.OpenChests) {
						Misc.openChests(15);
					}

					Misc.scanShrines();

					if (clearPath) {
						Attack.clear(15, typeof clearPath === "number" ? clearPath : false);
					}

					if (Config.Countess.KillGhosts) { // TODO: expand&improve
						mob = Attack.getMob("ghost", 0, 30);

						if (mob) {
							Attack.clearList(mob);
						}
					}

					if (getDistance(me, node.x, node.y) > 5) {
						this.moveTo(node.x, node.y);
					}

					this.recursion = true;
				}

				Misc.townCheck();
			}
		}

		if (this.useTeleport && Config.TeleSwitch) {
			Precast.weaponSwitch(Misc.oldSwitch);
		}

		return getDistance(me, node.x, node.y) < 4;
	},

	teleportTo: function (x, y) {
		var i, tick;

MainLoop:
		for (i = 0; i < 3; i += 1) {
			if (Config.PacketCasting) {
				Skill.setSkill(54, 0);
				Packet.castSkill(0, x, y);
			} else {
				Skill.cast(54, 0, x, y);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping + 200)) {
				if (getDistance(me.x, me.y, x, y) < 5) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	walkTo: function (x, y) {
		var nTimer,
			nFail = 0,
			attemptCount = 0;

		if (me.runwalk === 0) {
			me.runwalk = 1;
		}

		// Charge!
		if (me.classid === 3 && !me.dead && !me.inTown && me.mp >= 9 && getDistance(me.x, me.y, x, y) > 8 && Skill.setSkill(107, 1)) {
			if (Config.Vigor) {
				Skill.setSkill(115, 0);
			}

			clickMap(0, 1, x, y);
			delay(40);
			clickMap(2, 1, x, y);

			while (me.mode !== 1 && me.mode !== 5 && !me.dead) {
				delay(40);
			}
		}

		while (getDistance(me.x, me.y, x, y) > 3 && !me.dead) {
			if (me.classid === 3 && Config.Vigor) {
				Skill.setSkill(115, 0);
			}

			if (this.openDoors(x, y) && getDistance(me.x, me.y, x, y) < 4) {
				return true;
			}

			this.clickMove(x, y);

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

					this.clickMove(me.x + rand(-1, 1) * 4, me.y + rand(-1, 1));

					break ModeLoop;
				}

				delay(40);
			}

			// Wait until we're done walking - idle or dead
			while (me.mode !== 1 && me.mode !== 5 && !me.dead) {
				delay(40);
			}

			if (attemptCount >= 3) {
				return false;
			}

			delay(5);
		}

		return !me.dead && getDistance(me.x, me.y, x, y) < 4;
	},

	clickMove: function (x, y) {
		clickMap(0, 0, x, y);
		delay(40);
		clickMap(2, 0, x, y);
	},

	openDoors: function (x, y) {
		if (me.inTown) {
			return false;
		}

		// Regular doors
		var i, tick,
			door = getUnit(2, "door", 0);

		if (door) {
			do {
				if ((getDistance(door, x, y) < 4 && getDistance(me, door) < 9) || getDistance(me, door) < 4) { // TODO: Adjust to optimal distances
					for (i = 0; i < 3; i += 1) {
						door.interact();

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

		// TODO: Monsta doors (Barricaded)

		return false;
	},

	/*
		This function moves to an existing unit or object with x, y properties. It can also accept a preset unit.
		If you want to go to a preset unit based on its area, type and id, use Pather.moveToPreset().
	*/
	moveToUnit: function (unit, offX, offY, clearPath, pop) { // Maybe use range instead of XY offset
		if (typeof offX === "undefined") {
			offX = 0;
		}

		if (typeof offY === "undefined") {
			offY = 0;
		}

		if (typeof clearPath === "undefined") {
			clearPath = false;
		}

		if (typeof pop === "undefined") {
			pop = false;
		}

		if (!unit || !unit.hasOwnProperty("x") || !unit.hasOwnProperty("y")) {
			throw new Error("moveToUnit: Invalid unit.");
		}

		if (unit instanceof PresetUnit) {
			return this.moveTo(unit.roomx * 5 + unit.x + offX, unit.roomy * 5 + unit.y + offY, 3, clearPath);
		}

		return this.moveTo(unit.x + offX, unit.y + offY, 3, clearPath, pop);
	},

	/*
		This function finds the preset unit based on its area, unitType and unitId and then moves to it.
	*/
	moveToPreset: function (area, unitType, unitId, offX, offY, clearPath, pop) {
		if (typeof area === "undefined" || typeof unitType === "undefined" || typeof unitId === "undefined") {
			throw new Error("moveToPreset: Invalid parameters.");
		}

		if (typeof offX === "undefined") {
			offX = 0;
		}

		if (typeof offY === "undefined") {
			offY = 0;
		}

		if (typeof clearPath === "undefined") {
			clearPath = false;
		}

		if (typeof pop === "undefined") {
			pop = false;
		}

		var presetUnit = getPresetUnit(area, unitType, unitId);

		if (!presetUnit) {
			throw new Error("moveToPreset: Couldn't find preset unit - id " + unitId);
		}

		return this.moveTo(presetUnit.roomx * 5 + presetUnit.x + offX, presetUnit.roomy * 5 + presetUnit.y + offY, 3, clearPath, pop);
	},

	// moveToExit can take a single area or an array of areas as the first argument
	moveToExit: function (targetArea, use, clearPath) {
		var i, j, area, exits, myRoom, targetRoom, dest,
			areas = [];

		if (targetArea instanceof Array) {
			areas = targetArea;
		} else {
			areas.push(targetArea);
		}

		for (i = 0; i < areas.length; i += 1) {
			area = getArea();

			if (typeof area !== "object") {
				throw new Error("moveToExit: error in getArea()");
			}

			exits = area.exits;

			if (!exits || !exits.length) {
				return false;
			}

			for (j = 0; j < exits.length; j += 1) {
				if (exits[j].target === areas[i]) {
					//this.moveToUnit(exits[j], 0, 0, clearPath);

					// tile exit fix, helps with a certain crash too
					dest = this.getNearestWalkable(exits[j].x, exits[j].y, 5, 1);

					if (!dest) {
						return false;
					}

					Pather.moveTo(dest[0], dest[1], 3, clearPath);

					/* i < areas.length - 1 is for crossing multiple areas.
						In that case we must use the exit before the last area.
					*/
					if (use || i < areas.length - 1) {
						switch (exits[j].type) {
						case 1: // walk through
							myRoom = getRoom(me.x, me.y);
							myRoom = [myRoom.x * 5 + myRoom.xsize / 2, myRoom.y * 5 + myRoom.ysize / 2];
							targetRoom = this.getNearestRoom(areas[i]);

							if (targetRoom) {
								this.moveTo(targetRoom[0], targetRoom[1]);
							} else {
								// might need adjustments
								return false;
							}

							break;
						case 2: // stairs
							if (!this.useUnit(5, exits[j].tileid, areas[i])) {
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
			throw new Error("useUnit: Unit not found.");
		}

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) > 5) {
				this.moveToUnit(unit);
			}

			delay(200);
			unit.interact();

			tick = getTickCount();

			while (getTickCount() - tick < 3000) {
				if ((targetArea === null && me.area !== preArea) || me.area === targetArea) {
					delay(200);

					return true;
				}

				delay(10);
			}

			this.moveTo(me.x + 3 * rand(-1, 1), me.y + 3 * rand(-1, 1));
		}

		return false;
	},

	// If there is no check, it will try to take the waypoint directly, without opening the waypoint screen
	useWaypoint: function (targetArea, check) {
		// Check if target area has a waypoint
		if (this.wpAreas.indexOf(targetArea) < 0 && targetArea !== "random") {
			throw new Error("useWaypoint: Invalid area.");
		}

		if (targetArea === "random") {
			check = true;
		}

		// We're already there
		if (me.area === targetArea) {
			return true;
		}

		var i, tick, wp;

		if (me.inTown) {
			Town.move("waypoint");
		}

		wp = getUnit(2, "waypoint");

		if (!wp && me.inTown) {
			Town.move("stash");
			Town.move("waypoint");

			wp = getUnit(2, "waypoint");

			if (!wp) {
				throw new Error("Pather.useWaypoint: Failed to find waypoint.");
			}
		}

		if (!me.inTown && getDistance(me, wp) > 5) {
			this.moveToUnit(wp);
		}

		for (i = 0; i < 12; i += 1) {
			if (check) {
				this.moveToUnit(wp);
				wp.interact(); // TODO: Telekinesis option

				tick = getTickCount();

				while (getTickCount() - tick < 2000) {
					if (getUIFlag(0x14)) { // Waypoint screen is open
						if (targetArea === "random") {
							while (true) {
								targetArea = this.wpAreas[rand(0, this.wpAreas.length - 1)];

								// get a valid wp, avoid towns
								if ([1, 40, 75, 103, 109].indexOf(targetArea) === -1 && getWaypoint(this.wpAreas.indexOf(targetArea))) {
									break;
								}
							}
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
			}

			if (getUIFlag(0x14) || !check) {
				wp.interact(targetArea);

				tick = getTickCount();

				while (getTickCount() - tick < 2000) {
					while (!me.area) {
						delay(100);
					}

					if (me.area === targetArea) {
						delay(200);

						return true;
					}

					delay(10);
				}
			}

			if (i > 1) { // Activate check if we fail direct interact twice
				Packet.flash(me.gid);

				check = true;
			}

			if (me.inTown) {
				this.clickMove(me.x + rand(-1, 1) * 4, me.y + rand(-1, 1) * 4); // In case of client/server desync

				if (i > 2) {
					Town.move("stash");
				}

				Town.move("waypoint");
			} else {
				this.moveToUnit(wp);
			}
		}

		throw new Error("Pather.useWaypoint: Failed to use waypoint");
	},

	makePortal: function (use) {
		if (me.inTown) {
			return true;
		}

		var i, portal, oldPortal, oldGid, tick,
			tpTome = me.findItem("tbk", 0, 3);

		if (!tpTome) {
			throw new Error("makePortal: No TP tomes.");
		}

		if (!tpTome.getStat(70)) {
			throw new Error("makePortal: No scrolls.");
		}

		/* Check for old portal
			- Because this function is fast, if there's player's portal already nearby, it's possible it will try to use that one without this check.
		*/
		oldPortal = getUnit(2, "portal");

		if (oldPortal) {
			do {
				if (oldPortal.getParent() === me.name) {
					oldGid = oldPortal.gid;

					break;
				}
			} while (oldPortal.getNext());
		}

		for (i = 0; i < 5; i += 1) {
			if (me.dead) {
				break;
			}

			Packet.flash(me.gid);
			tpTome.interact();

			tick = getTickCount();

MainLoop:
			while (getTickCount() - tick < 2000) {
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
								return portal;
							}
						}
					} while (portal.getNext());
				}

				delay(20);
			}
		}

		return false;
	},

	usePortal: function (targetArea, owner, unit) {
		if (me.inTown) {
			me.cancel();
		}

		var i, tick, portal, useTK,
			preArea = me.area;

		if (unit) {
			portal = copyUnit(unit);

			if (!portal) {
				return false;
			}
		}

		for (i = 0; i < 5; i += 1) {
			if (!unit) {
				portal = this.getPortal(targetArea, owner);
			}

			if (portal) {
				useTK = me.classid === 1 && me.getSkill(43, 1) && me.inTown && portal.getParent();

				if (useTK) {
					if (getDistance(me, portal) > 13) {
						Attack.getIntoPosition(portal, 13, 0x4);
					}

					Skill.cast(43, 0, portal);
				} else {
					if (getDistance(me, portal) > 2) {
						this.moveToUnit(portal);
					}

					portal.interact();
					//sendPacket(1, 0x13, 4, 2, 4, portal.gid);
				}

				if (portal.mode !== 2 && portal.classid === 298) { // Arcane Sanctuary, maybe some other portals
					portal.interact();

					tick = getTickCount();

					while (getTickCount() - tick < 2000) {
						if (portal.mode === 2) {
							break;
						}

						delay(10);
					}
				}

				tick = getTickCount();

				while (getTickCount() - tick < 1000) {
					while (!me.area) {
						delay(100);
					}

					if (me.area !== preArea) {
						delay(200);

						return true;
					}

					delay(10);
				}

				if (i > 1) {
					Packet.flash(me.gid);

					useTK = false;
				}

				//this.moveTo(me.x + rand(-1, 1) * 3, me.y + rand(-1, 1) * 3); // In case of client/server desync
			}

			delay(100);
		}

		return false;
	},

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

	getNearestWalkable: function (x, y, range, step) {
		if (!step) {
			step = 1;
		}

		var i, j,
			distance = 1,
			result = false;

		// Check if the original spot is valid
		if (this.checkSpot(x, y)) {
			result = [x, y];
		}

MainLoop:
		while (!result && distance < range) {
			for (i = -distance; i <= distance; i += 1) {
				for (j = -distance; j <= distance; j += 1) {
					// Check outer layer only (skip previously checked)
					if (Math.abs(i) >= Math.abs(distance) || Math.abs(j) >= Math.abs(distance)) {
						if (this.checkSpot(x + i, y + j)) {
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

	checkSpot: function (x, y) {
		var dx, dy, value;

		for (dx = -1; dx <= 1; dx += 1) {
			for (dy = -1; dy <= 1; dy += 1) {
				value = CollMap.getColl(x + dx, y + dy);

				//if (value !== 0 && value !== 16) {
				if (value & 0x1) {
					return false;
				}
			}
		}

		return true;
	},

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

	getWP: function (area) {
		var i, j, wp, preset,
			wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

		this.journeyTo(area);

		for (i = 0; i < wpIDs.length; i += 1) {
			preset = getPresetUnit(area, 2, wpIDs[i]);

			if (preset) {
				this.moveToUnit(preset);

				wp = getUnit(2, "waypoint");

				if (wp) {
					for (j = 0; j < 10; j += 1) {
						wp.interact();

						if (getUIFlag(0x14)) {
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

			if (me.inTown && this.wpAreas.indexOf(target.course[0]) > -1 && getWaypoint(this.wpAreas.indexOf(target.course[0]))) {
				this.useWaypoint(target.course[0], true);
				Precast.doPrecast(false);
			} else if (me.area === 109 && target.course[0] === 110) { // Harrogath -> Bloody Foothills
				this.moveTo(5026, 5095);

				unit = getUnit(2, 449); // Gate

				if (unit) {
					for (i = 0; i < 3; i += 1) {
						unit.interact();

						tick = getTickCount();

						while (getTickCount() - tick < 3000) {
							if (unit.mode === 2) {
								delay(1000);

								break;
							}
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
			} else if (me.area === 74 && target.course[0] === 46) { // Arcane Sanctuary -> Canyon of the Magi
				this.moveToPreset(me.area, 2, 357);

				for (i = 0; i < 5; i += 1) {
					unit = getUnit(2, 357);

					unit.interact();
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
				Town.move("anya");
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
	},

	plotCourse_openedWpMenu: false,

	plotCourse: function (dest, src) {
		var node, prevArea, tick, i, wp,
			useWP = false,
			arr = [],
			previousAreas = [0, 0, 1, 2, 3, 10, 5, 6, 2, 3, 4, 6, 7, 9, 10, 11, 12, 3, 17, 17, 6, 20, 21, 22, 23, 24, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 4, 1, 1, 40, 41, 42, 43, 44, 74, 40, 47, 48, 40, 50, 51, 52, 53, 41, 42, 56, 45, 55, 57, 58, 43, 62, 63, 44, 46, 46, 46, 46, 46, 46, 46, 1, 54, 1, 75, 76, 76, 78, 79, 80, 81, 82, 76, 76, 78, 86, 78, 88, 87, 89, 80, 92, 80, 80, 81, 81, 82, 82, 83, 100, 101, 102, 103, 104, 105, 106, 107, 103, 109, 110, 111, 112, 113, 113, 115, 115, 117, 118, 118, 109, 121, 122, 123, 111, 112, 117, 120, 128, 129, 130, 131, 109, 109, 109, 109],
			visitedNodes = [],
			toVisitNodes = [{from: dest, to: null}];

		if (!src) {
			src = me.area;
		}

		if (!this.plotCourse_openedWpMenu && me.inTown) {
			// WP back to this area, and do the check (to get the list of wps)
			if (me.inTown) {
				Town.move("waypoint");
			}

			wp = getUnit(2, "waypoint");

			for (i = 0; i < 5; i += 1) {
				wp.interact();

				tick = getTickCount();
				// Wait for wp menu to open
				while (getTickCount() - tick < 2000 && !getUIFlag(0x14)) {
					delay(10);
				}

				if (getUIFlag(0x14)) {
					this.plotCourse_openedWpMenu = true;
					me.cancel();
					break;
				}
			}
		}

		while (toVisitNodes.length > 0) {
			node = toVisitNodes[0];

			// If we've already visited it, just move on
			if (visitedNodes[node.from] === undefined) {
				visitedNodes[node.from] = node.to;

				if (!this.areasConnected(node.from, node.to)) {
					useWP = true;

					continue;
				}

				// If we have this wp we can start from there
				if ((me.inTown || // check wp in town
						((src !== previousAreas[dest] && dest !== previousAreas[src]) && // check wp if areas aren't linked
							previousAreas[src] !== previousAreas[dest])) &&   // check wp if areas aren't linked with a common area
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

	areasConnected: function (src, dest) {
		if (src === 46 && dest === 74) {
			return false;
		}

		return true;
	}
};
