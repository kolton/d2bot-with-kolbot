/**
*	@filename	CrushTele.js
*	@author		kolton
*	@desc		Auto tele for classic rush only
*				Hit the "-" numpad in strategic areas.
*/

function CrushTele() {
	var go = false;

	addEventListener("keyup",
		function (key) {
			if (key === 109) {
				go = true;
			}
		}
	);

	while (true) {
		if (go) {
			switch (me.area) {
			case 35:
				Pather.moveToExit([36, 37], true);
				break;
			case 57:
				Pather.moveToExit(60, true);
				Pather.moveToPreset(me.area, 2, 354);
				break;
			case 43:
				Pather.moveToExit([62, 63, 64], true);
				Pather.moveToPreset(me.area, 2, 356);
				break;
			case 44:
				Pather.moveToExit([45, 58, 61], true);
				break;
			case 46:
				Pather.moveToExit(getRoom().correcttomb, true);
				Pather.moveToPreset(me.area, 2, 152);
				break;
			case 74:
				Pather.moveToPreset(me.area, 2, 357, 0, 0, false , true);
				break;
			case 101:
				Pather.moveToExit(102, true);
				break;
			case 107:
				Pather.moveToPreset(108, 2, 255);
				break;
			}

			go = false;
		}

		delay(10);
	}
}