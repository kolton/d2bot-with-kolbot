/**
 * @description A library that automatically finds the best places for this char to run
 * @author Jaenster, Nishimura_Katsuo
 */

//ToDo; Make this work propperly
function AutoMagicFind(Config) {
	const excluded = [0, 133, sdk.areas.MaggotLairLvl1, sdk.areas.MaggotLairLvl2, sdk.areas.MaggotLairLvl3, 134, 135, 136, sdk.areas.AncientsWay, sdk.areas.MooMooFarm];
	const wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];
	;

	let areas = AreaData.map(area => {
		let exp = me.diff < 2 ? GameData.areaSoloExp(area.Index) : GameData.areaEffort(area.Index);

		return [area, exp];
	}).sort(me.diff < 2 ? ((a, b) => b[1] - a[1]) : ((a, b) => a[1] - b[1])).filter(area => excluded.indexOf(area[0].Index) < 0);


	Town.doChores();
	//ToDo; Prio lvl 85+ area's
	areas.forEach((area, i) => i < 10 && print(area[0].LocaleString + ' -- ' + area[1]));

	areas.forEach(area => {
		let Area = area[0];
		print('Going to clear ' + area[0].LocaleString);
		print(Area.Index);
		if (Pather.wpAreas.indexOf(Area.Index) !== -1) {
			Town.goToTown();
			Pather.useWaypoint(Area.Index);
		} else {
			Pather.journeyTo(Area.Index);
		}

		//Pather.journeyTo(area[0].Index);
		Attack.clearLevel(0);
	})
}