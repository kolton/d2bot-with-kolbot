/**
*	@filename	Eldritch.js
*	@author		kolton
*	@desc		kill Eldritch the Rectifier, optionally kill Shenk the Overseer, Dac Farren and open chest
*/

function Eldritch() {
	var chest;

	Town.doChores();
	Pather.useWaypoint(111);
	Precast.doPrecast(true);
	Pather.moveTo(3745, 5084, 3, Config.ClearPath);
	Attack.clear(15, 0, getLocaleString(22500)); // Eldritch the Rectifier

	if (Config.Eldritch.OpenChest) {
		chest = getPresetUnit(me.area, 2, 455);

		if (chest) {
			Pather.moveToUnit(chest, 0, 0, Config.ClearPath);

			chest = getUnit(2, 455);

			if (Misc.openChest(chest)) {
				Pickit.pickItems();
			}
		}
	}

	if (Config.Eldritch.KillShenk) {
		Pather.moveTo(3876, 5130, 3, Config.ClearPath);
		Attack.clear(15, 0, getLocaleString(22435)); // Shenk the Overseer
	}

	if (Config.Eldritch.KillDacFarren) {
		Pather.moveTo(4478, 5108, 3, Config.ClearPath);
		Attack.clear(15, 0, getLocaleString(22501)); // Dac Farren
	}

	return true;
}