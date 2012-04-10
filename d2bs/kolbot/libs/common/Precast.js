var Precast = new function () {
	this.haveCTA = -1;

	this.weaponSwitch = function (slot) {
		if (me.gametype === 0) {
			return true;
		}

		var i, tick;

		if (!arguments.length) {
			slot = me.weaponswitch === 0 ? 1 : 0;
		} else if (me.weaponswitch === slot) {
			return true;
		}

		delay(500);

		for (i = 0; i < 10; i += 1) {
			weaponSwitch();

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.weaponswitch === slot) {
					delay(me.ping);

					return true;
				}

				delay(10);
			}
		}

		return false;
	};

	this.precastCTA = function (force) {
		if (!force && me.getState(32)) {
			return true;
		}

		if (me.gametype === 0 || me.classid === 4 || me.inTown) {
			return false;
		}

		if (this.BOSwitch()) {
			Skill.cast(155, 0); // Battle Command
			Skill.cast(149, 0); // Battle Orders
			this.weaponSwitch(Math.abs(this.haveCTA - 1));

			return true;
		}

		return false;
	};

	this.doPrecast = function (force) {
		if (!me.getState(51) || force) {
			this.precastCTA(force);
		}

		switch (me.classid) {
		case 0: // Amazon
			if (Config.SummonValkyrie) {
				this.summon(32); // Valkyrie
			}

			break;
		case 1: // Sorceress
			if (!me.getState(38) || force) { // ts
				Skill.cast(57, 0); // Thunder Storm
			}

			if (!me.getState(30) || force) {
				Skill.cast(58, 0); // Energy Shield
			}

			if (!me.getState(88) && !me.getState(10) && !me.getState(20) || force) {
				if (!Skill.cast(50, 0)) { // Shiver Armor
					if (!Skill.cast(60, 0)) { // Chilling Armor
						Skill.cast(40, 0); // Frozen Armor
					}
				}
			}

			break;
		case 2: // Necromancer
			if (!me.getState(14) || force) {
				Skill.cast(68, 0);
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
			if (!me.getState(101) || force) {
				Skill.cast(117, 0); // Holy Shield
			}

			break;
		case 4: // Barbarian
			if (!me.getState(51) || force) {
				Skill.cast(155, 0); // Battle Command
			}

			if (!me.getState(32) || force) {
				Skill.cast(149, 0); // Battle Orders
			}

			if (!me.getState(26) || force) {
				Skill.cast(138, 0); // Shout
			}

			break;
		case 5: // Druid
			if (!me.getState(151) || force) {
				Skill.cast(235, 0); // Cyclone Armor
			}

			if (Config.SummonRaven) {
				this.summon(221); // Raven
			}

			switch (Config.SummonAnimal) {
			case 1:
			case "Spirit Wolf":
				this.summon(227); // Summon Spirit Wolf
				break;
			case 2:
			case "Dire Wolf":
				this.summon(237); // Summon Dire Wolf
				break;
			case 3:
			case "Grizzly":
				this.summon(247); // Summon Grizzly
				break
			}

			switch (Config.SummonVine) {
			case 1:
			case "Poison Creeper":
				this.summon(222); // Poison Creeper
			case 2:
			case "Carrion Vine":
				this.summon(231); // Carrion Vine
			case 3:
			case "Solar Creeper":
				this.summon(241); // Solar Creeper
			}

			switch (Config.SummonSpirit) {
			case 1:
			case "Oak Sage":
				this.summon(226); // Oak Sage
				break;
			case 2:
			case "Heart of Wolverine":
				this.summon(236); // Heart of Wolverine
				break;
			case 3:
			case "Solar Creeper":
				this.summon(241); // Solar Creeper
				break;
			}

			if (!me.getState(144) || force) {
				Skill.cast(250, 0); // Hurricane
			}

			break;
		case 6: // Assassin
			if (Config.UseFade && (!me.getState(159) || force)) {
				Skill.cast(267, 0); // Fade
			}

			if (Config.UseVenom && (!me.getState(31) || force)) {
				Skill.cast(278, 0); // Venom
			}

			if (!me.getState(158) || force) {
				Skill.cast(277, 0); // Blade Shield	
			}

			if (!Config.UseFade && Config.UseBoS && (!me.getState(157) || force)) {
				Skill.cast(258, 0); // Burst of Speed
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
	};

	this.BOSwitch = function () {
		var item;

		if (this.haveCTA < 0) {
			this.haveCTA = 0;
			item = me.getItem(-1, 1);

			if (item) {
MainLoop: do {
					if (item.getPrefix(20519)) { // Call to Arms
						switch (item.bodylocation) {
						case 4:
						case 5:
							this.haveCTA = me.weaponswitch;

							break MainLoop;
						case 11:
						case 12:
							this.haveCTA = Math.abs(me.weaponswitch - 1);

							break MainLoop;
						}
					}
				} while (item.getNext());
			}
		}

		if (this.haveCTA > 0) {
			return this.weaponSwitch(this.haveCTA);
		}

		return false;
	};

	this.summon = function (skillId) {
		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		var minion,
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
			count = 5;

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
			count = 5;

			break;
		case 237: // Dire Wolf
			minion = 12;
			count = 3;

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
			Skill.cast(skillId, 0);
			delay(200);
		}

		return true;
	};
};