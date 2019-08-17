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
			me.gametype !== 0 && me.weaponswitch !== result.slot && me.switchWeapons(result.slot);

			print('Precasting ' + getSkillById(result.skillId) + ' on slot ' + result.slot);
			Skill.cast(result.skillId, Skill.getHand(result.skillId));
		});

		me.switchWeapons(beforeSlot);
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
	Precast.skillIdToStateId = function (skillId) {
		let name = Object.keys(sdk.skills).find(sk => sdk.skills[sk] === skillId);
		return typeof sdk.states[name] !== 'undefined' && sdk.states[name] || undefined;
	};

	const getSkills = precastables => precastables.map(function (what) {
		switch (true) {
			// In case of a mistake
			case !what.hasOwnProperty('skillId'):
			// In case a function needs to be called to figure out if we need it
			case what.hasOwnProperty('needed') && typeof what.needed === 'function' && !what.needed.apply(what):
				// In case no function is given, see if we have the state
				return undefined;

			case typeof what.skillId === 'number':
				let state = Precast.skillIdToStateId(what.skillId);
				if (state && me.getState(state)) {
					return undefined;
				}

				break;
			// in case a handler is defined
			case what.hasOwnProperty('handler') && typeof what.handler === 'function':
				return what.handler.apply(this);
		}

		// Of if nothing special
		return bestSkill(!Array.isArray(what.skillId) && [what.skillId] || what.skillId);
	})
		.filter(_ => _) //Filter out mistakes (like not set skillId)
		.map(skillId => ({ // get best slot
			skillId: skillId,
			level: Skills.getSkillLevel(skillId)
		}))
		// Remove those we dont need
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
		.sort((a, b) => b.slot - a.slot);

	Object.defineProperty(Precast, 'skills', {
		get: function () { // Calculate skills for precasting
			let skills = getSkills(Precast.precastable);
			skills = Precast.petBo(skills);
			return skills;
		}
	});

	// Determin if we have pets, and ifso, detect if they need a bo
	Precast.petBo = (skills, pets) => (
		(pets = getUnits(1).filter(unit => (owner => owner && owner.name === me.name)(unit && unit instanceof Unit && unit.getParent()))).length
		&& skills.concat(getSkills(Precast.precastable
				.filter(x => [sdk.skills.BattleCommand, sdk.skills.BattleOrders, sdk.skills.Shout].indexOf(x.skillId) !== -1)
				.filter(x => !pets.some(pet => !pet.getState(Precast.skillIdToStateId(x.skillId))))
				// Override the needed state
				.map(obj => ((obj.needed = () => true) && false) || obj)
			// Only for those pets that dont have the skill
		))
	) || skills;

	function needSummonable() {

	}

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
			minion: 2, // id of minion
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
			need: (skillId) => needSummonable((() => {
				switch (skillId) {
					case sdk.skills.ClayGolem:
						return 75;
					case sdk.skills.BloodGolem:
						return 85;
					case sdk.skills.FireGolem:
						return 94;

				}
				return undefined;
			})),
			minion: 3
		},

		// Paladin
		{
			skillId: sdk.skills.HolyShield,
		},

		//Druid
		{
			skillId: [sdk.skills.SummonSpiritWolf, sdk.skills.SummonGrizzly],
			minion: 11,
		},
		{
			skillId: sdk.skills.DireWolf,
			minion: 12,
		},
		{
			skillId: [sdk.skills.OakSage, sdk.skills.HeartofWolverine, sdk.skills.SpiritofBarbs],
			//ToDo; make some function that ensure the use of Oak on Hardcore, or anyway give benefit's to the oak skill
			minion: 13,
		},
		{
			skillId: [sdk.skills.PlaguePoppy, sdk.skills.CycleofLife, sdk.skills.Vines],
			minion: 14,
		},
		{
			skillId: sdk.skills.SummonGrizzly,
			minion: 15,
		},
		{
			skillId: sdk.skills.Hurricane,
		},

		// Assa
		{
			skillId: [sdk.skills.Fade, sdk.skills.Quickness],
			handler: function () { // ToDo; some magic decide to either cast fade or BoS
				return Config.UseFade && sdk.skills.Fade || sdk.skills.Quickness;
			}
		},
		{
			skillId: sdk.skills.Venom,
		},
		{
			skillId: [sdk.skills.ShadowWarrior, sdk.skills.ShadowMaster],
			minion: 16,
			// ToDo; make sure this gets unsummoned @ baalruns
		}
	];
	module.exports = Precast;


})(module, require);