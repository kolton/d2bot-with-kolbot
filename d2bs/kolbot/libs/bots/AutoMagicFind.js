/**
 * @description A library that automatically finds the best places for this char to run
 * @author Jaenster, Nishimura_Katsuo
 */

//ToDo; Make this work propperly
function AutoMagicFind(Config) {
	const Promise = require('Promise');
	const Attack = require('Attack');
	const excluded = [0, 133, sdk.areas.MaggotLairLvl1, sdk.areas.MaggotLairLvl2, sdk.areas.MaggotLairLvl3, 134, 135, 136, sdk.areas.AncientsWay, sdk.areas.MooMooFarm];
	const level85 = [sdk.areas.Mausoleum, sdk.areas.PitLvl1, sdk.areas.PitLvl2, sdk.areas.AncientTunnels, sdk.areas.ForgottenTemple, sdk.areas.RuinedFane, sdk.areas.DisusedReliquary, sdk.areas.RiverOfFlame, sdk.areas.ChaosSanctuary, sdk.areas.WorldstoneLvl1, sdk.areas.WorldstoneLvl2, sdk.areas.WorldstoneLvl3, sdk.areas.ThroneOfDestruction];


	let areas = AreaData.map(area => {
		let exp = me.diff < 2 ? GameData.areaSoloExp(area.Index) : GameData.areaEffort(area.Index);

		return [area, exp];
	}).sort(me.diff < 2 ? ((a, b) => b[1] - a[1]) : ((a, b) => a[1] - b[1])).filter(area => level85.indexOf(area[0].Index) !== -1);


	Town.doChores();
	areas.forEach((area, i) => i < 10 && print(area[0].LocaleString + ' -- ' + area[1]));

	areas.forEach(area => {
		let Area = area[0];
		print('Going to clear ' + area[0].LocaleString);
		print(Area.Index);
		Pather.journeyTo(Area.Index);
		switch (Area.Index) {
			case sdk.areas.ChaosSanctuary: //If we are in chaos, simply open all seals
				const star = {x: 7792, y: 5292};
				new Promise(resolve => star.distance < 40 && resolve()).then(function () {
					include('bots/SpeedDiablo.js');
					// Once close to the star, just quickly open all seals
					[sdk.units.DiabloSealVizierInactive, sdk.units.DiabloSealVizierActive,
						sdk.units.DiabloSealSeizActive, sdk.units.DiabloSealInfectorInActive,
						sdk.units.DiabloSealInfectorActive].forEach(seal => {
						let ps = getPresetUnits(108, 2, seal).first();
						print(JSON.stringify(ps));
						ps && ps.moveTo() && ps.unit && SpeedDiablo.openSeal(ps.unit);
					});

					star.moveTo(); // move to the center again
				})


		}

		//Pather.journeyTo(area[0].Index);
		Attack.clearLevel(0);
	})
}