/**
*	@filename	BattleOrders.js
*	@author		kolton
*	@desc		give or receive Battle Orders buff
*/

function BattleOrders() {
	Town.doChores();

	try {
		Pather.useWaypoint(35); // catacombs
	} catch (wperror) {
		showConsole();
		print("ÿc1Failed to take waypoint.");
		quit();
	}

	Pather.moveTo(me.x + 6, me.y + 6);

	var bo, leader,
		count = 0;

	function ChatEvent(nick, msg) {
		var playerPartyid = getParty(nick).partyid;

		if (msg === "BO" && playerPartyid !== 65535 && playerPartyid === getParty().partyid) {
			removeEventListener("chatmsg", ChatEvent);

			bo = true;
			leader = nick;
		}
	}

	if (Config.BattleOrders.Mode === 0) {
		addEventListener("chatmsg", ChatEvent);
	}

MainLoop:
	while (true) {
		switch (Config.BattleOrders.Mode) {
		case 0:
			if (bo) {
				Precast.doPrecast(true);

				break MainLoop;
			}

			break;
		case 1:
			if (me.getState(32)) {
				break MainLoop;
			}

			if (count % 10 === 0) { // say "BO" every 5 seconds
				say("BO");
			}

			if (count > 60) { // 30 seconds with no bo
				showConsole();
				print("ÿc1Failed to get BO");
				quit();
			}

			break;
		}

		delay(500);

		count += 1;
	}

	Pather.useWaypoint(1);

	if (Config.BattleOrders.Mode === 0 && Config.BattleOrders.Wait) {
		while (Misc.inMyParty(leader)) {
			delay(1000);
		}
	}

	return true;
}