/**
*	@filename	Coldcrow.js
*	@author		njomnjomnjom
*	@desc		kill Coldcrow
*/

function Coldcrow() {
	Town.doChores();
	Pather.useWaypoint(Areas.Act1.Cold_Plains);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(Areas.Act1.Cave_Level_1, true, false)) {
		throw new Error("Failed to move to Cave");
	}
	
	if (!Pather.moveToPreset(me.area, UnitType.NPC, SuperUniques.Coldcrow, 0, 0, false)) {
		throw new Error("Failed to move to Coldcrow");
	}
	
	Attack.clear(15, 0, getLocaleString(2871)); // Coldcrow
	
	return true;
}