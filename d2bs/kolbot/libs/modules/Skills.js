(function (module, require) {
	const Skills = {};

	Object.defineProperties(Skills, {
		class: {
			get: function () {
				return new Proxy({}, {
					get: function (target, p, receiver) {
						let skillId = parseInt(p);
						switch (true) {
							case skillId < sdk.skills.MagicArrow: // Everything below the first skill of the ama
								return 7;

							case skillId < sdk.skills.FireBolt: // Everything below the first skill of the sorc
								return sdk.charclass.Amazon; // is an ama skill

							case skillId < sdk.skills.AmplifyDamage: // Everything below the first skill of necro
								return sdk.charclass.Sorceress; // is an sorc skill

							case skillId < sdk.skills.Sacrifice:
								return sdk.charclass.Necromancer; // is an necro skill

							case skillId < sdk.skills.Bash:
								return sdk.charclass.Paladin; // is an pala skill

							case skillId <= sdk.skills.BattleCommand:
								return sdk.charclass.Barbarian; // is an barb skill

							case skillId < sdk.skills.Raven:
								return 8; // monster skills

							case skillId < sdk.skills.FireTrauma:
								return sdk.charclass.Druid; // Druid

							case skillId <= sdk.skills.WakeOfDestructionSentry:
								return sdk.charclass.Assassin
						}
						return 8; // monster skills
					}
				})
			}
		},
		tab: {
			get: function () {
				return new Proxy({}, {
					get: function (target, p) {
						let skillId = parseInt(p);

						for (let char in sdk.skillTabs) {
							for (let tab in sdk.skillTabs[char]) {
								let current = sdk.skillTabs[char][tab];
								if (current.skills.indexOf(skillId) > -1) {
									return current.id;
								}
							}
						}

						return -1; // not found
					}
				})
			}
		},
		aura: {
			get: function () {
				return new Proxy({}, {
					get: function (target, skillId) {
						skillId = parseInt(skillId);

						let Auras = {
							Concentration: [sdk.skills.BlessedHammer, sdk.skills.HolyBolt],
							Conviction: [sdk.skills.Vengeance, sdk.skills.FistoftheHeavens],
							Fanaticism: [sdk.skills.Zeal, sdk.skills.Smite],
						};

						//ToDo; some magical overriding

						// Filter out aura's we dont have.
						Object.keys(Auras).forEach(key => !me.getSkill(sdk.skills[key], 1) && delete Auras[key]);

						for (let i in Auras) {
							if (Auras[i].indexOf(skillId) > -1) {
								return sdk.skills[i];
							}
						}
						return 0;
					}
				})
			}
		},
		range: {
			get: function () {
				return new Proxy({}, {
					get: function (target, skillId) {
						switch (parseInt(skillId)) {
							case 0: // Normal Attack
								return 3; // ToDo; deal with bow's
							case sdk.skills.BlessedHammer:
								return 1;
							case 1: // Kick
							case 5: // Left Hand Swing
							case 10: // Jab
							case 14: // Power Strike
							case 19: // Impale
							case 24: // Charged Strike
							case 30: // Fend
							case 34: // Lightning Strike
							case 46: // Blaze
							case 73: // Poison Dagger
							case 96: // Sacrifice
							case 97: // Smite
							case 106: // Zeal
							case 111: // Vengeance
							case 116: // Conversion
							case 126: // Bash
							case 131: // Find Potion
							case 133: // Double Swing
							case 139: // Stun
							case 142: // Find item
							case 144: // Concentrate
							case 147: // Frenzy
							case 150: // Grim Ward
							case 152: // Berserk
							case 232: // Feral Rage
							case 233: // Maul
							case 238: // Rabies
							case 239: // Fire Claws
							case 242: // Hunger
							case 248: // Fury
							case 255: // Dragon Talon
							case 260: // Dragon Claw
							case 270: // Dragon Tail
								return 3;
							case 146: // Battle Cry
							case 154: // War Cry
								return 4;
							case 44: // Frost Nova
							case 240: // Twister
							case 245: // Tornado
							case 500: // Summoner
								return 5;
							case 38: // Charged Bolt
								return 6;
							case 48: // Nova
							case 151: // Whirlwind
								return 7;
							case 92: // Poison Nova
								return 8;
							case 249: // Armageddon
								return 9;
							case 15: // Poison Javelin
							case 25: // Plague Javelin
							case 107: // Charge
							case 130: // Howl
							case 225: // Firestorm
							case 229: // Molten Boulder
							case 243: // Shock Wave
								return 10;
							case 8: // Inner Sight
							case 17: // Slow Missiles
								return 13;
							case 35: // Lightning Fury
							case 64: // Frozen Orb
							case 67: // Teeth
							case 234: // Fissure
							case 244: // Volcano
							case 251: // Fire Blast
							case 256: // Shock Web
							case 257: // Blade Sentinel
							case 266: // Blade Fury
							case 101: // Holy Bolt
								return 15;
							case 7: // Fire Arrow
							case 12: // Multiple Shot
							case 16: // Exploding Arrow
							case 22: // Guided Arrow
							case 27: // Immolation Arrow
							case 31: // Freezing Arrow
							case 95: // Revive
							case 121: // Fist of the Heavens
							case 140: // Double Throw
							case 253: // Psychic Hammer
							case 275: // Dragon Flight
								return 20;
							case 91: // Lower Resist
								return 50;
							// Variable range
							case 42: // Static Field
								return Math.floor((me.getSkill(42, 1) + 4) * 2 / 3);
							case 132: // Leap
								return [4, 7, 8, 10, 11, 12, 12, 13, 14, 14, 14, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17][Math.min(me.getSkill(132, 1) - 1, 24)];
							case 230: // Arctic Blast
								return [5, 6, 6, 6, 6, 7, 7, 8, 8, 8, 8, 9, 9, 10, 10, 10, 10, 11, 11, 12][Math.min(me.getSkill(230, 1) - 1, 19)];
							case 49: // Lightning
							case 84: // Bone Spear
							case 93: // Bone Spirit
								return 30;
							case 47: // Fire Ball
							case 51: // Fire Wall
							case 53: // Chain Lightning
							case 56: // Meteor
							case 59: // Blizzard
							case 273: // Mind Blast
								return 30;
						}
						return 20;
					}
				});
			}
		},
		hand: {
			get: function () {
				return new Proxy({}, {
					get: function (target, skillId) {
						skillId = parseInt(skillId);
						return ([
							[
								6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30,
								31, 33, 34, 35, 36, 37, 38, 39, 41, 45, 47, 49, 53, 55, 61, 63, 64, 65, 67, 73, 79,
								84, 89, 93, 101, 107, 111, 112, 121, 132, 140, 143, 151, 225, 229, 230, 240, 243,
								245, 251, 254, 256, 257, 259, 263, 265, 266, 269, 274, 275
							],
							[
								0, 96, 97, 106, 116, 126, 133, 139, 144, 147, 152,
								232, 233, 238, 239, 242, 248, 255, 260, 270
							]
						].findIndex(x => x.indexOf(skillId) > -1) || 0) + 1;
					},
				});
			}
		},
		isTimed: {
			get: function () {
				return new Proxy({}, {
					get: function (target, skillId) {
						return [15, 25, 27, 51, 56, 59, 62, 64, 121, 225, 223, 228, 229, 234, 244, 247, 249, 250, 256, 268, 275, 277, 279].indexOf(parseInt(skillId)) > -1;
					}
				})
			}
		},
		manaCost: {
			get: function () {
				return new Proxy({}, {
					get: function (target, skillId) {
						skillId = parseInt(skillId);
						if (skillId < 6) return 0; // first skills dont use mana

						let skillLvl = me.getSkill(skillId, 1),
							effectiveShift = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
							lvlmana = getBaseStat(3, skillId, "lvlmana") === 65535 ? -1 : getBaseStat(3, skillId, "lvlmana"); // Correction for skills that need less mana with levels (kolton)

						return Math.max((getBaseStat(3, skillId, "mana") + lvlmana * (skillLvl - 1)) * (effectiveShift[getBaseStat(3, skillId, "manashift")] / 256), getBaseStat(3, skillId, "minmana"));
					}
				})
			}
		}
	});

	/**
	 * @description Returns an array of 2 elements, weapon slot 0 and weapon slot 1
	 * @param skillId
	 * @returns {number[]}
	 */
	Skills.getSkillLevel = function (skillId) {
		const sum = (a, c) => a + c,
			baseLevel = me.getSkill(skillId, 0), // Hard points in skill
			slots = [baseLevel, baseLevel],
			ignoreSlots = [[sdk.body.LeftArmSecondary, sdk.body.RightArmSecondary], [sdk.body.LeftArm, sdk.body.RightArm]],
			classType = Skills.class[skillId],
			skillTab = Skills.tab[skillId];


		// Get specific points for the skill, divided by slot
		ignoreSlots.forEach((ingoreSlots, i) =>
			slots[i] += me.getItems()
				.filter(item => item
					&& item.bodylocation // Only worn items can give + skills to a specific skill
					&& item.location === sdk.storage.Equipment
					&& ingoreSlots.indexOf(item.bodylocation) === -1 // Ignore body other slot
					&&
					(
						// class specific + skills only work if your that class
						item.getStat(sdk.stats.Singleskill, skillId) && me.classid === classType
						// Or an o-skill
						|| item.getStat(sdk.stats.Nonclassskill, skillId)
					)
				).map( // Count the + skills
					item => (item.getStat(sdk.stats.Singleskill, skillId) || 0) + (item.getStat(sdk.stats.Nonclassskill, skillId) || 0)
				).reduce(sum, 0)
		);

		// If both slots are zero, we dont have the skill
		if (slots.reduce(sum, 0) === 0) return slots; // dont have it, return zero on both slots

		// Add + skills, but only if you can cast it on that swap
		ignoreSlots.forEach((ingoreSlots, i) => {
			slots[i] && (
				slots[i] += me.getItems().filter(item => item
					&& ingoreSlots.indexOf(item.bodylocation) === -1 // Ignore body other slot
					&& (
						(
							item.location === sdk.storage.Inventory
							&& item.itemType === sdk.itemtype.charms // only charms can give + skills from inventory
						)
						|| item.location === sdk.storage.Equipment
					)
				).map(item => item
					&& (
						// + All skills
						(item.getStat(sdk.stats.Allskills) || 0)
						// + class skill (only applies if we are this class)
						+ (me.classid === classType && item.getStat(sdk.stats.Addclassskills, me.classid) || 0)
						+ (item.getStat(sdk.stats.AddskillTab, skillTab) || 0)
					)
				).reduce(sum, 0))
		});

		return slots;
	};


	module.exports = Skills

})(module, require);