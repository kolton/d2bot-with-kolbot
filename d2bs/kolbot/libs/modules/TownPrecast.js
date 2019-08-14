/**
 * @author Jaenster
 * @description Determin if we can precast in town
 */

(function (module, require) {
	const Precast = require('Precast');
	/**
	 * @return {boolean}
	 */
	function TownPrecast() {
		let skills = TownPrecast.can;
		// print(JSON.stringify(skills && skills.map(getSkillById)));
		return skills && Precast(skills);
	}

	/**
	 * @description Cast what we can in town already.
	 */
	TownPrecast.prepare = function() {
		Precast(Precast.skills.filter(sk=>TownPrecast.townCastable.indexOf(sk.skillId) > -1));
	};

	TownPrecast.townCastable = [
		sdk.skills.Valkyrie, sdk.skills.FrozenArmor, sdk.skills.ShiverArmor, sdk.skills.EnergyShield, sdk.skills.Enchant,
		sdk.skills.ChillingArmor, sdk.skills.BoneArmor, sdk.skills.ClayGolem, sdk.skills.BloodGolem, sdk.skills.FireGolem,
		sdk.skills.HolyShield, sdk.skills.Raven, sdk.skills.PlaguePoppy, sdk.skills.OakSage, sdk.skills.SummonSpiritWolf,
		sdk.skills.CycloneArmor, sdk.skills.HeartofWolverine, sdk.skills.SummonFenris, sdk.skills.SpiritofBarbs,
		sdk.skills.SummonGrizzly, sdk.skills.BurstOfSpeed, sdk.skills.Fade, sdk.skills.ShadowWarrior, sdk.skills.BladeShield,
		sdk.skills.Venom, sdk.skills.ShadowMaster
	];

	Object.defineProperty(TownPrecast, 'can', {
		get: function () {
			const wantToCast = Precast.skills;
			print(JSON.stringify(wantToCast));
			return wantToCast.every(sk => TownPrecast.townCastable.indexOf(sk.skillId) > -1) && wantToCast;
		}
	});
	module.exports = TownPrecast;

})(module, require);