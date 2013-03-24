/**
*	@filename	ClearAnyArea.js
*	@author		kolton
*	@desc		Clears any area
*/

function ClearAnyArea() {
	var i;

	Town.doChores();

	for (i = 0; i < Config.ClearAnyArea.AreaList.length; i += 1) {
		if (Pather.journeyTo(Config.ClearAnyArea.AreaList[i])) {
			Attack.clearLevel(Config.ClearType);
		}
	}

	return true;
}