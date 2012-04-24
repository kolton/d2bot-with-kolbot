/**
*	@filename	BattleOrders.js
*	@author		kolton
*	@desc		give or receive Battle Orders buff
*/

function BattleOrders() {
	Pather.useWaypoint(35); // catacombs
	Pather.moveTo(me.x + 5, me.y);

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
				throw new Error("Failed to get BO");
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