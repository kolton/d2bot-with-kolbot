/**
*	@filename	Misc.js
*	@author		kolton
*	@desc		misc library containing Skill, Misc and Sort classes
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

var Skill = {
	usePvpRange: false,

	getRange: function (skillId) {
		switch (skillId) {
		case Skills.common.Attack: // Normal Attack
			return Attack.usingBow() ? 20 : 3;
        case Skills.Amazon.Jab: // Jab
        case Skills.Amazon.Power_Strike: // Power Strike
        case Skills.Amazon.Impale: // Impale
        case Skills.Amazon.Fend: // Fend
        case Skills.Amazon.Lightning_Strike: // Lightning Strike
        case Skills.Amazon.Poison_Javelin: // Poison Dagger
        case Skills.Paladin.Sacrifice: // Sacrifice
        case Skills.Paladin.Smite: // Smite
        case Skills.Paladin.Zeal: // Zeal
        case Skills.Paladin.Blessed_Hammer: // Blessed Hammer
        case Skills.Paladin.Conversion: // Conversion
        case Skills.Barbarian.Bash: // Bash
        case Skills.Barbarian.Double_Swing: // Double Swing
        case Skills.Barbarian.Stun: // Stun
        case Skills.Barbarian.Concentrate: // Concentrate
        case Skills.Barbarian.Frenzy: // Frenzy
        case Skills.Barbarian.Berserk: // Berserk
        case Skills.Druid.Feral_Rage: // Feral Rage
        case Skills.Druid.Maul: // Maul
        case Skills.Druid.Rabies: // Rabies
        case Skills.Druid.Fire_Claws: // Fire Claws
        case Skills.Druid.Hunger: // Hunger
        case Skills.Druid.Fury: // Fury
        case Skills.Assassin.Dragon_Talon: // Dragon Talon
        case Skills.Assassin.Dragon_Claw: // Dragon Claw
        case Skills.Assassin.Dragon_Tail: // Dragon Tail
			return 3;
        case Skills.Barbarian.Battle_Cry: // Battle Cry
        case Skills.Barbarian.War_Cry: // War Cry
			return 4;
		case Skills.Sorceress.Frost_Nova: // Frost Nova
        case Skills.Druid.Twister: // Twister
        case Skills.Druid.Tornado: // Tornado
		case 500: // Summoner
			return 5;
        case Skills.Sorceress.Charged_Bolt: // Charged Bolt
			return 6;
        case Skills.Sorceress.Nova: // Nova
        case Skills.Barbarian.Whirlwind: // Whirlwind
			return 7;
        case Skills.Necromancer.Poison_Nova: // Poison Nova
			return 8;
        case Skills.Paladin.Holy_Bolt: // Holy Bolt
        case Skills.Paladin.Charge: // Charge
        case Skills.Barbarian.Howl: // Howl
        case Skills.Barbarian.Leap: // Leap
        case Skills.Druid.Firestorm: // Firestorm
        case Skills.Druid.Molten_Boulder: // Molten Boulder
        case Skills.Druid.Arctic_Blast: // Arctic Blast
        case Skills.Druid.Shock_Wave: // Shock Wave
			return 10;
        case Skills.Sorceress.Frozen_Orb: // Frozen Orb
        case Skills.Necromancer.Teeth: // Teeth
        case Skills.Druid.Eruption: // Fissure
        case Skills.Druid.Volcano: // Volcano
        case Skills.Assassin.Fire_Trauma: // Fire Blast
        case Skills.Assassin.Shock_Field: // Shock Web
        case Skills.Assassin.Blade_Sentinel: // Blade Sentinel
        case Skills.Assassin.Blade_Fury: // Blade Fury
			return 15;
        case Skills.Paladin.Fist_of_the_Heavens: // Fist of the Heavens
        case Skills.Assassin.Psychic_Hammer: // Psychic Hammer
        case Skills.Assassin.Dragon_Flight: // Dragon Flight
			return 20;
		// Variable range
        case Skills.Sorceress.Static_Field: // Static Field
            if (me.gametype === GameType.Expansion) {
				return Math.floor((me.getSkill(Skills.Sorceress.Static_Field, 1) + 4) * 2 / 3);
			}

			return 20;
        case Skills.Sorceress.Lightning: // Lightning
        case Skills.Necromancer.Bone_Spear: // Bone Spear
        case Skills.Necromancer.Bone_Spirit: // Bone Spirit
			if (this.usePvpRange) {
				return 40;
			}

            return 15;
        case Skills.Amazon.Charged_Strike: // Charged Strike
        case Skills.Sorceress.Fire_Ball:
        case Skills.Sorceress.Fire_Wall:
        case Skills.Sorceress.Chain_Lightning:
        case Skills.Sorceress.Meteor:
        case Skills.Sorceress.Blizzard:
        case Skills.Assassin.Mind_Blast: // Mind Blast
			if (this.usePvpRange) {
				return 40;
			}

			return 20;
		}

		// Every other skill
		if (this.usePvpRange) {
			return 40;
		}

		return 20;
	},

	getHand: function (skillId) {
        switch (skillId) {
            case Skills.Amazon.Magic_Arrow:
            case Skills.Amazon.Fire_Arrow:
            case Skills.Amazon.Critical_Strike:
            case Skills.Amazon.Jab:
            case Skills.Amazon.Cold_Arrow:
            case Skills.Amazon.Multiple_Shot:
            case Skills.Amazon.Dodge:
            case Skills.Amazon.Power_Strike:
            case Skills.Amazon.Poison_Javelin:
            case Skills.Amazon.Exploding_Arrow:
            case Skills.Amazon.Avoid:
            case Skills.Amazon.Impale:
            case Skills.Amazon.Lightning_Bolt:
            case Skills.Amazon.Ice_Arrow:
            case Skills.Amazon.Guided_Arrow:
            case Skills.Amazon.Penetrate:
            case Skills.Amazon.Charged_Strike:
            case Skills.Amazon.Plague_Javelin:
            case Skills.Amazon.Strafe:
            case Skills.Amazon.Immolation_Arrow:
            case Skills.Amazon.Evade:
            case Skills.Amazon.Fend:
            case Skills.Amazon.Freezing_Arrow:
            case Skills.Amazon.Pierce:
            case Skills.Amazon.Lightning_Strike:
            case Skills.Amazon.Lightning_Fury:
            case Skills.Sorceress.Fire_Bolt:
            case Skills.Sorceress.Warmth:
            case Skills.Sorceress.Charged_Bolt:
            case Skills.Sorceress.Ice_Bolt:
            case Skills.Sorceress.Inferno:
            case Skills.Sorceress.Ice_Blast:
            case Skills.Sorceress.Fire_Ball:
            case Skills.Sorceress.Lightning:
            case Skills.Sorceress.Chain_Lightning:
            case Skills.Sorceress.Glacial_Spike:
            case Skills.Sorceress.Fire_Mastery:
            case Skills.Sorceress.Lightning_Mastery:
            case Skills.Sorceress.Frozen_Orb:
            case Skills.Sorceress.Cold_Mastery:
            case Skills.Necromancer.Teeth:
            case Skills.Necromancer.Poison_Dagger:
            case Skills.Necromancer.Golem_Mastery:
            case Skills.Necromancer.Bone_Spear:
            case Skills.Necromancer.Summon_Resist:
            case Skills.Necromancer.Bone_Spirit:
            case Skills.Paladin.Holy_Bolt:
            case Skills.Paladin.Charge:
            case Skills.Paladin.Vengeance:
            case Skills.Paladin.Blessed_Hammer:
            case Skills.Paladin.Fist_of_the_Heavens:
            case Skills.Barbarian.Leap:
            case Skills.Barbarian.Double_Throw:
            case Skills.Barbarian.Leap_Attack:
            case Skills.Barbarian.Whirlwind:
            case Skills.Druid.Firestorm:
            case Skills.Druid.Molten_Boulder:
            case Skills.Druid.Arctic_Blast:
            case Skills.Druid.Twister:
            case Skills.Druid.Shock_Wave:
            case Skills.Druid.Tornado:
            case Skills.Assassin.Fire_Trauma:
            case Skills.Assassin.Tiger_Strike:
            case Skills.Assassin.Shock_Field:
            case Skills.Assassin.Blade_Sentinel:
            case Skills.Assassin.Fists_of_Fire:
            case Skills.Assassin.Weapon_Block:
            case Skills.Assassin.Cobra_Strike:
            case Skills.Assassin.Blade_Fury:
            case Skills.Assassin.Claws_of_Thunder:
            case Skills.Assassin.Blades_of_Ice:
            case Skills.Assassin.Dragon_Flight:
                return 1;
            case Skills.common.Attack: // Normal Attack
            case Skills.Paladin.Sacrifice: // Sacrifice
            case Skills.Paladin.Smite: // Smite
            case Skills.Paladin.Zeal: // Zeal
            case Skills.Paladin.Conversion: // Conversion
            case Skills.Barbarian.Bash: // Bash
            case Skills.Barbarian.Double_Swing: // Double Swing
            case Skills.Barbarian.Stun: // Stun
            case Skills.Barbarian.Concentrate: // Concentrate
            case Skills.Barbarian.Frenzy: // Frenzy
            case Skills.Barbarian.Berserk: // Berserk
            case Skills.Druid.Feral_Rage: // Feral Rage
            case Skills.Druid.Maul: // Maul
            case Skills.Druid.Rabies: // Rabies
            case Skills.Druid.Fire_Claws: // Fire Claws
            case Skills.Druid.Hunger: // Hunger
            case Skills.Druid.Fury: // Fury
            case Skills.Assassin.Dragon_Talon: // Dragon Talon
            case Skills.Assassin.Dragon_Claw: // Dragon Claw
            case Skills.Assassin.Dragon_Tail: // Dragon Tail
                return 2; // Shift bypass
        }

		// Every other skill
		return 0;
	},

	charges: [],

	// Cast a skill on self, Unit or coords
	cast: function (skillId, hand, x, y) {
		if (me.inTown && !this.townSkill(skillId)) {
			return false;
		}

		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (!this.wereFormCheck(skillId)) {
			return false;
		}

		// No mana to cast
		if (this.getManaCost(skillId) > me.mp) {
			// Maybe delay on ALL skills that we don't have enough mana for?
			if (Config.AttackSkill.concat([Skills.Sorceress.Static_Field, Skills.Sorceress.Teleport]).concat(Config.LowManaSkill).indexOf(skillId) > -1) {
				delay(300);
			}

			return false;
		}

		if (skillId === undefined) {
			throw new Error("Skill.cast: Must supply a skill ID");
		}

		var i, n, clickType, shift;

		if (hand === undefined) {
			hand = 0;
		}

		if (x === undefined) {
			x = me.x;
		}

		if (y === undefined) {
			y = me.y;
		}

		if (!this.setSkill(skillId, hand)) {
			return false;
		}

		if (Config.PacketCasting > 1) {
			switch (typeof x) {
			case "number":
				Packet.castSkill(hand, x, y);
				delay(250);

				break;
			case "object":
				Packet.unitCast(hand, x);
				delay(250);

				break;
			}
		} else {
			switch (hand) {
			case 0: // Right hand + No Shift
				clickType = 3;
				shift = 0;

				break;
			case 1: // Left hand + Shift
				clickType = 0;
				shift = 1;

				break;
			case 2: // Left hand + No Shift
				clickType = 0;
				shift = 0;

				break;
			case 3: // Right hand + Shift
				clickType = 3;
				shift = 1;

				break;
			}

MainLoop:
			for (n = 0; n < 3; n += 1) {
				if (typeof x === "object") {
					clickMap(clickType, shift, x);
				} else {
					clickMap(clickType, shift, x, y);
				}

				delay(20);

				if (typeof x === "object") {
					clickMap(clickType + 2, shift, x);
				} else {
					clickMap(clickType + 2, shift, x, y);
				}

				for (i = 0; i < 8; i += 1) {
					if (me.attacking) {
						break MainLoop;
					}

					delay(20);
				}
			}

			while (me.attacking) {
				delay(10);
			}
		}

		if (this.isTimed(skillId)) { // account for lag, state 121 doesn't kick in immediately
			for (i = 0; i < 10; i += 1) {
				if ([4, 9].indexOf(me.mode) > -1) {
					break;
				}

                if (me.getState(States.SKILLDELAY)) {
					break;
				}

				delay(10);
			}
		}

		return true;
	},

	// Put a skill on desired slot
	setSkill: function (skillId, hand) {
		// Check if the skill is already set
        if (me.getSkill(hand === 0 ? Skills.common.Throw : Skills.common.Unsummon) === skillId) {
			return true;
		}

		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		if (hand === undefined || hand === 3) {
			hand = 0;
		}

		var charge = this.getCharge(skillId);

		if (!!charge) {
			// charge.charges is a cached value from Attack.getCharges
			/*if (charge.charges > 0 && me.setSkill(skillId, hand, charge.unit)) {
				return true;
			}*/

			return false;
		}

		if (me.setSkill(skillId, hand)) {
			return true;
		}

		return false;
	},

	// Charged skill
	getCharge: function (skillId) {
		var i;

		for (i = 0; i < this.charges.length; i += 1) {
			if (this.charges[i].skill === skillId && me.getSkill(skillId, 0) === this.charges[i].level && me.getSkill(skillId, 0) === me.getSkill(skillId, 1)) {
				return this.charges[i];
			}
		}

		return false;
	},

	// Timed skills
    isTimed: function (skillId) {
        return [Skills.Amazon.Poison_Javelin, Skills.Amazon.Plague_Javelin, Skills.Amazon.Immolation_Arrow,
            Skills.Sorceress.Fire_Wall, Skills.Sorceress.Meteor, Skills.Sorceress.Blizzard, Skills.Sorceress.Hydra, Skills.Sorceress.Frozen_Orb,
            Skills.Paladin.Fist_of_the_Heavens,
            Skills.Druid.Firestorm, Skills.Druid.Wearwolf, Skills.Druid.Wearbear, Skills.Druid.Molten_Boulder, Skills.Druid.Eruption, Skills.Druid.Volcano, Skills.Druid.Summon_Grizzly, Skills.Druid.Armageddon, Skills.Druid.Hurricane,
            Skills.Assassin.Shock_Field, Skills.Assassin.Shadow_Warrior, Skills.Assassin.Dragon_Flight, Skills.Assassin.Blade_Shield, Skills.Assassin.Shadow_Master]
            .indexOf(skillId) > -1;
	},

	// Wereform skill check
	wereFormCheck: function (skillId) {
		if (!me.getState(States.WOLF) && !me.getState(States.BEAR)) {
			return true;
		}

        // Can be cast by both
        if ([Skills.common.Attack, Skills.common.Kick, Skills.Druid.Raven, Skills.Druid.Plague_Poppy, Skills.Druid.Oak_Sage, Skills.Druid.Summon_Spirit_Wolf, Skills.Druid.Cycle_of_Life, Skills.Druid.Heart_of_Wolverine,
            Skills.Druid.Summon_Fenris, Skills.Druid.Fire_Claws, Skills.Druid.Vines, Skills.Druid.Hunger, Skills.Druid.Spirit_of_Barbs, Skills.Druid.Summon_Grizzly, Skills.Druid.Armageddon].indexOf(skillId) > -1) {
			return true;
		}

		// Can be cast by werewolf only
        if (me.getState(States.WOLF) && [Skills.Druid.Wearwolf, Skills.Druid.Feral_Rage, Skills.Druid.Rabies, Skills.Druid.Fury].indexOf(skillId) > -1) {
			return true;
		}

		// Can be cast by werebear only
        if (me.getState(States.BEAR) && [Skills.Druid.Wearbear, Skills.Druid.Maul, Skills.Druid.Shock_Wave].indexOf(skillId) > -1) {
			return true;
		}

		return false;
	},

	// Skills that cn be cast in town
    townSkill: function (skillId) {
        return [Skills.Amazon.Valkyrie, Skills.Sorceress.Frozen_Armor, Skills.Sorceress.Telekinesis, Skills.Sorceress.Shiver_Armor, Skills.Sorceress.Enchant, Skills.Sorceress.Energy_Shield,
            Skills.Sorceress.Chilling_Armor, Skills.Necromancer.Bone_Armor, Skills.Necromancer.Clay_Golem, Skills.Necromancer.BloodGolem, Skills.Necromancer.FireGolem, Skills.Paladin.Holy_Shield,
            Skills.Druid.Raven, Skills.Druid.Plague_Poppy, Skills.Druid.Oak_Sage, Skills.Druid.Summon_Spirit_Wolf, Skills.Druid.Cyclone_Armor, Skills.Druid.Heart_of_Wolverine,
            Skills.Druid.Summon_Fenris, Skills.Druid.Spirit_of_Barbs, Skills.Druid.Summon_Grizzly, Skills.Assassin.Quickness, Skills.Assassin.Fade, Skills.Assassin.Shadow_Warrior,
            Skills.Assassin.Blade_Shield, Skills.Assassin.Venom, Skills.Assassin.Shadow_Master].indexOf(skillId) > -1;
	},

	manaCostList: {},

	// Get mana cost of the skill (mBot)
	getManaCost: function (skillId) {
		if (skillId < 6) {
			return 0;
		}

		if (this.manaCostList.hasOwnProperty(skillId)) {
			return this.manaCostList[skillId];
		}

		var skillLvl = me.getSkill(skillId, 1),
			effectiveShift = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
            lvlmana = getBaseStat(BaseStat.skills, skillId, "lvlmana") === 65535 ? -1 : getBaseStat(BaseStat.skills, skillId, "lvlmana"), // Correction for skills that need less mana with levels (kolton)
            ret = Math.max((getBaseStat(BaseStat.skills, skillId, "mana") + lvlmana * (skillLvl - 1)) * (effectiveShift[getBaseStat(BaseStat.skills, skillId, "manashift")] / 256), getBaseStat(3, skillId, "minmana"));

		if (!this.manaCostList.hasOwnProperty(skillId)) {
			this.manaCostList[skillId] = ret;
		}

		return ret;
	}
};

