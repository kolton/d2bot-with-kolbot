function WPGetter() {
	Town.doChores();
	Town.goToTown(1);

	var i;

	for (i = 0; i < Pather.wpAreas.length; i += 1) {
		if (!getWaypoint(i) && Pather.wpAreas[i] !== 123) {
			Pather.getWP(Pather.wpAreas[i]);
		}
	}

	return true;
}