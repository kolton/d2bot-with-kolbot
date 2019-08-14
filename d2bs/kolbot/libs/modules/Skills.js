(function (module, require) {
	const Skills = {};

	Object.defineProperty(Skills, 'class', {
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
	});

	Object.defineProperty(Skills, 'tab', {
		get: function () {
			return new Proxy({}, {
				get: function (target, p, receiver) {
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