var Item = {
	hasTier: function (item) {
		return Config.AutoEquip && NTIP.GetTier(item) > 0;
	},

	canEquip: function (item) {
        if (item.type !== NTItemTypes.gold) { // Not an item
			return false;
		}

        if (!item.getFlag(ItemFlags.isIdentified)) { // Unid item
			return false;
		}

        if (item.getStat(Stats.item_levelreq) > me.getStat(Stats.level) || item.dexreq > me.getStat(Stats.dexterity) || item.strreq > me.getStat(Stats.strength)) { // Higher requirements
			return false;
		}

		return true;
	},

	// Equips an item and throws away the old equipped item
	equip: function (item, bodyLoc) {
		if (!this.canEquip(item)) {
			return false;
		}

        // Already equipped in the right slot
        if (item.mode === ItemModes.Item_equipped_self_or_merc && item.bodylocation === bodyLoc) {
			return true;
		}

		var i, cursorItem;

        if (item.location === ItemLocation.Stash) {
			if (!Town.openStash()) {
				return false;
			}
		}

		for (i = 0; i < 3; i += 1) {
			if (item.toCursor()) {
				clickItem(0, bodyLoc);
				delay(me.ping * 2 + 500);

				if (item.bodylocation === bodyLoc) {
					if (getCursorType() === 3) {
						//Misc.click(0, 0, me);

						cursorItem = getUnit(100);

						if (cursorItem && Pickit.checkItem(cursorItem).result > 0 && (NTIP.GetTier(cursorItem) < 1 || NTIP.GetTier(cursorItem) > 99)) {
							if (Storage.Inventory.CanFit(cursorItem)) {
								Storage.Inventory.MoveTo(cursorItem);
							}
						}
					}

					return true;
				}
			}
		}

		return false;
	},

	getEquippedItem: function (bodyLoc) {
		var item = me.getItem();

		if (item) {
			do {
				if (item.bodylocation === bodyLoc) {
					return {
						classid: item.classid,
						tier: NTIP.GetTier(item)
					};
				}
			} while (item.getNext());
		}

		// Don't have anything equipped in there
		return {
			classid: -1,
			tier: -1
		};
	},

	getBodyLoc: function (item) {
		var bodyLoc;

        switch (item.itemType) {
            case NTItemTypes.shield: // Shield
            case NTItemTypes.auricshields: // Auric Shields
                bodyLoc = ItemBodyLocation.LEFT_ARM;

			break;
            case NTItemTypes.armor: // Armor
                bodyLoc = ItemBodyLocation.TORSO;

			break;
            case NTItemTypes.bowquiver: // Arrows
            case NTItemTypes.crossbowquiver: // Bolts
                bodyLoc = ItemBodyLocation.LEFT_ARM;

			break;
            case NTItemTypes.ring: // Ring
                bodyLoc = [ItemBodyLocation.RIGHT_RING, ItemBodyLocation.LEFT_RING];

			break;
            case NTItemTypes.amulet: // Amulet
                bodyLoc = ItemBodyLocation.NECK;

			break;
            case NTItemTypes.boots: // Boots
                bodyLoc = ItemBodyLocation.FEET;

			break;
            case NTItemTypes.gloves: // Gloves
                bodyLoc = ItemBodyLocation.GLOVES;

			break;
            case NTItemTypes.belt: // Belt
                bodyLoc = ItemBodyLocation.BELT;

			break;
            case NTItemTypes.helm: // Helm
            case NTItemTypes.primalhelm: // Barb Helm
            case NTItemTypes.circlet: // Circlet
                bodyLoc = ItemBodyLocation.HEAD;

			break;
            case NTItemTypes.scepter: // 
            case NTItemTypes.wand: // 
            case NTItemTypes.staff: // 
            case NTItemTypes.bow: // 
            case NTItemTypes.axe: // 
            case NTItemTypes.club: // 
            case NTItemTypes.sword: // 
            case NTItemTypes.hammer: // 
            case NTItemTypes.knife: // 
            case NTItemTypes.spear: // 
            case NTItemTypes.polearm: // 
            case NTItemTypes.crossbow: // 
            case NTItemTypes.mace: // 
            case NTItemTypes.throwingknife: // 
            case NTItemTypes.throwingaxe: // 
            case NTItemTypes.javelin: // 
            case NTItemTypes.handtohand: // Handtohand (Assasin Claw)
            case NTItemTypes.orb: // 
            case NTItemTypes.voodooheads: // 
            case NTItemTypes.pelt: // 
            case NTItemTypes.amazonbow: // 
            case NTItemTypes.amazonspear: // 
            case NTItemTypes.amazonjavelin: // 
            case NTItemTypes.assassinclaw: // 
                bodyLoc = ItemBodyLocation.RIGHT_ARM;

			break;
		default:
			return false;
		}

		if (typeof bodyLoc === "number") {
			bodyLoc = [bodyLoc];
		}

		return bodyLoc;
	},

	autoEquipCheck: function (item) {
		if (!Config.AutoEquip) {
			return true;
		}

		var i,
			tier = NTIP.GetTier(item),
			bodyLoc = this.getBodyLoc(item);

		if (tier > 0 && bodyLoc) {
			for (i = 0; i < bodyLoc.length; i += 1) {
                // Low tier items shouldn't be kept if they can't be equipped
                if (tier > this.getEquippedItem(bodyLoc[i]).tier && (this.canEquip(item) || !item.getFlag(ItemFlags.isIdentified))) {
					return true;
				}
			}
		}

		// Sell/ignore low tier items, keep high tier
		if (tier > 0 && tier < 100) {
			return false;
		}

		return true;
	},

	// returns true if the item should be kept+logged, false if not
	autoEquip: function () {
		if (!Config.AutoEquip) {
			return true;
		}

		var i, j, tier, bodyLoc, tome, gid,
			items = me.findItems(-1, 0);

		if (!items) {
			return false;
		}

		function sortEq(a, b) {
			if (Item.canEquip(a)) {
				return -1;
			}

			if (Item.canEquip(b)) {
				return 1;
			}

			return 0;
		}

		me.cancel();

		// Remove items without tier
		for (i = 0; i < items.length; i += 1) {
			if (NTIP.GetTier(items[i]) === 0) {
				items.splice(i, 1);

				i -= 1;
			}
		}

		while (items.length > 0) {
			items.sort(sortEq);

			tier = NTIP.GetTier(items[0]);
			bodyLoc = this.getBodyLoc(items[0]);

			if (tier > 0 && bodyLoc) {
                for (j = 0; j < bodyLoc.length; j += 1) {
                    if ([3, 7].indexOf(items[0].location) > -1 && tier > this.getEquippedItem(bodyLoc[j]).tier && this.getEquippedItem(bodyLoc[j]).classid !== ItemClassIds.Khalims_Will) { // khalim's will adjustment
                        if (!items[0].getFlag(ItemFlags.isIdentified)) { // unid
                            tome = me.findItem(ItemClassIds.Tome_Of_Identify, 0, ItemLocation.Inventory);

                            if (tome && tome.getStat(Stats.quantity) > 0) {
                                if (items[0].location === ItemLocation.Stash) {
									Town.openStash();
								}

								Town.identifyItem(items[0], tome);
							}
						}

						gid = items[0].gid;

						print(items[0].name);

						if (this.equip(items[0], bodyLoc[j])) {
							Misc.logItem("Equipped", me.getItem(-1, -1, gid));
						}

						break;
					}
				}
			}

			items.shift();
		}

		return true;
	}
};

