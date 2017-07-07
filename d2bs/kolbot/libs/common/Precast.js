/**
*	@filename	Precast.js
*	@author		D3STROY3R, kolton
*	@desc		handle player prebuff sequence
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Precast = new function () {
	this.haveCTA = -1;
	this.BODuration = 0;
	this.BOTick = 0;

    this.weaponSwitch = function (slot) {
        if (me.gametype === GameType.Classic) {
			return true;
		}

		if (slot === -1) {
			this.BOSwitch();

			slot = this.haveCTA;
		}

		var i, tick;

		if (slot === undefined) {
			slot = me.weaponswitch === 0 ? 1 : 0;
		} else if (me.weaponswitch === slot) {
			return true;
		}

		delay(500);

		for (i = 0; i < 5; i += 1) {
			weaponSwitch();

			tick = getTickCount();

			while (getTickCount() - tick < 2000 + me.ping) {
				if (me.weaponswitch === slot) {
					//delay(me.ping + 1);

					return true;
				}

				delay(10);
			}
		}

		return false;
	};

	this.precastCTA = function (force) {
        if (!force && me.getState(States.BATTLEORDERS)) {
			return true;
		}

		if (me.gametype === GameType.Classic || me.classid === ClassID.Barbarian || me.inTown) {
			return false;
		}

        if (this.BOSwitch()) {
            Skill.cast(Skills.Barbarian.Battle_Command, 0); // Battle Command
            Skill.cast(Skills.Barbarian.Battle_Orders, 0); // Battle Orders

            this.BODuration = (20 + me.getSkill(Skills.Barbarian.Battle_Orders, 1) * 10 + (me.getSkill(Skills.Barbarian.Shout, 0) + me.getSkill(Skills.Barbarian.Battle_Command, 0)) * 5) * 1000;
			this.BOTick = getTickCount();

			this.weaponSwitch(Math.abs(this.haveCTA - 1));

			return true;
		}

		return false;
	};

	this.getBetterSlot = function (skillId) {
		var item,
			sumCurr = 0,
			sumSwap = 0;

        switch (skillId) {
            case Skills.Paladin.Holy_Shield: // Holy Shield
			sumCurr = 0;
			sumSwap = 0;
			item = me.getItem();

			if (item) {
                do {
                    if (item.bodylocation === ItemBodyLocation.RIGHT_ARM || item.bodylocation === ItemBodyLocation.LEFT_ARM) {
                        sumCurr += (item.getStat(Stats.item_allskills) + item.getStat(Stats.item_addclassskills, BaseStat.skills) + item.getStat(Stats.item_addskill_tab, BaseStat.pettype) + item.getStat(Stats.item_singleskill, skillId) + item.getStat(Stats.item_nonclassskill, skillId));
					}

                    if (item.bodylocation === ItemBodyLocation.RIGHT_ARM_SECONDARY || item.bodylocation === ItemBodyLocation.LEFT_ARM_SECONDARY) {
                        sumSwap += (item.getStat(Stats.item_allskills) + item.getStat(Stats.item_addclassskills, BaseStat.skills) + item.getStat(Stats.item_addskill_tab, BaseStat.pettype) + item.getStat(Stats.item_singleskill, skillId) + item.getStat(Stats.item_nonclassskill, skillId));
					}
				} while (item.getNext());
			}

            break;
            case Skills.Sorceress.Enchant: // Enchant
			sumCurr = 0;
			sumSwap = 0;
			item = me.getItem();

			if (item) {
				do {
                    if (item.bodylocation === ItemBodyLocation.RIGHT_ARM || item.bodylocation === ItemBodyLocation.LEFT_ARM) {
                        sumCurr += (item.getStat(Stats.item_allskills) + item.getStat(Stats.item_addclassskills, BaseStat.monster_or_npc_stats) + item.getStat(Stats.item_addskill_tab, BaseStat.levels) + item.getStat(Stats.item_singleskill, skillId) + item.getStat(Stats.item_nonclassskill, skillId));
					}

                    if (item.bodylocation === ItemBodyLocation.RIGHT_ARM_SECONDARY || item.bodylocation === ItemBodyLocation.LEFT_ARM_SECONDARY) {
                        sumSwap += (item.getStat(Stats.item_allskills) + item.getStat(Stats.item_addclassskills, BaseStat.monster_or_npc_stats) + item.getStat(Stats.item_addskill_tab, BaseStat.levels) + item.getStat(Stats.item_singleskill, skillId) + item.getStat(Stats.item_nonclassskill, skillId));
					}
				} while (item.getNext());
			}

			break;
		}

		print("ÿc4Precastÿc0: Current " + sumCurr + ", Swap " + sumSwap);

		return sumSwap > sumCurr ? Math.abs(me.weaponswitch - 1) : me.weaponswitch;
	};

	this.precastSkill = function (skillId) {
		var swapped,
			slot = this.getBetterSlot(skillId);

		if (slot !== me.weaponswitch) {
			swapped = true;
		}

		this.weaponSwitch(slot);
		Skill.cast(skillId, 0);

		if (swapped) {
			this.weaponSwitch(Math.abs(slot - 1));
		}

		return true;
	};

	this.doPrecast = function (force) {
		var buffSummons = false;

		// Force BO 15 seconds before it expires
        this.precastCTA(!me.getState(States.BATTLEORDERS) || force || (getTickCount() - this.BOTick >= this.BODuration - 15000));

		switch (me.classid) {
		case ClassID.Amazon: // Amazon
			if (Config.SummonValkyrie) {
                this.summon(Skills.Amazon.Valkyrie); // Valkyrie
                } 

			break;
		case ClassID.Sorceress: // Sorceress
			if (!me.getState(States.THUNDERSTORM) || force) { // ts
                Skill.cast(Skills.Sorceress.Thunder_Storm, 0); // Thunder Storm
			}

			if (!me.getState(States.ENERGYSHIELD) || force) {
				Skill.cast(Skills.Sorceress.Energy_Shield, 0); // Energy Shield
			}

            if ((!me.getState(States.SHIVERARMOR) && !me.getState(States.FROZENARMOR) && !me.getState(States.CHILLINGARMOR)) || force) {
				if (!Skill.cast(Skills.Sorceress.Shiver_Armor, 0)) { // Shiver Armor
                    if (!Skill.cast(Skills.Sorceress.Chilling_Armor, 0)) { // Chilling Armor
                        Skill.cast(Skills.Sorceress.Frozen_Armor, 0); // Frozen Armor
					}
				}
			}

            if (me.getSkill(Skills.Sorceress.Enchant, 0) && (!me.getState(States.ENCHANT) || force)) {
				this.enchant();
			}

			break;
		case ClassID.Necromancer: // Necromancer
                if (!me.getState(States.BONEARMOR) || force) {
                    Skill.cast(Skills.Necromancer.Bone_Armor, 0);
			}

			switch (Config.Golem) {
			case 0:
			case "None":
				break;
			case 1:
			case "Clay":
				this.summon(Skills.Necromancer.Clay_Golem);
				break;
			case 2:
			case "Blood":
                    this.summon(Skills.Necromancer.BloodGolem);
				break;
			case 3:
			case "Fire":
                    this.summon(Skills.Necromancer.FireGolem);
				break;
			}

			break;
		case ClassID.Paladin: // Paladin
                if (!me.getState(States.HOLYSHIELD) || force) {
				this.precastSkill(Skills.Paladin.Holy_Shield); // Holy Shield
			}

			break;
		case ClassID.Barbarian: // Barbarian - TODO: BO duration
                if (!me.getState(States.BATTLEORDERS) || !me.getState(States.BATTLECOMMAND) || !me.getState(States.SHOUT) || force) {
				if (Config.BOSwitch) {
					Precast.weaponSwitch(Config.BOSwitch);
				}

                if (!me.getState(States.BATTLECOMMAND) || force) {
                    Skill.cast(Skills.Barbarian.Battle_Command, 0); // Battle Command
				}

                if (!me.getState(States.BATTLEORDERS) || force) {
					Skill.cast(Skills.Barbarian.Battle_Orders, 0); // Battle Orders
				}

				if (!me.getState(States.SHOUT) || force) {
					Skill.cast(Skills.Barbarian.Shout, 0); // Shout
				}

				if (Config.BOSwitch) {
					Precast.weaponSwitch(Math.abs(Config.BOSwitch - 1));
				}
			}

			break;
		case ClassID.Druid: // Druid
                if (!me.getState(States.CYCLONEARMOR) || force) {
				Skill.cast(Skills.Druid.Cyclone_Armor, 0); // Cyclone Armor
			}

                if (Config.SummonRaven) {
                    this.summon(Skills.Druid.Raven); // Raven
			}

			switch (Config.SummonAnimal) {
			case 1:
            case "Spirit Wolf":
                buffSummons = this.summon(Skills.Druid.Summon_Spirit_Wolf) || buffSummons; // Summon Spirit Wolf

				break;
			case 2:
			case "Dire Wolf":
                    buffSummons = this.summon(Skills.Druid.Summon_Fenris) || buffSummons; // Summon Dire Wolf

				break;
			case 3:
			case "Grizzly":
                    buffSummons = this.summon(Skills.Druid.Summon_Grizzly) || buffSummons; // Summon Grizzly

				break;
			}

			switch (Config.SummonVine) {
			case 1:
			case "Poison Creeper":
                    buffSummons = this.summon(Skills.Druid.Plague_Poppy) || buffSummons; // Poison Creeper

				break;
			case 2:
			case "Carrion Vine":
                    buffSummons = this.summon(Skills.Druid.Cycle_of_Life) || buffSummons; // Carrion Vine

				break;
			case 3:
			case "Solar Creeper":
                    buffSummons = this.summon(Skills.Druid.Vines) || buffSummons; // Solar Creeper

				break;
			}

			switch (Config.SummonSpirit) {
			case 1:
			case "Oak Sage":
                    buffSummons = this.summon(Skills.Druid.Oak_Sage) || buffSummons; // Oak Sage

				break;
			case 2:
			case "Heart of Wolverine":
                    buffSummons = this.summon(Skills.Druid.Heart_of_Wolverine) || buffSummons; // Heart of Wolverine

				break;
			case 3:
			case "Spirit of Barbs":
                    buffSummons = this.summon(Skills.Druid.Spirit_of_Barbs) || buffSummons; // Spirit of Barbs

				break;
			}

            if (!me.getState(States.HURRICANE) || force) {
				Skill.cast(Skills.Druid.Hurricane, 0); // Hurricane
			}

			if (buffSummons) {
				this.precastCTA(force);
			}

			break;
		case ClassID.Assassin: // Assassin
                if (Config.UseFade && (!me.getState(States.FADE) || force)) {
				Skill.cast(Skills.Assassin.Fade, 0); // Fade
			}

                if (Config.UseVenom && (!me.getState(States.VENOMCLAWS) || force)) {
                    Skill.cast(Skills.Assassin.Venom, 0); // Venom
			}

                if (!me.getState(States.BLADESHIELD) || force) {
				Skill.cast(Skills.Assassin.Blade_Shield, 0); // Blade Shield	
			}

                if (!Config.UseFade && Config.UseBoS && (!me.getState(States.QUICKNESS) || force)) {
                    Skill.cast(Skills.Assassin.Quickness, 0); // Burst of Speed
			}

			switch (Config.SummonShadow) {
			case 1:
			case "Warrior":
                    this.summon(Skills.Assassin.Shadow_Warrior); // Shadow Warrior
				break;
			case 2:
			case "Master":
				this.summon(Skills.Assassin.Shadow_Master); // Shadow Master
				break;
			}

			break;
		}
	};

	this.BOSwitch = function () {
		var item;

		if (this.haveCTA < 0) {
            item = me.getItem(-1, ItemModes.Item_equipped_self_or_merc);

			if (item) {
MainLoop:
				do {
					if (item.getPrefix(20519)) { // Call to Arms
                        switch (item.bodylocation) {
                            case ItemBodyLocation.RIGHT_ARM:
                            case ItemBodyLocation.LEFT_ARM:
							this.haveCTA = me.weaponswitch;

							break MainLoop;
                            case ItemBodyLocation.RIGHT_ARM_SECONDARY:
                            case ItemBodyLocation.LEFT_ARM_SECONDARY:
							this.haveCTA = Math.abs(me.weaponswitch - 1);

							break MainLoop;
						}
					}
				} while (item.getNext());
			}
		}

		if (this.haveCTA > -1) {
			return this.weaponSwitch(this.haveCTA);
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
		case Skills.Amazon.Valkyrie: // Valkyrie
			minion = 2;

			break;
		case Skills.Necromancer.Clay_Golem: // Clay Golem
        case Skills.Necromancer.BloodGolem: // Blood Golem
        case Skills.Necromancer.FireGolem: // Fire Golem
			minion = 3;

			break;
		case Skills.Druid.Raven: // Raven
			minion = 10;
            count = Math.min(me.getSkill(Skills.Druid.Raven, 1), 5);

			break;
		case Skills.Druid.Oak_Sage: // Oak Sage
		case Skills.Druid.Heart_of_Wolverine: // Heart of Wolverine
        case Skills.Druid.Spirit_of_Barbs: // Spirit of Barbs
			minion = 13;

			break;
        case Skills.Druid.Plague_Poppy: // Poison Creeper
        case Skills.Druid.Cycle_of_Life: // Carrion Vine
        case Skills.Druid.Vines: // Solar Creeper
			minion = 14;

			break;
        case Skills.Druid.Summon_Spirit_Wolf: // Spirit Wolf
			minion = 11;
            count = Math.min(me.getSkill(Skills.Druid.Summon_Spirit_Wolf, 1), 5);

			break;
        case Skills.Druid.Summon_Fenris: // Dire Wolf
			minion = 12;
            count = Math.min(me.getSkill(Skills.Druid.Summon_Fenris, 1), 3);

			break;
        case Skills.Druid.Summon_Grizzly: // Grizzly
			minion = 15;

			break;
		case Skills.Assassin.Shadow_Warrior: // Shadow Warrior
        case Skills.Assassin.Shadow_Master: // Shadow Master
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
		var unit, swapped,
            slot = this.getBetterSlot(Skills.Sorceress.Enchant),
			chanted = [];

		if (slot !== me.weaponswitch) {
			swapped = true;
		}

		this.weaponSwitch(slot);

		// Player
        unit = getUnit(UnitType.Player);

		if (unit) {
			do {
                if (!unit.dead && Misc.inMyParty(unit.name) && getDistance(me, unit) <= 40) {
                    Skill.cast(Skills.Sorceress.Enchant, 0, unit);
					chanted.push(unit.name);
				}
			} while (unit.getNext());
		}

		// Minion
        unit = getUnit(UnitType.NPC);

		if (unit) {
			do {
				if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && getDistance(me, unit) <= 40) {
					Skill.cast(Skills.Sorceress.Enchant, 0, unit);
				}
			} while (unit.getNext());
		}

		if (swapped) {
			this.weaponSwitch(Math.abs(slot - 1));
		}

		return true;
	};
};