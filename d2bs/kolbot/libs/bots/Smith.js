function Smith() {
	Town.doChores();
	Pather.useWaypoint(27);
	Precast.doPrecast(true);

	if (!Pather.moveToPreset(28, 2, 108)) {
		throw new Error("Failed to move to the Smith");
	}

	Attack.kill("the smith");
	Pickit.pickItems();

	return true;
}