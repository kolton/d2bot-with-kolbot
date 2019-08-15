/**
 * @author Jaenster
 * @description Precast
 */

(function (module, require) {
	const Config = require('Config');
	const Skills = require('Skills');
	const getSkill = skillId => Math.max.apply(Math, Skills.getSkillLevel(skillId));
	const bestSkill = arr => arr.length === 1 && arr.first() || arr.sort((a, b) => getSkill(b) - getSkill(a)).first();

	/** @return {boolean} */
	function Precast(skills) {
		const beforeSlot = me.weaponswitch;

		(skills || Precast.skills).forEach(result => {
			// switchWeapons if needed
			me.gametype !== 0 && me.weaponswitch !== result.slot && Attack.weaponSwitch(result.slot);

			print('Precasting ' + getSkillById(result.skillId) + ' on slot ' + result.slot);
			Skill.cast(result.skillId, Skill.getHand(result.skillId));
		});

		Attack.weaponSwitch(beforeSlot);
		return true;
	}

	Precast.outTown = function (callback = undefined) {
		const skills = Precast.skills, area = me.area;
		skills.length && Town.heal()
		&& Pather.useWaypoint('random')
		&& Precast(skills)
		&& (
			(typeof callback === 'function' && callback())
			|| Pather.useWaypoint(area)
		);
	};

	Object.defineProperty(Precast, 'skills', {
		get: function () { // Calculate skills for precasting
			return Precast.precastable.map(function (what) {
				if (what.hasOwnProperty('skillId')) {
					if (what.hasOwnProperty('handler')) {
						return what.handler(); // Should return the skill id, or false
					}
					return bestSkill(!Array.isArray(what.skillId) && [what.skillId] || what.skillId);
				}
				return undefined;
			})
				.filter(_ => _) //Filter out mistakes (like not set skillId
				.map(skillId => ({ // get best slot
					skillId: skillId,
					level: Skills.getSkillLevel(skillId)
				}))
				// Add highest skill level
				.map(obj => ((obj.highest = Math.max.apply(Math, obj.level)) && false) || obj)
				// filter out skills we dont have
				.filter(obj => obj.highest)
				// Add slot to object
				.map(obj => {
					obj.slot = obj.level.indexOf(obj.highest);
					return obj;
				})
				// Sort on best hand
				.sort((a, b) => b.slot - a.slot)
		}
	});

	Precast.precastable = [
		// Barb <-- first bo. Always
		{
			skillId: sdk.skills.BattleCommand,
		},
		{
			skillId: sdk.skills.BattleOrders,
		},
		{
			skillId: sdk.skills.Shout,
		},

		// Ama
		{
			skillId: sdk.skills.Valkyrie,
		},

		// Sorc
		{
			skillId: sdk.skills.ThunderStorm,
		},
		{
			skillId: sdk.skills.EnergyShield,
		},
		{
			skillId: [sdk.skills.ChillingArmor, sdk.skills.FrozenArmor, sdk.skills.ShiverArmor],
		},
		{
			skillId: sdk.skills.Enchant,
		},

		// NecroSkills
		{
			skillId: [sdk.skills.ClayGolem, sdk.skills.BloodGolem, sdk.skills.FireGolem],
			handler: function () {
				//ToDo; make sure iron golem is
			}
		},

		// Paladin
		{
			skillId: sdk.skills.HolyShield,
		},

		//Druid
		{
			skillId: [sdk.skills.SummonSpiritWolf, sdk.skills.SummonFenris, sdk.skills.SummonGrizzly],
		},
		{
			skillId: [sdk.skills.PlaguePoppy, sdk.skills.CycleofLife, sdk.skills.Vines],
		},
		{
			skillId: [sdk.skills.OakSage, sdk.skills.HeartofWolverine, sdk.skills.SpiritofBarbs],
			//ToDo; make some function that ensure the use of Oak on Hardcore, or anyway give benefit's to the oak skill
		},
		{
			skillId: sdk.skills.Hurricane,
		},

		// Assa
		{
			skillId: [sdk.skills.Fade, sdk.skills.Quickness],
			// ToDo; some magic decide to either cast fade or BoS
			handler: function () {
				return Config.UseFade && sdk.skills.Fade || sdk.skills.Quickness;
			}
		},
		{
			skillId: sdk.skills.Venom,
		},
		{
			skillId: [sdk.skills.ShadowWarrior, sdk.skills.ShadowMaster],
			// ToDo; make sure this gets unsummoned @ baalruns
		}
	];
	module.exports = Precast;


})(module, require);