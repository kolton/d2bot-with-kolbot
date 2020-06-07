/**
*	@filename	RiverOfFlame.js
*	@author		tc85
*	@desc		Clear the River of Flame
*/

function RiverOfFlame() {
	Town.doChores();
	Pather.useWaypoint(106);
	Precast.doPrecast(true);
	
	if (Pather.moveToExit(107, true)) {
		Attack.clearLevel(Config.ClearType);
	}

	return true;
}