/**
*	@filename	Izual.js
*	@author		kolton
*	@desc		kill Izual
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function Izual() {
	Town.doChores();
	Pather.useWaypoint(Areas.Act4.City_Of_The_Damned);
	Precast.doPrecast(true);

    if (!Pather.moveToPreset(Areas.Act4.Plains_Of_Despair, UnitType.NPC, UnitClassID.izual)) {
		throw new Error("Failed to move to Izual.");
	}

    Attack.kill(UnitClassID.izual); // Izual
	Pickit.pickItems();

	return true;
}