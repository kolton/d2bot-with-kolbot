/***	@filename	ThreshSocket.js*	@author		kolton*	@desc		kill Thresh Socket*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };function ThreshSocket() {	Town.doChores();	Pather.useWaypoint(Areas.Act5.Arreat_Plateau);	Precast.doPrecast(true);    if (!Pather.moveToExit(Areas.Act5.Crystalized_Passage, false)) {		throw new Error("Failed to move to Thresh Socket");	}	Attack.kill(getLocaleString(22498)); // Thresh Socket	Pickit.pickItems();	return true;}