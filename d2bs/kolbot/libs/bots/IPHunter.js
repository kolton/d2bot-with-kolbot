/**
*	@filename	IPHunter.js
*	@author		kolton
*	@desc		search for a "hot" IP and stop if the correct server is found
*/

function IPHunter() {
	var ip = Number(me.gameserverip.split(".")[3]);

	if (Config.IPHunter.IPList.indexOf(ip) > -1) {
		print("IP found!");
		me.maxgametime = 0;

		while (true) {
			me.overhead("IP found!");
			beep(); // works if windows sounds are enabled
			Town.move("waypoint");
			Town.move("stash");
			delay(60e3);
		}
	}

	delay(Config.IPHunter.GameLength * 60e3);

	return true;
}