var Misc = {
	// Click something
	click: function (button, shift, x, y) {
		if (arguments.length < 2) {
			throw new Error("Misc.click: Needs at least 2 arguments.");
		}

		while (!me.gameReady) {
			delay(100);
		}

		switch (arguments.length) {
		case 2:
			clickMap(button, shift, me.x, me.y);
			delay(20);
			clickMap(button + 2, shift, me.x, me.y);

			break;
		case 3:
			if (typeof (x) !== "object") {
				throw new Error("Misc.click: Third arg must be a Unit.");
			}

			clickMap(button, shift, x);
			delay(20);
			clickMap(button + 2, shift, x);

			break;
		case 4:
			clickMap(button, shift, x, y);
			delay(20);
			clickMap(button + 2, shift, x, y);

			break;
		}

		return true;
	},

	// Check if a player is in your party
	inMyParty: function (name) {
		if (me.name === name) {
			return true;
		}

		while (!me.gameReady) {
			delay(100);
		}

		var player, myPartyId;

		try {
			player = getParty();

			if (!player) {
				return false;
			}

			myPartyId = player.partyid;
			player = getParty(name); // May throw an error

			if (player && player.partyid !== 65535 && player.partyid === myPartyId) {
				return true;
			}
		} catch (e) {
			player = getParty();

			if (player) {
				myPartyId = player.partyid;

				while (player.getNext()) {
					if (player.partyid !== 65535 && player.partyid === myPartyId) {
						return true;
					}
				}
			}
		}

		return false;
	},

	// Get number of players within getUnit distance
	getNearbyPlayerCount: function () {
		var count = 0,
            player = getUnit(UnitType.Player);

		if (player) {
			do {
				if (!player.dead) {
					count += 1;
				}
			} while (player.getNext());
		}

		return count;
	},

	// Get total number of players in game
	getPlayerCount: function () {
		var count = 0,
			party = getParty();

		if (party) {
			do {
				count += 1;
			} while (party.getNext());
		}

		return count;
	},

	// Open a chest Unit
	openChest: function (unit) {
		// Skip invalid and Countess chests
		if (!unit || unit.x === 12526 || unit.x === 12565) {
			return false;
		}

		// already open
		if (unit.mode) {
			return true;
		}

        // locked chest, no keys
        if (me.classid !== ClassID.Assassin && unit.islocked && !me.findItem(ItemClassIds.Key, ItemModes.Item_In_Inventory_Stash_Cube_Or_Store, ItemLocation.Inventory)) {
			return false;
		}

		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (Pather.moveTo(unit.x + 1, unit.y + 2, 3) && getDistance(me, unit.x + 1, unit.y + 2) < 5) {
				//Misc.click(0, 0, unit);
				sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (unit.mode) {
					return true;
				}

				delay(10);
			}
		}

		if (!me.idle) {
			Misc.click(0, 0, me.x, me.y); // Click to stop walking in case we got stuck
		}

		return false;
	},

	// Open all chests that have preset units in an area
	openChestsInArea: function (area, chestIds) {
		var i, coords, presetUnits;

		if (!area) {
			area = me.area;
		}

		// testing
		if (area !== me.area) {
			Pather.journeyTo(area);
		}

		coords = [];
        presetUnits = getPresetUnits(area, UnitType.Object);

		if (!chestIds) {
			chestIds = [
				5, 6, 87, 104, 105, 106, 107, 143, 140, 141, 144, 146, 147, 148, 176, 177, 181, 183, 198, 240, 241,
				242, 243, 329, 330, 331, 332, 333, 334, 335, 336, 354, 355, 356, 371, 387, 389, 390, 391, 397, 405,
				406, 407, 413, 420, 424, 425, 430, 431, 432, 433, 454, 455, 501, 502, 504, 505, 580, 581
			];
		}

		if (!presetUnits) {
			return false;
		}

		while (presetUnits.length > 0) {
			if (chestIds.indexOf(presetUnits[0].id) > -1) {
				coords.push({
					x: presetUnits[0].roomx * 5 + presetUnits[0].x,
					y: presetUnits[0].roomy * 5 + presetUnits[0].y
				});
			}

			presetUnits.shift();
		}

		while (coords.length) {
			coords.sort(Sort.units);
			Pather.moveToUnit(coords[0], 1, 2);
			this.openChests(20);

			for (i = 0; i < coords.length; i += 1) {
				if (getDistance(coords[i].x, coords[i].y, coords[0].x, coords[0].y) < 20) {
					coords.shift();
				}
			}
		}

		return true;
	},

	openChests: function (range) {
		var unit,
			unitList = [],
			containers = ["chest", "chest3", "armorstand", "weaponrack"];

		if (!range) {
			range = 15;
		}

		// Testing all container code
		if (Config.OpenChests === 2) {
			containers = [
				"chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
				"tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
				"cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
				"woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
				"icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"
			];
		}

        unit = getUnit(UnitType.Object);

		if (unit) {
			do {
                if (unit.name && unit.mode === ObjectModes.Neutral && getDistance(me.x, me.y, unit.x, unit.y) <= range && containers.indexOf(unit.name.toLowerCase()) > -1) {
					unitList.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (unitList.length > 0) {
			unitList.sort(Sort.units);

			unit = unitList.shift();

			if (unit && (Pather.useTeleport || !checkCollision(me, unit, 0x4)) && this.openChest(unit)) {
				Pickit.pickItems();
			}
		}

		return true;
	},

	shrineStates: false,

	scanShrines: function (range) {
		if (!Config.ScanShrines.length) {
			return false;
		}

		if (!range) {
			range = Pather.useTeleport ? 25 : 15;
		}

		var i, j, shrine,
			index  = -1,
			shrineList = [];

		// Initiate shrine states
		if (!this.shrineStates) {
			this.shrineStates = [];

			for (i = 0; i < Config.ScanShrines.length; i += 1) {
                switch (Config.ScanShrines[i]) {
                    case Shrines.null: // None
				    case Shrines.refilling: // Refilling
				    case Shrines.health: // Health
				    case Shrines.mana: // Mana
				    case Shrines.health_exchange: // Health Exchange (doesn't exist)
				    case Shrines.mana_exchange: // Mana Exchange (doesn't exist)
				    case Shrines.enirhs: // Enirhs (doesn't exist)
				    case Shrines.portal: // Portal
				    case Shrines.gem: // Gem
				    case Shrines.fire: // Fire
				    case Shrines.monster: // Monster
				    case Shrines.exploding: // Exploding
                    case Shrines.poison: // Poison
				    	this.shrineStates[i] = 0; // no state

				    	break;
				    case Shrines.armor: // Armor
				    case Shrines.combat: // Combat
				    case Shrines.resist_fire: // Resist Fire
				    case Shrines.resist_cold: // Resist Cold
				    case Shrines.resist_lightning: // Resist Lightning
				    case Shrines.resist_poison: // Resist Poison
				    case Shrines.skill: // Skill
				    case Shrines.mana_recharge: // Mana recharge
				    case Shrines.stamina: // Stamina
                    case Shrines.experience: // Experience
				    	// Both states and shrines are arranged in same order with armor shrine starting at 128
				    	this.shrineStates[i] = Config.ScanShrines[i] + 122;

				    	break;
				}
			}
		}

        shrine = getUnit(UnitType.Object, "shrine");

		if (shrine) {
			// Build a list of nearby shrines
			do {
                if (shrine.mode === ObjectModes.Neutral && getDistance(me.x, me.y, shrine.x, shrine.y) <= range) {
					shrineList.push(copyUnit(shrine));
				}
			} while (shrine.getNext());

			// Check if we have a shrine state, store its index if yes
			for (i = 0; i < this.shrineStates.length; i += 1) {
				if (me.getState(this.shrineStates[i])) {
					index = i;

					break;
				}
			}

			for (i = 0; i < Config.ScanShrines.length; i += 1) {
				for (j = 0; j < shrineList.length; j += 1) {
					// Get the shrine if we have no active state or to refresh current state or if the shrine has no state
					// Don't override shrine state with a lesser priority shrine
					if (index === -1 || i <= index || this.shrineStates[i] === 0) {
						if (shrineList[j].objtype === Config.ScanShrines[i] && (Pather.useTeleport || !checkCollision(me, shrineList[j], 0x4))) {
							this.getShrine(shrineList[j]);

							// Gem shrine - pick gem
							if (Config.ScanShrines[i] === Shrines.gem) {
								Pickit.pickItems();
							}
						}
					}
				}
			}
		}

		return true;
	},

	// Use a shrine Unit
	getShrine: function (unit) {
		if (unit.mode) {
			return false;
		}

		var i, tick;

		for (i = 0; i < 3; i += 1) {
			if (getDistance(me, unit) < 4 || Pather.moveToUnit(unit, 3, 0)) {
				Misc.click(0, 0, unit);
				//unit.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (unit.mode) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Check all shrines in area and get the first one of specified type
	getShrinesInArea: function (area, type, use) {
		var i, coords, shrine,
			shrineLocs = [],
			shrineIds = [2, 81, 83],
			unit = getPresetUnits(area);

		if (unit) {
			for (i = 0; i < unit.length; i += 1) {
				if (shrineIds.indexOf(unit[i].id) > -1) {
					shrineLocs.push([unit[i].roomx * 5 + unit[i].x, unit[i].roomy * 5 + unit[i].y]);
				}
			}
		}

		while (shrineLocs.length > 0) {
			shrineLocs.sort(Sort.points);

			coords = shrineLocs.shift();

			Pather.moveTo(coords[0], coords[1], 2);

            shrine = getUnit(UnitType.Object, "shrine");

			if (shrine) {
				do {
                    if (shrine.objtype === type && shrine.mode === ObjectModes.Neutral) {
						Pather.moveTo(shrine.x - 2, shrine.y - 2);

						if (!use || this.getShrine(shrine)) {
							return true;
						}
					}
				} while (shrine.getNext());
			}
		}

		return false;
	},

	getItemDesc: function (unit) {
		var i, desc,
			stringColor = "";

		desc = unit.description;

		if (!desc) {
			return "";
		}

		desc = desc.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
				desc.splice(i, 1);

				i -= 1;
			} else {
				if (desc[i].match(/^(y|ÿ)c/)) {
					stringColor = desc[i].substring(0, 3);
				} else {
					desc[i] = stringColor + desc[i];
				}
			}

			desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<;.*])/g, "\\xffc$2");
		}

		if (desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\n");

		return desc;
	},

	getItemSockets: function (unit) {
		var i, code,
            sockets = unit.getStat(Stats.item_numsockets),
			subItems = unit.getItems(),
			tempArray = [];

		if (subItems) {
			switch (unit.sizex) {
			case 2:
				switch (unit.sizey) {
				case 3: // 2 x 3
					switch (sockets) {
					case 4:
						tempArray = [subItems[0], subItems[3], subItems[2], subItems[1]];

						break;
					case 5:
						tempArray = [subItems[1], subItems[4], subItems[0], subItems[3], subItems[2]];

						break;
					case 6:
						tempArray = [subItems[0], subItems[3], subItems[1], subItems[4], subItems[2], subItems[5]];

						break;
					}

					break;
				case 4: // 2 x 4
					switch (sockets) {
					case 5:
						tempArray = [subItems[1], subItems[4], subItems[0], subItems[3], subItems[2]];

						break;
					case 6:
						tempArray = [subItems[0], subItems[3], subItems[1], subItems[4], subItems[2], subItems[5]];

						break;
					}

					break;
				}

				break;
			}

			if (tempArray.length === 0 && subItems.length > 0) {
				tempArray = subItems.slice(0);
			}
		}

		for (i = 0; i < sockets; i += 1) {
			if (tempArray[i]) {
				code = tempArray[i].code;

                if ([NTItemTypes.ring, NTItemTypes.amulet, NTItemTypes.jewel, NTItemTypes.smallcharm, NTItemTypes.mediumcharm, NTItemTypes.largecharm].indexOf(tempArray[i].itemType) > -1) {
					code += (tempArray[i].gfx + 1);
				}
			} else {
				code = "gemsocket";
			}

			tempArray[i] = code;
		}

		return tempArray;
	},

	useItemLog: true, // Might be a bit dirty

	itemLogger: function (action, unit, text) {
		if (!Config.ItemInfo || !this.useItemLog) {
			return false;
		}

		var desc,
			date = new Date(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds(),
			dateString = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "]";

		switch (action) {
		case "Sold":
			if (Config.ItemInfoQuality.indexOf(unit.quality) === -1) {
				return false;
			}

			desc = this.getItemDesc(unit).split("\n").join(" | ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		case "Kept":
		case "Field Kept":
		case "Runeword Kept":
		case "Cubing Kept":
		case "Shopped":
		case "Gambled":
		case "Dropped":
			desc = this.getItemDesc(unit).split("\n").join(" | ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		case "No room for":
			desc = unit.name;

			break;
		default:
			desc = unit.fname.split("\n").reverse().join(" ").replace(/(\\xff|ÿ)c[0-9!"+<;.*]/gi, "").trim();

			break;
		}

		return this.fileAction("logs/ItemLog.txt", 2, dateString + " <" + me.profile + "> <" + action + "> (" + Pickit.itemQualityToName(unit.quality) + ") " + desc + (text ? " {" + text + "}" : "") + "\n");
	},

	// Log kept item stats in the manager.
	logItem: function (action, unit, keptLine) {
		if (!this.useItemLog) {
			return false;
		}

		var i, lastArea, code, desc, sock, itemObj,
			color = -1,
			name = unit.fname.split("\n").reverse().join(" ").replace(/ÿc[0-9!"+<;.*]/, "").trim();

		desc = this.getItemDesc(unit);
		color = unit.getColor();

		if (action.match("kept", "i")) {
			lastArea = DataFile.getStats().lastArea;

			if (lastArea) {
				desc += ("\n\\xffc0Area: " + lastArea);
			}
		}

        if (unit.getFlag(ItemFlags.isIdentified)) {
			switch (unit.quality) {
                case ItemQuality.Set: // Set
                    switch (unit.classid) {
                        case ItemClassIds.Sabre: // Angelic sabre
                            code = "inv9sbu";

                            break;
                        case ItemClassIds.Short_War_Bow: // Arctic short war bow
                            code = "invswbu";

                            break;
                        case ItemClassIds.Helm: // Berserker's helm
                            code = "invhlmu";

                            break;
                        case ItemClassIds.Large_Shield: // Civerb's large shield
                            code = "invlrgu";

                            break;
                        case ItemClassIds.Long_Sword: // Cleglaw's long sword
                        case ItemClassIds.Cryptic_Sword: // Szabi's cryptic sword
                            code = "invlsdu";

                            break;
                        case ItemClassIds.Small_Shield: // Cleglaw's small shield
                            code = "invsmlu";

                            break;
                        case ItemClassIds.Buckler: // Hsaru's buckler
                            code = "invbucu";

                            break;
                        case ItemClassIds.Cap: // Infernal cap / Sander's cap
                            code = "invcapu";

                            break;
                        case ItemClassIds.Broad_Sword: // Isenhart's broad sword
                            code = "invbsdu";

                            break;
                        case ItemClassIds.Full_Helm: // Isenhart's full helm
                            code = "invfhlu";

                            break;
                        case ItemClassIds.Gothic_Shield: // Isenhart's gothic shield
                            code = "invgtsu";

                            break;
                        case ItemClassIds.Ancient_Armor: // Milabrega's ancient armor
                        case ItemClassIds.Sacred_Armor: // Immortal King's sacred armor
                            code = "invaaru";

                            break;
                        case ItemClassIds.Kite_Shield: // Milabrega's kite shield
                            code = "invkitu";

                            break;
                        case ItemClassIds.Tower_Shield: // Sigon's tower shield
                            code = "invtowu";

                            break;
                        case ItemClassIds.Full_Plate_Mail: // Tancred's full plate mail
                            code = "invfulu";

                            break;
                        case ItemClassIds.Military_Pick: // Tancred's military pick
                            code = "invmpiu";

                            break;
                        case ItemClassIds.Jagged_Star: // Aldur's jagged star
                            code = "invmstu";

                            break;
                        case ItemClassIds.Colossus_Blade: // Bul-Kathos' colossus blade
                            code = "invgsdu";

                            break;
                        case ItemClassIds.Ornate_Plate: // Grizwold's ornate plate
                            code = "invxaru";

                            break;
                        case ItemClassIds.Cuirass: // Heaven's cuirass
                        case ItemClassIds.Reinforced_Mace: // Heaven's reinforced mace
                        case ItemClassIds.Ward: // Heaven's ward
                        case ItemClassIds.Spired_Helm: // Heaven's spired helm
                            code = "inv" + unit.code + "s";

                            break;
                        case ItemClassIds.Grand_Crown: // Hwanin's grand crown
                            code = "invxrnu";

                            break;
                        case ItemClassIds.Scissors_Suwayyah: // Nalya's scissors suwayyah
                            code = "invskru";

                            break;
                        case ItemClassIds.Grim_Helm: // Nalya's grim helm
                        case ItemClassIds.Bone_Visage: // Trang-Oul's bone visage
                            code = "invbhmu";

                            break;
                        case ItemClassIds.Elder_Staff: // Naj's elder staff
                            code = "invcstu";

                            break;
                        case ItemClassIds.Round_Shield: // Orphan's round shield
                            code = "invxmlu";

                            break;
                        case ItemClassIds.Bone_Wand: // Sander's bone wand
                            code = "invbwnu";

                            break;
                    }

				break;
                case ItemQuality.Unique: // Unique
				for (i = 0; i < 401; i += 1) {
                    if (unit.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(BaseStat.uniqueitems, i, 2))) > -1) {
                        code = getBaseStat(BaseStat.uniqueitems, i, "invfile");

						break;
					}
				}

				break;
			}
		}

		if (!code) {
			if (["ci2", "ci3"].indexOf(unit.code) > -1) { // Tiara/Diadem
				code = unit.code;
			} else {
                code = getBaseStat(BaseStat.items, unit.classid, 'normcode') || unit.code;
			}

			code = code.replace(" ", "");

            if ([NTItemTypes.ring, NTItemTypes.amulet, NTItemTypes.jewel, NTItemTypes.smallcharm, NTItemTypes.mediumcharm, NTItemTypes.largecharm].indexOf(unit.itemType) > -1) {
				code += (unit.gfx + 1);
			}
		}

		sock = unit.getItem();

		if (sock) {
            do {
                if (sock.itemType === NTItemTypes.jewel) {
					desc += "\n\n";
					desc += this.getItemDesc(sock);
				}
			} while (sock.getNext());
		}

		if (keptLine) {
			desc += ("\n\\xffc0Line: " + keptLine);
		}

		itemObj = {
			title: action + " " + name,
			description: desc,
			image: code,
			textColor: unit.quality,
			itemColor: color,
			header: "",
			sockets: this.getItemSockets(unit)
		};

		D2Bot.printToItemLog(itemObj);

		return true;
	},

	// Change into werewolf or werebear
	shapeShift: function (mode) {
		var i, tick, skill, state;

		switch (mode.toString().toLowerCase()) {
		case "0":
			return false;
		case "1":
		case "werewolf":
                state = States.WOLF;
                skill = Skills.Druid.Wearwolf;

			break;
		case "2":
		case "werebear":
                state = States.BEAR;
                skill = Skills.Druid.Wearbear;

			break;
		default:
			throw new Error("shapeShift: Invalid parameter");
		}

		if (me.getState(state)) {
			return true;
		}

		for (i = 0; i < 3; i += 1) {
			Skill.cast(skill, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.getState(state)) {
					delay(250);

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Change back to human shape
	unShift: function () {
		var i, tick;

        if (me.getState(States.WOLF) || me.getState(States.BEAR)) {
			for (i = 0; i < 3; i += 1) {
                Skill.cast(me.getState(States.WOLF) ? Skills.Druid.Wearwolf : Skills.Druid.Wearbear);

				tick = getTickCount();

				while (getTickCount() - tick < 2000) {
					if (!me.getState(States.WOLF) && !me.getState(States.BEAR)) {
						delay(250);

						return true;
					}

					delay(10);
				}
			}
		} else {
			return true;
		}

		return false;
	},

	// Teleport with slot II
	teleSwitch: function () {
		this.oldSwitch = me.weaponswitch;

		Precast.weaponSwitch();

		return true;
	},

	// Go to town when low on hp/mp or when out of potions. can be upgraded to check for curses etc.
	townCheck: function () {
		var i, potion, check,
			needhp = true,
			needmp = true;

		// Can't tp from uber trist or when dead
        if (me.area === Areas.UberLevels.Tristram || me.dead) {
			return false;
		}

		if (Config.TownCheck && !me.inTown) {
			try {
				if (me.gold > 1000) {
					for (i = 0; i < 4; i += 1) {
                        if (Config.BeltColumn[i] === "hp" && Config.MinColumn[i] > 0) {
                            potion = me.getItem(-1, ItemLocation.Belt); // belt item

							if (potion) {
								do {
									if (potion.code.indexOf("hp") > -1) {
										needhp = false;

										break;
									}
								} while (potion.getNext());
							}

							if (needhp) {
								print("We need healing potions");

								check = true;
							}
						}

                        if (Config.BeltColumn[i] === "mp" && Config.MinColumn[i] > 0) {
                            potion = me.getItem(-1, ItemLocation.Belt); // belt item

							if (potion) {
								do {
									if (potion.code.indexOf("mp") > -1) {
										needmp = false;

										break;
									}
								} while (potion.getNext());
							}

							if (needmp) {
								print("We need mana potions");

								check = true;
							}
						}
					}
				}

				if (Config.OpenChests && Town.needKeys()) {
					check = true;
				}
			} catch (e) {
				check = false;
			}
		}

		if (check) {
			scriptBroadcast("townCheck");
			delay(500);

			return true;
		}

		return false;
	},

	// Log someone's gear
	spy: function (name) {
		if (!isIncluded("oog.js")) {
			include("oog.js");
		}

		if (!isIncluded("common/prototypes.js")) {
			include("common/prototypes.js");
		}

		var item,
			unit = getUnit(-1, name);

		if (!unit) {
			print("player not found");

			return false;
		}

		item = unit.getItem();

		if (item) {
			do {
				this.logItem(unit.name, item);
			} while (item.getNext());
		}

		return true;
	},

	// hopefully multi-thread and multi-profile friendly txt func
	/*fileAction: function (path, mode, msg) {
		var i, file,
			contents = "";

MainLoop:
		for (i = 0; i < 30; i += 1) {
			try {
				file = File.open(path, mode);

				switch (mode) {
				case 0: // read
					contents = file.readLine();

					break MainLoop;
				case 1: // write
				case 2: // append
					file.write(msg);

					break MainLoop;
				}
			} catch (e) {

			} finally {
				if (file) {
					file.close();
				}
			}

			delay(100);
		}

		return mode === 0 ? contents : true;
	},*/

	fileAction: function (path, mode, msg) {
		var i,
			contents = "";

MainLoop:
		for (i = 0; i < 30; i += 1) {
			try {
				switch (mode) {
				case 0: // read
					contents = FileTools.readText(path);

					break MainLoop;
				case 1: // write
					FileTools.writeText(path, msg);

					break MainLoop;
				case 2: // append
					FileTools.appendText(path, msg);

					break MainLoop;
				}
			} catch (e) {

			}

			delay(100);
		}

		return mode === 0 ? contents : true;
	},

	errorConsolePrint: true,
	screenshotErrors: false,

	// Report script errors to logs/ScriptErrorLog.txt
	errorReport: function (error, script) {
		var i, h, m, s, date, msg, oogmsg, filemsg, source, stack,
			stackLog = "";

		date = new Date();
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();

		if (typeof error === "string") {
			msg = error;
			oogmsg = error.replace(/ÿc[0-9!"+<;.*]/gi, "");
			filemsg = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "] <" + me.profile + "> " + error.replace(/ÿc[0-9!"+<;.*]/gi, "") + "\n";
		} else {
			source = error.fileName.substring(error.fileName.lastIndexOf("\\") + 1, error.fileName.length);
			msg = "ÿc1Error in ÿc0" + script + " ÿc1(" + source + " line ÿc1" + error.lineNumber + "): ÿc1" + error.message;
			oogmsg = " Error in " + script + " (" + source + " #" + error.lineNumber + ") " + error.message + " (Area: " + me.area + ", Ping:" + me.ping + ", Game: " + me.gamename + ")";
			filemsg = "[" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + "] <" + me.profile + "> " + msg.replace(/ÿc[0-9!"+<;.*]/gi, "") + "\n";

			if (error.hasOwnProperty("stack")) {
				stack = error.stack;

				if (stack) {
					stack = stack.split("\n");

					if (stack && typeof stack === "object") {
						stack.reverse();
					}

					for (i = 0; i < stack.length; i += 1) {
						if (stack[i]) {
							stackLog += stack[i].substr(0, stack[i].indexOf("@") + 1) + stack[i].substr(stack[i].lastIndexOf("\\") + 1, stack[i].length - 1);

							if (i < stack.length - 1) {
								stackLog += ", ";
							}
						}
					}
				}
			}

			if (stackLog) {
				filemsg += "Stack: " + stackLog + "\n";
			}
		}

		if (this.errorConsolePrint) {
			D2Bot.printToConsole(oogmsg, 10);
		}

		showConsole();
		print(msg);
		this.fileAction("logs/ScriptErrorLog.txt", 2, filemsg);

		if (this.screenshotErrors) {
			takeScreenshot();
			delay(500);
		}
	},

	debugLog: function (msg) {
		if (!Config.Debug) {
			return;
		}

		debugLog(me.profile + ": " + msg);
	},

	// Use a NPC menu. Experimental function, subject to change
	// id = string number (with exception of Ressurect merc). http://www.blizzhackers.cc/viewtopic.php?f=209&t=378493
	useMenu: function (id) {
		//print("useMenu " + getLocaleString(id));

		var i, npc, lines;

		switch (id) {
		case 0x1507: // Resurrect (non-English dialog)
		case 0x0D44: // Trade (crash dialog)
			npc = getInteractedNPC();

			if (npc) {
				npc.useMenu(id);
				delay(750);

				return true;
			}

			break;
		}

		lines = getDialogLines();

		if (!lines) {
			return false;
		}

		for (i = 0; i < lines.length; i += 1) {
			if (lines[i].selectable && lines[i].text.indexOf(getLocaleString(id)) > -1) {
				getDialogLines()[i].handler();
				delay(750);

				return true;
			}
		}

		return false;
	},

	clone: function (obj) {
		var i, copy, attr;

		// Handle the 3 simple types, and null or undefined
		if (null === obj || "object" !== typeof obj) {
			return obj;
		}

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();

			copy.setTime(obj.getTime());

			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];

			for (i = 0; i < obj.length; i += 1) {
				copy[i] = this.clone(obj[i]);
			}

			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};

			for (attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = this.clone(obj[attr]);
				}
			}

			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	},

	copy: function (from) {
		var i,
			obj = {};

		for (i in from) {
			if (from.hasOwnProperty(i)) {
				obj[i] = this.clone(from[i]);
			}
		}

		return obj;
	}
};

var Sort = {
	// Sort units by comparing distance between the player
	units: function (a, b) {
		return Math.round(getDistance(me.x, me.y, a.x, a.y)) - Math.round(getDistance(me.x, me.y, b.x, b.y));
	},

	// Sort preset units by comparing distance between the player (using preset x/y calculations)
	presetUnits: function (a, b) {
		return getDistance(me, a.roomx * 5 + a.x, a.roomy * 5 + a.y) - getDistance(me, b.roomx * 5 + b.x, b.roomy * 5 + b.y);
	},

	// Sort arrays of x,y coords by comparing distance between the player
	points: function (a, b) {
		return getDistance(me, a[0], a[1]) - getDistance(me, b[0], b[1]);
	},

	numbers: function (a, b) {
		return a - b;
	}
};

var Experience = {
	totalExp: [0, 0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715, 72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513, 671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553, 5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791, 19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709, 51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849, 128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630, 311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665, 742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619, 1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254, 0, 0],
	nextExp: [0, 500, 1000, 2250, 4125, 6300, 8505, 10206, 11510, 13319, 14429, 18036, 22545, 28181, 35226, 44033, 55042, 68801, 86002, 107503, 134378, 167973, 209966, 262457, 328072, 410090, 512612, 640765, 698434, 761293, 829810, 904492, 985897, 1074627, 1171344, 1276765, 1391674, 1516924, 1653448, 1802257, 1964461, 2141263, 2333976, 2544034, 2772997, 3022566, 3294598, 3591112, 3914311, 4266600, 4650593, 5069147, 5525370, 6022654, 6564692, 7155515, 7799511, 8501467, 9266598, 10100593, 11009646, 12000515, 13080560, 14257811, 15541015, 16939705, 18464279, 20126064, 21937409, 23911777, 26063836, 28409582, 30966444, 33753424, 36791232, 40102443, 43711663, 47645713, 51933826, 56607872, 61702579, 67255812, 73308835, 79906630, 87098226, 94937067, 103481403, 112794729, 122946255, 134011418, 146072446, 159218965, 173548673, 189168053, 206193177, 224750564, 244978115, 267026144, 291058498, 0, 0],

	// Percent progress into the current level. Format: xx.xx%
    progress: function () {
        return me.getStat(Stats.level) === 99 ? 0 : (((me.getStat(Stats.experience) - this.totalExp[me.getStat(Stats.level)]) / this.nextExp[me.getStat(Stats.level)]) * 100).toFixed(2);
	},

	// Total experience gained in current run
    gain: function () {
        return (me.getStat(Stats.experience) - DataFile.getStats().experience);
	},

	// Percent experience gained in current run
	gainPercent: function () {
        return me.getStat(Stats.level) === 99 ? 0 : (this.gain() * 100 / this.nextExp[me.getStat(Stats.level)]).toFixed(6);
	},

	// Runs until next level
	runsToLevel: function () {
        return Math.round(((100 - this.progress()) / 100) * this.nextExp[me.getStat(Stats.level)] / this.gain());
	},

	// Total runs needed for next level (not counting current progress)
	totalRunsToLevel: function () {
        return Math.round(this.nextExp[me.getStat(Stats.level)] / this.gain());
	},

	// Total time till next level
	timeToLevel: function () {
		var tTLrawSeconds = (Math.floor((getTickCount() - me.gamestarttime) / 1000)).toString(),
			tTLrawtimeToLevel = this.runsToLevel() * tTLrawSeconds,
			tTLDays = Math.floor(tTLrawtimeToLevel / 86400),
			tTLHours = Math.floor((tTLrawtimeToLevel % 86400) / 3600),
			tTLMinutes = Math.floor(((tTLrawtimeToLevel % 86400) % 3600) / 60),
			tTLSeconds = ((tTLrawtimeToLevel % 86400) % 3600) % 60;

		//return tDays + "d " + tTLHours + "h " + tTLMinutes + "m " + tTLSeconds + "s";
		//return tTLDays + "d " + tTLHours + "h " + tTLMinutes + "m";
		return (tTLDays ? tTLDays + " d " : "") + (tTLHours ? tTLHours + " h " : "") + (tTLMinutes ? tTLMinutes + " m" : "");
	},

	// Get Game Time
	getGameTime: function () {
		var rawMinutes = Math.floor((getTickCount() - me.gamestarttime) / 60000).toString(),
			rawSeconds = (Math.floor((getTickCount() - me.gamestarttime) / 1000) % 60).toString();

		if (rawMinutes <= 9) {
			rawMinutes = "0" + rawMinutes;
		}

		if (rawSeconds <= 9) {
			rawSeconds = "0" + rawSeconds;
		}

		//return rawMinutes + "m " + rawSeconds + "s";
		return " (" + rawMinutes + ":" + rawSeconds + ")";
	},

	// Log to manager
	log: function () {
		var string,
			gain = this.gain(),
			progress = this.progress(),
			runsToLevel = this.runsToLevel(),
			totalRunsToLevel = this.totalRunsToLevel(),
			getGameTime = this.getGameTime(),
			timeToLevel = this.timeToLevel();

		//string = "[Game: " + me.gamename + (me.gamepassword ? "//" + me.gamepassword : "") + getGameTime + "] [Level: " + me.getStat(12) + " (" + progress + "%)] [XP: " + gain + "] [Games ETA: " + runsToLevel + "] [Time ETA: " + timeToLevel + "]";
        string = "[Game: " + me.gamename + (me.gamepassword ? "//" + me.gamepassword : "") + getGameTime + "] [Level: " + me.getStat(Stats.level) + " (" + progress + "%)] [XP: " + gain + "] [Games ETA: " + runsToLevel + "]";

		if (gain) {
			D2Bot.printToConsole(string, 4);

            if (me.getStat(Stats.level) > DataFile.getStats().level) {
                D2Bot.printToConsole("Congrats! You gained a level. Current level:" + me.getStat(Stats.level), 5);
			}
		}
	}
};

var Packet = {
	openMenu: function (unit) {
        if (unit.type !== UnitType.NPC) {
			throw new Error("openMenu: Must be used on NPCs.");
		}

        if (getUIFlag(UIFlags.npc_menu)) {
			return true;
		}

		var i, j;

		for (i = 0; i < 5; i += 1) {
			if (getDistance(me, unit) > 5) {
				Pather.moveToUnit(unit);
			}

			if (i > 0) {
				Packet.flash(me.gid);
			}

            if (!getUIFlag(UIFlags.npc_menu)) {
				sendPacket(1, 0x13, 4, 1, 4, unit.gid);
			}

			for (j = 0; j < 40; j += 1) {
                if (j > 0 && j % 8 === 0 && !getUIFlag(UIFlags.npc_menu)) {
					me.cancel();
					delay(300);
					sendPacket(1, 0x13, 4, 1, 4, unit.gid);
				}

                if (getUIFlag(UIFlags.npc_menu)) {
					delay(Math.max(500, me.ping * 2));

					return true;
				}

				delay(25);
			}
		}

		return false;
	},

	startTrade: function (unit, mode) {
        if (unit.type !== UnitType.NPC) {
			throw new Error("Unit.startTrade: Must be used on NPCs.");
		}

        if (getUIFlag(UIFlags.Shop_open_at_NPC)) {
			return true;
		}

		var i,
			gamble = mode === "Gamble";

		if (this.openMenu(unit)) {
			for (i = 0; i < 10; i += 1) {
				delay(200);

				if (i % 2 === 0) {
					sendPacket(1, 0x38, 4, gamble ? 2 : 1, 4, unit.gid, 4, 0);
				}

				if (unit.itemcount > 0) {
					delay(200);

					return true;
				}
			}
		}

		return false;
	},

	buyItem: function (unit, shiftBuy, gamble) {
		var i, tick,
            oldGold = me.getStat(Stats.gold) + me.getStat(Stats.goldbank),
			itemCount = me.itemcount,
			npc = getInteractedNPC();

		if (!npc) {
			throw new Error("buyItem: No NPC menu open.");
		}

        if (me.getStat(Stats.gold) + me.getStat(Stats.goldbank) < unit.getItemCost(0)) { // Can we afford the item?
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			sendPacket(1, 0x32, 4, npc.gid, 4, unit.gid, 4, shiftBuy ? 0x80000000 : gamble ? 0x2 : 0x0, 4, 0);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(2000, me.ping * 2 + 500)) {
                if (shiftBuy && me.getStat(Stats.gold) + me.getStat(Stats.goldbank) < oldGold) {
					return true;
				}

				if (itemCount !== me.itemcount) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

    sellItem: function (unit) {
        if (unit.type !== NTItemTypes.gold) { // Check if it's an item we want to buy
			throw new Error("Unit.sell: Must be used on items.");
		}

		var i, tick, npc,
			itemCount = me.itemcount;

		npc = getInteractedNPC();

		if (!npc) {
			return false;
		}

		for (i = 0; i < 5; i += 1) {
			sendPacket(1, 0x33, 4, npc.gid, 4, unit.gid, 4, 0, 4, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (me.itemcount !== itemCount) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	identifyItem: function (unit, tome) {
		var i, tick;

        if (!unit || unit.getFlag(ItemFlags.isIdentified)) {
			return false;
		}

CursorLoop:
		for (i = 0; i < 3; i += 1) {
			sendPacket(1, 0x27, 4, unit.gid, 4, tome.gid);

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
				if (getCursorType() === 6) {
					break CursorLoop;
				}

				delay(10);
			}
		}

		if (getCursorType() !== 6) {
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			if (getCursorType() === 6) {
				sendPacket(1, 0x27, 4, unit.gid, 4, tome.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 2000) {
                if (unit.getFlag(ItemFlags.isIdentified)) {
					delay(50);

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	itemToCursor: function (item) {
		var i, tick;

		if (me.itemoncursor) { // Something already on cursor
			if (getUnit(100).gid === item.gid) { // Return true if the item is already on cursor
				return true;
			}

			this.dropItem(getUnit(100)); // If another item is on cursor, drop it
		}

		for (i = 0; i < 15; i += 1) {
			if (item.mode === 1) { // equipped
				sendPacket(1, 0x1c, 2, item.bodylocation);
			} else {
				sendPacket(1, 0x19, 4, item.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping * 2 + 200)) {
				if (me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	dropItem: function (item) {
		var i, tick;

		if (!this.itemToCursor(item)) {
			return false;
		}

		for (i = 0; i < 15; i += 1) {
			sendPacket(1, 0x17, 4, item.gid);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(500, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	castSkill: function (hand, wX, wY) {
		hand = (hand === 0) ? 0x0c : 0x05;
		sendPacket(1, hand, 2, wX, 2, wY);
	},

	unitCast: function (hand, who) {
		hand = (hand === 0) ? 0x11 : 0x0a;
		sendPacket(1, hand, 4, who.type, 4, who.gid);
	},

	moveNPC: function (npc, dwX, dwY) {
		sendPacket(1, 0x59, 4, npc.type, 4, npc.gid, 4, dwX, 4, dwY);
	},

	teleWalk: function (x, y, maxDist) {
		var i;

		if (maxDist === undefined) {
			maxDist = 5;
		}

		if (!this.telewalkTick) {
			this.telewalkTick = 0;
		}

		if (getDistance(me, x, y) > 10 && getTickCount() - this.telewalkTick > 3000 && Attack.validSpot(x, y)) {
			for (i = 0; i < 5; i += 1) {
				sendPacket(1, 0x5f, 2, x + rand(-1, 1), 2, y + rand(-1, 1));
				delay(me.ping + 1);
				sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
				delay(me.ping + 1);

				if (getDistance(me, x, y) < maxDist) {
					delay(200);

					return true;
				}
			}

			this.telewalkTick = getTickCount();
		}

		return false;
	},

	flash: function (gid) {
		sendPacket(1, 0x4b, 4, 0, 4, gid);
	},

	changeStat: function (stat, value) {
		if (value > 0) {
			getPacket(1, 0x1d, 1, stat, 1, value);
		}
	}
};

var Messaging = {
	sendToScript: function (name, msg) {
		var script = getScript(name);

		if (script && script.running) {
			script.send(msg);

			return true;
		}

		return false;
	},

	sendToProfile: function (profileName, mode, message, getResponse) {
		var response;

		function copyDataEvent(mode2, msg) {
			if (mode2 === mode) {
				var obj;

				try {
					obj = JSON.parse(msg);
				} catch (e) {
					return false;
				}

				if (obj.hasOwnProperty("sender") && obj.sender === profileName) {
					response = Misc.copy(obj);
				}

				return true;
			}

			return false;
		}

		if (getResponse) {
			addEventListener("copydata", copyDataEvent);
		}

		if (!sendCopyData(null, profileName, mode, JSON.stringify({message: message, sender: me.profile}))) {
			//print("sendToProfile: failed to get response from " + profileName);

			if (getResponse) {
				removeEventListener("copydata", copyDataEvent);
			}

			return false;
		}

		if (getResponse) {
			delay(200);
			removeEventListener("copydata", copyDataEvent);

			if (!!response) {
				return response;
			}

			return false;
		}

		return true;
	}
};

var Events = {
	// gamepacket
	gamePacket: function (bytes) {
		var temp;

		switch (bytes[0]) {
		// Block movement after using TP/WP/Exit
		case 0x0D: // Player Stop
			// This can mess up death screen so disable for characters that are allowed to die
			if (Config.LifeChicken > 0) {
				return true;
			}

			break;
		// Block poison skills that might crash the client
		case 0x4C: // Cast skill on target
		case 0x4D: // Cast skill on coords
			temp = Number("0x" + bytes[7].toString(16) + bytes[6].toString(16));

			// Match Poison Javelin, Plague Javelin or Poison Nova
			if (temp && [15, 25, 92].indexOf(temp) > -1) {
				return true;
			}

			break;
		}

		return false;
	}
};