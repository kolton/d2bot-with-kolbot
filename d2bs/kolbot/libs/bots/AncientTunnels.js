/**
*	@filename	AncientTunnels.js
*	@author		kolton
*	@desc		clear Ancient Tunnels
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function AncientTunnels() {
	Town.doChores();
    Pather.useWaypoint(Areas.Act2.Lost_City);
	Precast.doPrecast(true);

    if (Config.AncientTunnels.OpenChest && Pather.moveToPreset(me.area, UnitType.Object, 580) && Misc.openChests(5)) {
		Pickit.pickItems();
	}

    if (Config.AncientTunnels.KillDarkElder && getPresetUnit(me.area, UnitType.NPC, SuperUniques.Dark_Elder) && Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Dark_Elder)) {
		Attack.clear(15, 0, getLocaleString(2886));
	}

    if (!Pather.moveToExit(Areas.Act2.Ancient_Tunnels, true)) {
		throw new Error("Failed to move to Ancient Tunnels");
	}

	Attack.clearLevel(Config.ClearType);

	return true;
}