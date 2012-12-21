/**
*	@filename	OrgTorch.js
*	@author		kolton
*	@desc		Convert keys to organs and organs to torches. It can work with TorchSystem to get keys from other characters
*/

function OrgTorch() {
	this.doneAreas = [];

	// Identify & mule
	this.checkTorch = function () {
		if (me.area === 136) {
			Pather.moveTo(25105, 5140);
			Pather.usePortal(109);
		}

		Town.doChores();

		if (!Config.OrgTorch.MakeTorch) {
			return false;
		}

		var item = me.getItem("cm2");

		if (item) {
			do {
				if (item.quality === 7 && Pickit.checkItem(item).result === 1) {
					if (!!AutoMule.getMule(1)) {
						//D2Bot.printToConsole("torch found");
						scriptBroadcast("muleTorch");

						quit();
						delay(10000);
					} else {
						return true;
					}
				}
			} while (item.getNext());
		}

		return false;
	};

	// Check whether the killer is alone in the game
	this.foreverAlone = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};

	this.lure = function (bossId) {
		var tick,
			unit = getUnit(1, bossId);

		if (unit) {
			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (getDistance(me, unit) <= 10) {
					return true;
				}

				delay(50);
			}
		}

		return false;
	};

	this.checkUneven = function () {
		return (me.getItem("mbr") && me.getItem("bey") && me.getItem("dhn"));
	};

	this.getFade = function () {
		if (Config.OrgTorch.GetFade && me.classid === 3) {
			if (!me.getState(159)) {
				print("Getting Fade");
				Pather.useWaypoint(107);
				Precast.doPrecast(true);
				Pather.moveTo(7811, 5872);

				if (me.classid === 3 && me.getSkill(125, 1)) {
					Skill.setSkill(125, 0);
				}

				while (!me.getState(159)) {
					delay(100);
				}

				print("Fade Achieved.");
			}
		}

		return true;
	};

	this.openPortal = function (mode) { // 0 = orgs, 1 = torch
		var portal,
			item1 = mode === 0 ? me.findItem("pk1", 0) : me.findItem("dhn", 0),
			item2 = mode === 0 ? me.findItem("pk2", 0) : me.findItem("bey", 0),
			item3 = mode === 0 ?  me.findItem("pk3", 0) : me.findItem("mbr", 0);

		Town.goToTown(5);
		Town.doChores();

		if (Town.openStash() && Cubing.emptyCube()) {
			if (!Storage.Cube.MoveTo(item1) || !Storage.Cube.MoveTo(item2) || !Storage.Cube.MoveTo(item3)) {
				return false;
			}

			if (!Cubing.openCube()) {
				return false;
			}

			transmute();
			delay(1000);

			portal = getUnit(2, "portal");

			if (portal) {
				do {
					switch (mode) {
					case 0:
						if ([133, 134, 135].indexOf(portal.objtype) > -1 && this.doneAreas.indexOf(portal.objtype) === -1) {
							this.doneAreas.push(portal.objtype);

							return copyUnit(portal);
						}

						break;
					case 1:
						if (portal.objtype === 136) {
							return copyUnit(portal);
						}

						break;
					}
				} while (portal.getNext());
			}
		}

		return false;
	};

	this.pandemoniumRun = function () {
		var i, findLoc, skillBackup;

		switch (me.area) {
		case 133: // Matron's Den
			Precast.doPrecast(true);
			Pather.moveToPreset(133, 2, 397);
			Attack.kill(707);
			Attack.clear(5);
			Pickit.pickItems();
			Town.goToTown();

			break;
		case 134: // Faggotten Sands
			Precast.doPrecast(true);

			findLoc = [20196, 8694, 20308, 8588, 20187, 8639, 20100, 8550, 20103, 8688, 20144, 8709, 20263, 8811, 20247, 8665];

			for (i = 0; i < findLoc.length; i += 2) {
				Pather.moveTo(findLoc[i], findLoc[i + 1]);
				delay(500);

				if (getUnit(1, 708)) {
					break;
				}
			}

			Attack.kill(708);
			Pickit.pickItems();
			Town.goToTown();

			break;
		case 135: // Furnace of Pain
			Precast.doPrecast(true);
			Pather.moveToPreset(135, 2, 397);
			Attack.kill(706);
			Pickit.pickItems();
			Town.goToTown();

			break;
		case 136: // Tristram
			Pather.moveTo(25068, 5078);
			Precast.doPrecast(true);

			findLoc = [25040, 5101, 25040, 5166, 25122, 5170];

			for (i = 0; i < findLoc.length; i += 2) {
				Pather.moveTo(findLoc[i], findLoc[i + 1]);
			}

			Skill.setSkill(125, 0);
			this.lure(704);
			Pather.moveTo(25129, 5198);
			Skill.setSkill(125, 0);
			this.lure(704);

			if (!getUnit(1, 704)) {
				Pather.moveTo(25122, 5170);
			}

			if (Config.OrgTorch.UseSalvation && me.classid === 3 && me.getSkill(125, 1)) {
				skillBackup = Config.AttackSkill[2];
				Config.AttackSkill[2] = 125;

				Attack.init();
			}

			Attack.kill(704);

			if (skillBackup && me.classid === 3 && me.getSkill(125, 1)) {
				Config.AttackSkill[2] = skillBackup;

				Attack.init();
			}

			Pather.moveTo(25162, 5141);
			delay(3250);

			if (!getUnit(1, 709)) {
				Pather.moveTo(25122, 5170);
			}

			Attack.kill(709);

			if (!getUnit(1, 705)) {
				Pather.moveTo(25122, 5170);
			}

			Attack.kill(705);
			Pickit.pickItems();
			this.checkTorch();

			break;
		}
	};

	// Start
	var i, portal, tkeys, hkeys, dkeys, brains, eyes, horns, timer, farmer;

	this.checkTorch(); // does town chores too

	if (Config.OrgTorch.WaitForKeys) {
		timer = getTickCount();
		farmer = TorchSystem.isFarmer();
		this.torchSystemEvent = function (mode, msg) {
			var farmer = TorchSystem.isFarmer();

			if (farmer && mode === 0 && farmer.KeyFinderProfiles.indexOf(msg) > -1) {
				print("Got game request from: " + msg);
				sendCopyData(null, msg, 0, me.gamename + "/" + me.gamepassword);
			}
		};

		addEventListener('copydata', this.torchSystemEvent);
		Town.goToTown(1);
		Town.move("stash");

		while (true) {
			if (!farmer) {
				break;
			}

			if (Town.needStash()) {
				Town.stash();
			}

			tkeys = me.findItems("pk1", 0).length;
			hkeys = me.findItems("pk2", 0).length;
			dkeys = me.findItems("pk3", 0).length;

			if (((tkeys >= 3 && hkeys >= 3 && dkeys >= 3) || (Config.OrgTorch.WaitTimeout && (getTickCount() - timer > Config.OrgTorch.WaitTimeout * 1000 * 60))) && this.foreverAlone()) {
				removeEventListener('copydata', this.torchSystemEvent);

				break;
			}

			while (!this.foreverAlone()) {
				delay(500);
			}

			delay(1000);
			Pickit.pickItems();
		}
	}

	tkeys = me.findItems("pk1", 0).length;
	hkeys = me.findItems("pk2", 0).length;
	dkeys = me.findItems("pk3", 0).length;
	brains = me.findItems("mbr", 0).length;
	eyes = me.findItems("bey", 0).length;
	horns = me.findItems("dhn", 0).length;

	if ((tkeys < 3 || hkeys < 3 || dkeys < 3) && (brains < 1 || eyes < 1 || horns < 1)) {
		print("Not enough keys or organs.");

		return true;
	}

	if (tkeys >= 3 && hkeys >= 3 && dkeys >= 3) {
		this.getFade();

		print("Making organs.");

		for (i = 0; i < 3; i += 1) {
			if (this.checkUneven()) {
				break;
			}

			portal = this.openPortal(0);

			if (portal) {
				Pather.usePortal(null, null, portal);
			}

			this.pandemoniumRun();
		}
	}

	// Don't make torches if not configured to OR if the char already has one
	if (!Config.OrgTorch.MakeTorch || this.checkTorch()) {
		return true;
	}

	brains = me.findItems("mbr", 0).length;
	eyes = me.findItems("bey", 0).length;
	horns = me.findItems("dhn", 0).length;

	if (brains && eyes && horns) {
		this.getFade();

		print("Making torch");

		portal = this.openPortal(1);

		if (portal) {
			Pather.usePortal(null, null, portal);
		}

		this.pandemoniumRun();
	}

	return true;
}
