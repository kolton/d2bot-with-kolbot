/**
*	@filename	Precast.js
*	@author		noah-, kolton
*	@desc		handle player prebuff sequence
*/

var Precast = new function () {
	this.haveCTA = -1;
	this.BODuration = 0;
	this.BOTick = 0;
	this.bestSlot = {};

	this.precastCTA = function (force) {
		if (!force && me.getState(32)) {
			return true;
		}

		if (me.gametype === 0 || me.classid === 4 || me.inTown) {
			return false;
		}

		if (this.checkCTA()) {
			var slot = me.weaponswitch;

			Attack.weaponSwitch(this.haveCTA);
			Skill.cast(155, 0); // Battle Command
			Skill.cast(149, 0); // Battle Orders

			this.BODuration = (20 + me.getSkill(149, 1) * 10 + (me.getSkill(138, 0) + me.getSkill(155, 0)) * 5) * 1000;
			this.BOTick = getTickCount();

			Attack.weaponSwitch(slot);

			return true;
		}

		return false;
	};

	this.getBetterSlot = function (skillId) {
		if (this.bestSlot[skillId] !== undefined) {
			return this.bestSlot[skillId];
		}

		var item, classid, skillTab,
			sumCurr = 0,
			sumSwap = 0;

		switch (skillId) {
		case 40: // Frozen Armor
		case 50: // Shiver Armor
		case 60: // Chilling Armor
			classid = 1;
			skillTab = 10;

			break;
		case 52: // Enchant
			classid = 1;
			skillTab = 8;

			break;
		case 57: // Thunder Storm
		case 58: // Energy Shield
			classid = 1;
			skillTab = 9;

			break;
		case 68: // Bone Armor
			classid = 2;
			skillTab = 17;

			break;
		case 117: // Holy Shield
			classid = 3;
			skillTab = 24;

			break;
		case 138: // Shout
		case 149: // Battle Orders
		case 155: // Battle Command
			classid = 4;
			skillTab = 34;

			break;
		case 235: // Cyclone Armor
			classid = 5;
			skillTab = 42;

			break;
		case 258: // Burst of Speed
		case 267: // Fade
			classid = 6;
			skillTab = 49;

			break;
		case 277: // Blade Shield
			classid = 6;
			skillTab = 48;

			break;
		default:
			return me.weaponswitch;
		}

		item = me.getItem();

		if (item) {
			do {
				if (item.bodylocation === 4 || item.bodylocation === 5) {
					sumCurr += (item.getStat(127) + item.getStat(83, classid) + item.getStat(188, skillTab) + item.getStat(107, skillId) + item.getStat(97, skillId));
				}

				if (item.bodylocation === 11 || item.bodylocation === 12) {
					sumSwap += (item.getStat(127) + item.getStat(83, classid) + item.getStat(188, skillTab) + item.getStat(107, skillId) + item.getStat(97, skillId));
				}
			} while (item.getNext());
		}

		this.bestSlot[skillId] = (sumSwap > sumCurr) ? me.weaponswitch ^ 1 : me.weaponswitch;
		return this.bestSlot[skillId];
	};

	this.precastSkill = function (skillId) {
		var swap = me.weaponswitch;

		Attack.weaponSwitch(this.getBetterSlot(skillId));
		Skill.cast(skillId, 0);
		Attack.weaponSwitch(swap);

		return true;
	};

	this.doPrecast = function (force) {
		var buffSummons = false;

		// Force BO 30 seconds before it expires
		this.precastCTA(!me.getState(32) || force || (getTickCount() - this.BOTick >= this.BODuration - 30000));

		switch (me.classid) {
		case 0: // Amazon
			if (Config.SummonValkyrie) {
				this.summon(32); // Valkyrie
			}

			break;
		case 1: // Sorceress
			if (me.getSkill(57, 0) && (!me.getState(38) || force)) {
				this.precastSkill(57); // Thunder Storm
			}

			if (me.getSkill(58, 0) && (!me.getState(30) || force)) {
				this.precastSkill(58); // Energy Shield
			}

			if (me.getSkill(50, 0)) {
				if (!me.getState(88) || force) {
					this.precastSkill(50); // Shiver Armor
				}
			} else if (me.getSkill(60, 0)) {
				if (!me.getState(20) || force) {
					this.precastSkill(60); // Chilling Armor
				}
			} else if (me.getSkill(40, 0)) {
				if (!me.getState(10) || force) {
					this.precastSkill(40); // Frozen Armor
				}
			}

			if (me.getSkill(52, 0) && (!me.getState(16) || force)) {
				this.enchant();
			}

			break;
		case 2: // Necromancer
			if (me.getSkill(68, 0) && (!me.getState(14) || force)) {
				this.precastSkill(68); // Bone Armor
			}

			switch (Config.Golem) {
			case 0:
			case "None":
				break;
			case 1:
			case "Clay":
				this.summon(75);
				break;
			case 2:
			case "Blood":
				this.summon(85);
				break;
			case 3:
			case "Fire":
				this.summon(94);
				break;
			}

			break;
		case 3: // Paladin
			if (me.getSkill(117, 0) && (!me.getState(101) || force)) {
				this.precastSkill(117); // Holy Shield
			}

			break;
		case 4: // Barbarian - TODO: BO duration
			if (!me.getState(32) || !me.getState(51) || !me.getState(26) || force) {
				var swap = me.weaponswitch;

				Attack.weaponSwitch(this.getBetterSlot(149));

				if (!me.getState(51) || force) {
					Skill.cast(155, 0); // Battle Command
				}

				if (!me.getState(32) || force) {
					Skill.cast(149, 0); // Battle Orders
				}

				if (!me.getState(26) || force) {
					Skill.cast(138, 0); // Shout
				}

				Attack.weaponSwitch(swap);
			}

			break;
		case 5: // Druid
			if (me.getSkill(235, 0) && (!me.getState(151) || force)) {
				this.precastSkill(235); // Cyclone Armor
			}

			if (Config.SummonRaven) {
				this.summon(221); // Raven
			}

			switch (Config.SummonAnimal) {
			case 1:
			case "Spirit Wolf":
				buffSummons = this.summon(227) || buffSummons; // Summon Spirit Wolf

				break;
			case 2:
			case "Dire Wolf":
				buffSummons = this.summon(237) || buffSummons; // Summon Dire Wolf

				break;
			case 3:
			case "Grizzly":
				buffSummons = this.summon(247) || buffSummons; // Summon Grizzly

				break;
			}

			switch (Config.SummonVine) {
			case 1:
			case "Poison Creeper":
				buffSummons = this.summon(222) || buffSummons; // Poison Creeper

				break;
			case 2:
			case "Carrion Vine":
				buffSummons = this.summon(231) || buffSummons; // Carrion Vine

				break;
			case 3:
			case "Solar Creeper":
				buffSummons = this.summon(241) || buffSummons; // Solar Creeper

				break;
			}

			switch (Config.SummonSpirit) {
			case 1:
			case "Oak Sage":
				buffSummons = this.summon(226) || buffSummons; // Oak Sage

				break;
			case 2:
			case "Heart of Wolverine":
				buffSummons = this.summon(236) || buffSummons; // Heart of Wolverine

				break;
			case 3:
			case "Spirit of Barbs":
				buffSummons = this.summon(246) || buffSummons; // Spirit of Barbs

				break;
			}

			if (me.getSkill(250, 0) && (!me.getState(144) || force)) {
				Skill.cast(250, 0); // Hurricane
			}

			if (Config.SummonSpirit === 1 && me.getSkill(226, 1) && (!me.getState(149) || force)) {
				Skill.cast(226, 0); // Oak Sage
			}

			if (Config.SummonSpirit === 2 && me.getSkill(236, 1) && (!me.getState(148) || force)) {
				Skill.cast(236, 0); // Heart of Wolverine
			}

			if (Config.SummonSpirit === 3 && me.getSkill(246, 1) && (!me.getState(147) || force)) {
				Skill.cast(246, 0); // Spirit of Barbs
			}

			if (buffSummons) {
				this.precastCTA(force);
			}

			break;
		case 6: // Assassin
			if (me.getSkill(267, 0) && Config.UseFade && (!me.getState(159) || force)) {
				this.precastSkill(267); // Fade
			}

			if (me.getSkill(278, 0) && Config.UseVenom && (!me.getState(31) || force)) {
				Skill.cast(278, 0); // Venom
			}

			if (me.getSkill(277, 0) && (!me.getState(158) || force)) {
				this.precastSkill(277); // Blade Shield
			}

			if (me.getSkill(258, 0) && !Config.UseFade && Config.UseBoS && (!me.getState(157) || force)) {
				this.precastSkill(258); // Burst of Speed
			}

			switch (Config.SummonShadow) {
			case 1:
			case "Warrior":
				this.summon(268); // Shadow Warrior
				break;
			case 2:
			case "Master":
				this.summon(279); // Shadow Master
				break;
			}

			break;
		}

		Attack.weaponSwitch(Attack.getPrimarySlot());
	};

	this.checkCTA = function () {
		var item;

		if (this.haveCTA > -1) {
			return true;
		}

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.getPrefix(20519)) { // Call to Arms
					switch (item.bodylocation) {
					case 4:
					case 5:
						this.haveCTA = me.weaponswitch;

						return true;
					case 11:
					case 12:
						this.haveCTA = me.weaponswitch ^ 1;

						return true;
					}
				}
			} while (item.getNext());
		}

		return false;
	};

	this.summon = function (skillId) {
		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		var minion, rv,
			count = 1;

		switch (skillId) {
		case 32: // Valkyrie
			minion = 2;

			break;
		case 75: // Clay Golem
		case 85: // Blood Golem
		case 94: // Fire Golem
			minion = 3;

			break;
		case 221: // Raven
			minion = 10;
			count = Math.min(me.getSkill(221, 1), 5);

			break;
		case 226: // Oak Sage
		case 236: // Heart of Wolverine
		case 246: // Spirit of Barbs
			minion = 13;

			break;
		case 222: // Poison Creeper
		case 231: // Carrion Vine
		case 241: // Solar Creeper
			minion = 14;

			break;
		case 227: // Spirit Wolf
			minion = 11;
			count = Math.min(me.getSkill(227, 1), 5);

			break;
		case 237: // Dire Wolf
			minion = 12;
			count = Math.min(me.getSkill(237, 1), 3);

			break;
		case 247: // Grizzly
			minion = 15;

			break;
		case 268: // Shadow Warrior
		case 279: // Shadow Master
			minion = 16;

			break;
		}

		while (me.getMinionCount(minion) < count) {
			rv = true;

			Skill.cast(skillId, 0);
			delay(200);
		}

		return !!rv;
	};

	this.enchant = function () {
		var unit, slot = me.weaponswitch, chanted = [];

		Attack.weaponSwitch(this.getBetterSlot(52));

		// Player
		unit = getUnit(0);

		if (unit) {
			do {
				if (!unit.dead && Misc.inMyParty(unit.name) && getDistance(me, unit) <= 40) {
					Skill.cast(52, 0, unit);
					chanted.push(unit.name);
				}
			} while (unit.getNext());
		}

		// Minion
		unit = getUnit(1);

		if (unit) {
			do {
				if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && getDistance(me, unit) <= 40) {
					Skill.cast(52, 0, unit);
				}
			} while (unit.getNext());
		}

		Attack.weaponSwitch(slot);

		return true;
	};
};