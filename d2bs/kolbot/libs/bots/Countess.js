/**
*	@filename	Countess.js
*	@author		kolton//Unseen Changed to clear on the way to countess for walking or teleporting and fixed common crash when trying to find countess
*	@desc		walk/teleport to kill The Countess and monsters along the way
*/

function Countess() {
				Town.doChores();
				Pather.useWaypoint(6, true);
				Pather.moveToExit([20, 21], true, Config.ClearType);
				Pather.moveToExit([21, 22], true, Config.ClearType);
				Pather.moveToExit([22, 23], true, Config.ClearType);
				Pather.moveToExit([23, 24], true, Config.ClearType);
				Pather.moveToExit([24, 25], true, Config.ClearType);
				Precast.doPrecast(true);
				Attack.clearLevel();
				Town.goToTown();

	return true;
}
