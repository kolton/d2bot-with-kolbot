function Andariel() {
	Town.doChores();
	Pather.useWaypoint(35);
	Precast.doPrecast(true);

	if (!Pather.moveToExit([36, 37], true)) {
		throw new Error("Failed to move to Catacombs Level 4");
	}

	Pather.moveTo(22561, 9578);
	Attack.kill(156); // Andariel
	delay(2000); // Wait for minions to die.
	Pickit.pickItems();

	return true;
}