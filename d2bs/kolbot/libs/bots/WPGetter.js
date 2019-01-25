function WPGetter() {
	Town.doChores();
	Town.goToTown(1);
	Pather.getWP(me.area);

	var i, access;

	for (i = 0; i < Pather.wpAreas.length; i += 1) {
		if (Pather.wpAreas[i] < 40) {
			access = true;
		} else if (Pather.wpAreas[i] >= 40 && Pather.wpAreas[i] < 75) {
			access = Pather.accessToAct(2);
		} else if (Pather.wpAreas[i] >= 75 && Pather.wpAreas[i] < 103) {
			access = Pather.accessToAct(3);
		} else if (Pather.wpAreas[i] >= 103 && Pather.wpAreas[i] < 109) {
			access = Pather.accessToAct(4);
		} else if (Pather.wpAreas[i] >= 109) {
			access = Pather.accessToAct(5);
		}

		if (access && !getWaypoint(i) && Pather.wpAreas[i] !== 123) {
			Pather.getWP(Pather.wpAreas[i]);
		}
	}

	return true;
}