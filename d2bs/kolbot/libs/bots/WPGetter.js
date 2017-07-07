if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function WPGetter() {
	Town.doChores();
	Town.goToTown(1);
	Pather.getWP(me.area);

	var i, access;

	for (i = 0; i < Pather.wpAreas.length; i += 1) {
        if (Pather.wpAreas[i] < Areas.Act2.Lut_Gholein) {
			access = true;
        } else if (Pather.wpAreas[i] >= Areas.Act2.Lut_Gholein && Pather.wpAreas[i] < Areas.Act3.Kurast_Docktown) {
			access = Pather.accessToAct(2);
        } else if (Pather.wpAreas[i] >= Areas.Act3.Kurast_Docktown && Pather.wpAreas[i] < Areas.Act4.The_Pandemonium_Fortress) {
			access = Pather.accessToAct(3);
        } else if (Pather.wpAreas[i] >= Areas.Act4.The_Pandemonium_Fortress && Pather.wpAreas[i] < Areas.Act5.Harrogath) {
			access = Pather.accessToAct(4);
        } else if (Pather.wpAreas[i] >= Areas.Act5.Harrogath) {
			access = Pather.accessToAct(5);
		}
		
        if (access && !getWaypoint(i) && Pather.wpAreas[i] !== Areas.Act5.Halls_Of_Pain) {
			Pather.getWP(Pather.wpAreas[i]);
		}
	}

	return true;
}