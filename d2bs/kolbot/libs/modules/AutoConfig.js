/**
 * @author Jaenster
 * @description A module that configures your bot you
 */
(function (module, require) {
	// Should be an module
	const Config = require('Config');
	const Auto = {}, Skills = require('Skills');
	Object.defineProperties(Auto, {
		Config: {
			get: function () {
				return !Config.AutoConfig && typeof Config.AutoConfig !== 'object' && (Config.AutoConfig = {}) && false || Config.AutoConfig;
			},
			enumerable: false,
		},
		isWeak: {
			get: () => (Auto.myResistance < 0 || Config.XPRun.Char.weak),
		},
		myResistance: {
			get: () => [me.getStat(45), me.getStat(43), me.getStat(41), me.getStat(39)],
		},
		dodgeRules: {
			get: () => function () {
				Config.Dodge = true; // Move away from monsters that get too close. Don't use with short-ranged attacks like Poison Dagger.
				Config.DodgeRange = 7; // Distance to keep from monsters.
				Config.DodgeHP = 100; // Dodge only if HP percent is less than or equal to Config.DodgeHP. 100 = always dodge.
			},
		},
	});

	const emptyInventorySlots = function (free = 0) {
		for (let i = 0; i < 4; i += 1) for (let j = 0; j < Config.Inventory[i].length; j += 1) Config.Inventory[i][j] && free++;
	};

	const AutoConfig = function () {
		return me.ingame && (isIncluded('GameData.js') || include("GameData.js")) && Object.keys(AutoConfig)  // Run all AutoConfig modules
			.map(x => AutoConfig[x])
			.filter(x => typeof x === 'function')
			.forEach(_ => _());
	};

	AutoConfig.Chicken = function () {
		Config.HealHP = 50;
		Config.HealMP = 50;
		Config.HealStatus = false;
		Config.UseMerc = true;
		Config.MercWatch = ([0, 1, 6].indexOf(me.classid));
		Config.AvoidDolls = ([0, 1, 2, 6].indexOf(me.classid)); // Avoid dolls in case your a Ama / Sorc / Necro or Assa

		// Chicken settings
		Config.LifeChicken = 35; // Exit game if life is less or equal to designated percent.
		Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
		Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
		Config.TownHP = 0; // Go to town if life is under designated percent.
		Config.TownMP = 0; // Go to town if mana is under designated percent.
	};

	AutoConfig.PotTaking = function () {
		// Potion settings
		Config.UseHP = 75;
		Config.UseRejuvHP = 45;
		Config.UseMP = 30;
		Config.UseRejuvMP = Math.max.apply(Math, Skills.getSkillLevel(sdk.skills.EnergyShield)) > 1 ? 25 : 0; // Only use a Rejuv pot for mana in case we have an es
		Config.UseMercHP = 75;
		Config.UseMercRejuv = 20;
		Config.HPBuffer = 0;
		Config.MPBuffer = 0;
		Config.RejuvBuffer = Math.min(me.isWeak ? 6 : 3, Math.max(0, Math.floor(emptyInventorySlots() - 12 / 2))); // If space allows it, keep 3 Rejuv's in inventory or 6 in the case we are weak
	};

	AutoConfig.Identifying = function () {
		// Item identification settings
		Config.CainID.Enable = me.act === 4; // Only if we start in act4. Its quicker, otherwise it ain't.
		Config.CainID.MinGold = 2500000;
		Config.CainID.MinUnids = 3;
		Config.FieldID = true; //ToDo; if we have a tomb
		Config.DroppedItemsAnnounce.Enable = false;
		Config.DroppedItemsAnnounce.Quality = [];
	};

	AutoConfig.CubeRepair = function () {
		//ToDo; Fix we only do this if we have an very expensive armor to repair and we dont have gold to do so
		Config.CubeRepair = false;
		Config.RepairPercent = 40;
	};

	AutoConfig.TeleStomp = function () {
		//ToDo; make it depend on skill, in the end we dont want/need this setting
		Config.TeleStomp = [1, 6].indexOf(me.classid); // Tele stomp only matters with a sorc or assa
	};

	AutoConfig.Clearing = function () {
		Config.BossPriority = true;
		Config.ClearType = 0xF;
	};


	//ToDo; this should be redundant in the future, as i would like to use directly per monster settings
	AutoConfig.Skills = function () {
		const effort = [], uniqueSkills = [];
		for (let i = 50; i < 120; i++) {
			try {
				effort.push(GameData.monsterEffort(i, sdk.areas.ThroneOfDestruction))
			} catch (e) {/*dontcare*/
			}
		}

		effort
			.filter(e => e !== null && typeof e === 'object' && e.hasOwnProperty('skill'))
			.filter(x => me.getSkill(x.skill, 0)) // Only skills where we have hard points in
			.filter(x => Skills.class[x.skill] < 7) // Needs to be a skill of a class, not my class but a class
			.map(x =>
				// Search for this unique skill
				(
					uniqueSkills.find(u => u.skillId === x.skill)
					// Or add it and return the value
					|| (
						(
							uniqueSkills.push({skillId: x.skill, used: 0})
							&& false
						)
						|| uniqueSkills[uniqueSkills.length - 1]
					)
				).used++ && false
				// In the end always return x
				|| x
			);

		// Unique skills are in uniqueSkills, sort them
		uniqueSkills.sort((a, b) => b.used - a.used);

		Auto.Config.Skills = uniqueSkills;

		// First init them all on -1
		Config.AttackSkill.length = 7;
		for (let i = 0; i < Config.AttackSkill.length; i++) Config.AttackSkill[i] = -1;


		switch (true) {
			case true: // ToDo; rendering the others invalid. For now this is it.
			case uniqueSkills.length < 5: // ToDo; do something special, determin what is meant for bosses / inume
			case uniqueSkills.length < 3: // Have a small amount of matches, not much to put
				uniqueSkills.forEach((x, i) => i < 2 && (Config.AttackSkill[i + 1] = x.skillId) && (Config.AttackSkill[i + 3] = x.skillId));
				break;
		}

		Auto.Config.charlvl = me.charlvl;
		Auto.Config.effort = uniqueSkills;

		Config.AttackSkill.forEach((e, i) => e > -1 && print('AttackSkill[' + i + '] = ' + getSkillById(e)));
	};


	//ToDo; Do something with this. For now 4 rows of rv pots to avoid belt clearance
	AutoConfig.Belt = function () {
		let [b, m] = [Config.BeltColumn, Config.MinColumn];
		for (let i = 0; i < 4; i++) (b[i] = i === 0 && 'hp' || i === 1 && 'mp' || 'rv') && (m[i] = b[i] !== 'rv' && 3 || 0);
		[Config.BeltColumn, Config.MinColumn] = [b, m];
	};


	AutoConfig.ClassSpecifics = function () {
		//ToDo; take in acocunt the oskills of the game. A sorc can use zeal and you might want pala specifics on a sorc.
		switch (true) {
			// Almost all sorcs are the same, just setup a sorc
			case me.classid === 1: //sorc
				// A typical sorc
				Auto.dodgeRules(); // Sorcs are dodging

				//ToDo; figure out with GameData if static is the most damage we can do on a monster
				Config.CastStatic = 60; // Cast static until the target is at designated life percent. 100 = disabled.
				Config.StaticList = ["Baal", 'Mephisto', 'Diablo', 571, 572, 573]; // List of monster NAMES or CLASSIDS to static. Example: Config.StaticList = ["Andariel", 243];
				break;

			case me.classid === 5: // Druid


		}
	};

	module.exports = AutoConfig;
})(module, require);