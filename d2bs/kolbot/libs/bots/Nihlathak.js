function Nihlathak() {
	Town.doChores();
	Pather.useWaypoint(123);
	Precast.doPrecast(false);

	if (!Pather.moveToExit(124, true)) {
		throw new Error("Failed to go to Nihlathak");
	}

	Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);
	Attack.kill("nihlathak");
	Pickit.pickItems();

	return true;
}