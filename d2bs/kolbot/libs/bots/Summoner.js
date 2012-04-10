function Summoner() {
	Town.doChores();
	Pather.useWaypoint(74);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(me.area, 2, 357)) {
		throw new Error("Failed to move to Summoner");
	}

	Attack.kill("the summoner");
	Pickit.pickItems();

	return true;
}