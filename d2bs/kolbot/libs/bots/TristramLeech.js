/**
*   @filename   TristramLeech.js
*   @author	 ToS/XxXGoD/YGM
*   @desc	   Tristram Leech (Helper)
*/

function TristramLeech() {

	var leader, i;
	
	// Get leader's Unit
	this.getLeaderUnit = function (name) {
		var player = getUnit(0, name);

		if (player) {
			do {
				if (player.mode !== 0 && player.mode !== 17) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	Town.doChores();
	Pather.useWaypoint(1); // Back To Rouge
	Town.move("portalspot"); // Portal Spot

	leader = Config.Leader;

	// Check leader isn't in other zones, whilst waiting for portal.
	for (i = 0; i < Config.TristramLeech.Wait; i += 1) {
	
		var whereisleader = getParty(leader);
		
		if (whereisleader) {
			if (whereisleader.area === 83) {
			   return false;
			}
			if (whereisleader.area === 108) {
			   return false;
			}
			if (whereisleader.area === 131) {
			   return false;
			}
		}
		
		if (Pather.usePortal(38, leader)) {
			break;
		}
		
		delay(1000);
	}

	if (i === Config.TristramLeech.Wait) {
		throw new Error("No portal found to Tristram.");
	}
	
	Precast.doPrecast(true);
	delay(3000);

	for (i = 0; i < 30; i += 1) {
		
		var whereisleader = getParty(leader);
			
		if (whereisleader) {
			if (whereisleader.area === 38) {
				break;
			}
		}
		
		delay(1000);
	}

	while (whereisleader.area === 38) {

		var whereisleader = getParty(leader);
		var leaderUnit = this.getLeaderUnit(leader);
	
		if (whereisleader.area === me.area){
			try{
				if (copyUnit(leaderUnit).x) {
					if (getDistance(me, leaderUnit) > 4) {
						Pather.moveToUnit(leaderUnit);
						Attack.clear(10);   
					}
				} else {
						Pather.moveTo(copyUnit(leaderUnit).x, copyUnit(leaderUnit).y);
						Attack.clear(10);
				}
			}
			catch(err){
				if (whereisleader.area === me.area){
					Pather.moveTo(whereisleader.x, whereisleader.y);
					Attack.clear(10);
				}
			}
		}
		
		delay(100);
	}
	
	//if (partyleader.area === 38) {
	//	Attack.clearLevel(0);
	//}

	return true;
}