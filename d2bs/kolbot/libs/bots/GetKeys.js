if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function GetKeys() {
	Town.doChores();

	if (!me.findItems("pk1") || me.findItems("pk1").length < 3) {
		try {
			print("ÿc2Countess");
            Pather.useWaypoint(Areas.Act1.Black_Marsh);
			Precast.doPrecast(true);
            Pather.journeyTo(Areas.Act1.Tower_Cellar_Level_5);
            Pather.moveToPreset(me.area, UnitType.Object, 580);
			Attack.kill(getLocaleString(2875));
			Pickit.pickItems();
		} catch (countessError) {
			print("ÿc1Countess failed");
		}
	}

	if (!me.findItems("pk2") || me.findItems("pk2").length < 3) {
		try {
			print("ÿc2Summoner");
			Town.goToTown();
			Town.doChores();
            Pather.useWaypoint(Areas.Act2.Arcane_Sanctuary);
			Precast.doPrecast(true);
            Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Horazons_Journal, -3, -3);
            Attack.kill(UnitClassID.summoner);
			Pickit.pickItems();
		} catch (summonerError) {
			print("ÿc1Summoner failed");
		}
	}

	if (!me.findItems("pk3") || me.findItems("pk3").length < 3) {
		try {
			print("ÿc2Nihlathak");
			Town.goToTown();
			Town.doChores();
            Pather.useWaypoint(Areas.Act5.Halls_Of_Pain);
			Precast.doPrecast(true);
            Pather.moveToExit(Areas.Act5.Halls_Of_Vaught, true);
            Pather.moveToPreset(me.area, UnitType.Object, UniqueObjectIds.Nihlathak_Outside_Town);
            Attack.kill(UnitClassID.nihlathakboss);
			Pickit.pickItems();
		} catch (nihlathakError) {
			print("ÿc1Nihlathak failed");
		}
	}
}