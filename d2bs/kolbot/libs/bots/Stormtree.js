/**
*	@filename	Stormtree.js
*	@author		kolton
*	@desc		kill Stormtree
*/

function Stormtree() {
	Town.doChores();
	Pather.useWaypoint(79);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(78, true)) {
		throw new Error("Failed to move to Stormtree");
	}

	Attack.clear(15, 0, getLocaleString(2866)); // Stormtree

	return true;
}