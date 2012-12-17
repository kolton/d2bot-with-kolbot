/**
*	@filename	Necromancer.js
*	@author		kolton
*	@desc		Necromancer attack sequence
*/

var ClassAttack = {
	skillRange: [],
	skillHand: [],
	skillElement: [],
	curseState: [],
	novaTick: 0,

	init: function () {
		var i;

		for (i = 0; i < Config.LowManaSkill.length; i += 1) {
			Config.AttackSkill.push(Config.LowManaSkill[i]);
		}

		for (i = 0; i < Config.AttackSkill.length; i += 1) {
			this.skillHand[i] = getBaseStat("skills", Config.AttackSkill[i], "leftskill");
			this.skillElement[i] = Attack.getSkillElement(Config.AttackSkill[i]);

			switch (Config.AttackSkill[i]) {
			case 0: // Normal Attack
				this.skillRange[i] = Attack.usingBow() ? 20 : 2;
				this.skillHand[i] = 2; // shift bypass

				break;
			case 73: // Poison Dagger
				this.skillRange[i] = 2;

				break;
			case 92: // Poison Nova
				this.skillRange[i] = 8;

				break;
			case 67: // Teeth
			case 84: // Bone Spear
			case 93: // Bone Spirit
				this.skillRange[i] = 15;

				break;
			case 500: // Summoner
				this.skillRange[i] = 5;

				break;
			default: // Every other skill
				this.skillRange[i] = 20;

				break;
			}
		}

		for (i = 0; i < Config.Curse.length; i += 1) {
			switch (Config.Curse[i]) {
			case 0: //nothing
				this.curseState[i] = 0;

				break;
			case 66: //amplify damage
				this.curseState[i] = 9;

				break;
			case 71: //dim vision
				this.curseState[i] = 23;

				break;
			case 72: //weaken
				this.curseState[i] = 19;

				break;
			case 76: //iron maiden
				this.curseState[i] = 55;

				break;
			case 77: //terror
				this.curseState[i] = 56;

				break;
			case 81: //confuse
				this.curseState[i] = 59;

				break;
			case 82: //life tap
				this.curseState[i] = 58;

				break;
			case 86: //attract
				this.curseState[i] = 57;

				break;
			case 87: //decrepify
				this.curseState[i] = 60;

				break;
			case 91: //lower resist
				this.curseState[i] = 61;

				break;
			default:
				Config.Curse[i] = 0;
				print("Invalid curse id");

				break;
			}
		}
	},

	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, this.skillElement[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[0] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[0], 0x4)) {
					return 1;
				}
			}

			if (!Skill.cast(Config.AttackSkill[0], this.skillHand[0], unit)) {
				return 2;
			}

			return 3;
		}

		var index;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		if (Config.Curse[0] > 0 && this.isCursable(unit) && (unit.spectype & 0x7) && !unit.getState(this.curseState[0])) {
			if (getDistance(me, unit) > 25 || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, 25, 0x4)) {
					return 1;
				}
			}

			if (!Skill.cast(Config.Curse[0], 0, unit)) {
				return 2;
			}

			return 3;
		}

		if (Config.Curse[1] > 0 && this.isCursable(unit) && !(unit.spectype & 0x7) && !unit.getState(this.curseState[1])) {
			if (getDistance(me, unit) > 25 || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, 25, 0x4)) {
					return 1;
				}
			}

			if (!Skill.cast(Config.Curse[1], 0, unit)) {
				return 2;
			}

			return 3;
		}

		if (Attack.checkResist(unit, this.skillElement[index])) {
			switch (this.doCast(unit, index)) {
			case 0: // total fail
				return 1;
			case false: // fail to cast
				return 2;
			}

			if (Config.ActiveSummon) {
				this.raiseArmy();
			}

			this.explodeCorpses(unit);

			return 3;
		}

		if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, this.skillElement[5])) {
			switch (this.doCast(unit, 5)) {
			case 0: // total fail
				return 1;
			case false: // fail to cast
				return 2;
			}

			if (Config.ActiveSummon) {
				this.raiseArmy();
			}

			this.explodeCorpses(unit);

			return 3;
		}

		if (Attack.checkResist(unit, "physical") && me.getMerc()) {
			if (Config.TeleStomp && getDistance(me, unit) > 3) {
				Pather.moveToUnit(unit);
			}

			if (Config.ActiveSummon) {
				this.raiseArmy();
			}

			this.explodeCorpses(unit);
			delay(300);

			return 3;
		}

		return 1;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
		this.raiseArmy();
		this.novaTick = 0;
	},

	doCast: function (unit, index) {
		var i,
			timed = index,
			untimed = index + 1;

		// Low mana timed skill
		if (Config.AttackSkill[timed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 2] > -1 && Skill.getManaCost(Config.AttackSkill[timed]) > me.mp) {
			timed = Config.AttackSkill.length - 2;
		}

		if (Config.AttackSkill[timed] === 92) {
			if (!this.novaTick || getTickCount() - this.novaTick > Config.PoisonNovaDelay * 1000) {
				if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
					if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4)) {
						return 0;
					}
				}

				if (Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit)) {
					this.novaTick = getTickCount();

					return true;
				}

				return false;
			}
		} else if (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[timed])) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[timed] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[timed], 0x4)) {
					return 0;
				}
			}

			if (Config.AttackSkill[timed] === 500) {
				delay(300);

				return true;
			}

			return Skill.cast(Config.AttackSkill[timed], this.skillHand[timed], unit);
		}

		// Low mana untimed skill
		if (Config.AttackSkill[untimed] > -1 && Config.AttackSkill[Config.AttackSkill.length - 1] > -1 && Skill.getManaCost(Config.AttackSkill[untimed]) > me.mp) {
			untimed = Config.AttackSkill.length - 1;
		}

		if (Config.AttackSkill[untimed] > -1) {
			if (Math.round(getDistance(me, unit)) > this.skillRange[untimed] || checkCollision(me, unit, 0x4)) {
				if (!Attack.getIntoPosition(unit, this.skillRange[untimed], 0x4)) {
					return 0;
				}
			}

			return Skill.cast(Config.AttackSkill[untimed], this.skillHand[untimed], unit);
		}

		for (i = 0; i < 25; i += 1) {
			delay(40);

			if (!me.getState(121)) {
				break;
			}
		}

		while (this.novaTick && getTickCount() - this.novaTick < Config.PoisonNovaDelay * 1000) {
			delay(40);
		}

		return false;
	},

	isCursable: function (unit) {
		if (typeof copyUnit(unit).name === "undefined" || unit.name.indexOf(getLocaleString(11086)) > -1) { // "Possessed"
			return false;
		}

		if (unit.getState(57)) { // attract can't be overridden
			return false;
		}

		switch (unit.classid) {
		case 206: // Foul Crow Nest
		case 258: // Water Watcher
		case 261: // Water Watcher
		case 266: // Flavie
		case 528: // Evil Demon Hut
			return false;
		}

		return true;
	},

	raiseArmy: function (range) {
		var i, tick, count, corpse, corpseList, skill, maxSkeletons, maxMages, maxRevives;

		if (!range) {
			range = 25;
		}

		if (Config.Skeletons === "max") {
			skill = me.getSkill(70, 1);
			maxSkeletons = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
		} else {
			maxSkeletons = Config.Skeletons;
		}

		if (Config.SkeletonMages === "max") {
			skill = me.getSkill(80, 1);
			maxMages = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
		} else {
			maxMages = Config.SkeletonMages;
		}

		if (Config.Revives === "max") {
			skill = me.getSkill(95, 1);
			maxRevives = skill;
		} else {
			maxRevives = Config.Revives;
		}

		for (i = 0; i < 3; i += 1) {
			corpse = getUnit(1, -1, 12);
			corpseList = [];

			if (corpse) {
				do {
					if (getDistance(me, corpse) <= range && this.checkCorpse(corpse)) { // within casting distance
						corpseList.push(copyUnit(corpse));
					}
				} while (corpse.getNext());
			}

MainLoop:
			while (corpseList.length > 0) {
				corpse = corpseList.shift();

				if (me.getMinionCount(4) < maxSkeletons) {
					if (!Skill.cast(70, 0, corpse)) {
						return false;
					}

					count = me.getMinionCount(4);
					tick = getTickCount();

					while (getTickCount() - tick < 200) {
						if (me.getMinionCount(4) > count) {
							break;
						}

						delay(10);
					}
				} else if (me.getMinionCount(5) < maxMages) {
					if (!Skill.cast(80, 0, corpse)) {
						return false;
					}

					count = me.getMinionCount(5);
					tick = getTickCount();

					while (getTickCount() - tick < 200) {
						if (me.getMinionCount(5) > count) {
							break;
						}

						delay(10);
					}
				} else if (me.getMinionCount(6) < maxRevives) {
					if (!this.checkCorpse(corpse, true)) {
						continue MainLoop;
					}

					print("Reviving " + corpse.name);

					if (!Skill.cast(95, 0, corpse)) {
						return false;
					}

					count = me.getMinionCount(6);
					tick = getTickCount();

					while (getTickCount() - tick < 200) {
						if (me.getMinionCount(6) > count) {
							break;
						}

						delay(10);
					}
				} else {
					return true;
				}
			}
		}

		return true;
	},

	explodeCorpses: function (unit) {
		if (Config.ExplodeCorpses === 0 || unit.mode === 0 || unit.mode === 12) {
			return false;
		}

		var corpseList = [],
			range = Math.floor((me.getSkill(Config.ExplodeCorpses, 1) + 7) / 3),
			corpse = getUnit(1, -1, 12);

		if (corpse) {
			do {
				if (getDistance(unit, corpse) <= range && this.checkCorpse(corpse)) {
					corpseList.push(copyUnit(corpse));

					if (corpseList.length >= 2) { // Explode 2 corpses per cycle, so we can leave some for summoning
						break;
					}
				}
			} while (corpse.getNext());
		}

		while (corpseList.length > 0) {
			corpse = corpseList.shift();

			me.overhead("Exploding: " + corpse.classid + " " + corpse.name);

			if (Skill.cast(Config.ExplodeCorpses, 0, corpse)) {
				delay(200);
			}
		}

		return true;
	},

	checkCorpse: function (unit, revive) {
		if (unit.mode !== 12) {
			return false;
		}

		if (typeof revive === "undefined") {
			revive = false;
		}

		var baseId = getBaseStat("monstats", unit.classid, "baseid"),
			badList = [312, 571];

		if (revive && ((unit.spectype & 0x7) || badList.indexOf(baseId) > -1 || (Config.ReviveUnstackable && getBaseStat("monstats2", baseId, "sizex") === 3))) {
			return false;
		}

		if (!getBaseStat("monstats2", baseId, revive ? "revive" : "corpseSel")) {
			return false;
		}

		if (getDistance(me, unit) <= 25 && !checkCollision(me, unit, 0x4) &&
				!unit.getState(1) && // freeze
				!unit.getState(96) && // revive
				!unit.getState(99) && // redeemed
				!unit.getState(104) && // nodraw
				!unit.getState(107) && // shatter
				!unit.getState(118) // noselect
				) {
			return true;
		}

		return false;
	}
};