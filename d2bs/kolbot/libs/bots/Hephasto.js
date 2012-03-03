function Hephasto() {
	Town.doChores();
	Pather.useWaypoint(107);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 2, 376)) {
		throw new Error("Failed to move to Hephasto");
	}

	Attack.kill("hephasto the armorer");
	Pickit.pickItems();

	return true;
}