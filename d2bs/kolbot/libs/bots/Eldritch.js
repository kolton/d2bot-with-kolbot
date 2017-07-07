/**
*	@filename	Eldritch.js
*	@author		kolton
*	@desc		kill Eldritch the Rectifier, optionally kill Shenk the Overseer, Dac Farren and open chest
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Eldritch() {
	var chest;

	Town.doChores();
    Pather.useWaypoint(Areas.Act5.Frigid_Highlands);
	Precast.doPrecast(true);
	Pather.moveTo(3745, 5084);
	Attack.clear(15, 0, getLocaleString(22500)); // Eldritch the Rectifier

	if (Config.Eldritch.OpenChest) {
        chest = getPresetUnit(me.area, UnitType.Object, UniqueObjectIds.Special_Chest);

		if (chest) {
			Pather.moveToUnit(chest);

            chest = getUnit(UnitType.Object, UniqueObjectIds.Special_Chest);

			if (Misc.openChest(chest)) {
				Pickit.pickItems();
			}
		}
	}

	if (Config.Eldritch.KillShenk) {
		Pather.moveTo(3876, 5130);
		Attack.clear(15, 0, getLocaleString(22435)); // Shenk the Overseer
	}

	if (Config.Eldritch.KillDacFarren) {
		Pather.moveTo(4478, 5108);
		Attack.clear(15, 0, getLocaleString(22501)); // Dac Farren
	}

	return true;
}