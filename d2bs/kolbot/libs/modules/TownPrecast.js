/**
 * @author Jaenster
 * @description Determin if we can precast in town
 */

(function (module, require) {

	/**
	 * @return {boolean}
	 */
	function TownPrecast() {
		let skills = this.can;
		return skills && !skills.forEach(sk => Skill.cast(sk));
	}

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
			const wantToCast = require('Precast').skills;
			return !!wantToCast.filter(sk => TownPrecast.indexOf(sk) > -1).length === wantToCast.length && wantToCast;
		}
	});
	module.exports = TownPrecast;
})(module, require);