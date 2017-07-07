/**
*   @filename   TristramLeech.js
*   @author	 ToS/XxXGoD/YGM
*   @desc	   Tristram Leech (Helper)
*/
if (!isIncluded("common/Enums.js")) { include("common/Enums.js"); };

function TristramLeech() {

	var leader, i;
	
	// Get leader's Unit
	this.getLeaderUnit = function (name) {
        var player = getUnit(UnitType.Player, name);

		if (player) {
			do {
                if (player.mode !== PlayerModes.Death && player.mode !== PlayerModes.Dead) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	Town.doChores();
    Pather.useWaypoint(Areas.Act1.Rogue_Encampment); // Back To Rouge
	Town.move("portalspot"); // Portal Spot

	leader = Config.Leader;

	// Check leader isn't in other zones, whilst waiting for portal.
	for (i = 0; i < Config.TristramLeech.Wait; i += 1) {
	
		var whereisleader = getParty(leader);
		
		if (whereisleader) {
            if (whereisleader.area === Areas.Act3.Travincal) {
			   return false;
			}
            if (whereisleader.area === Areas.Act4.Chaos_Sanctuary) {
			   return false;
			}
            if (whereisleader.area === Areas.Act5.Throne_Of_Destruction) {
			   return false;
			}
		}
		
        if (Pather.usePortal(Areas.Act1.Tristram, leader)) {
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
            if (whereisleader.area === Areas.Act1.Tristram) {
				break;
			}
		}
		
		delay(1000);
	}

    while (whereisleader.area === Areas.Act1.Tristram) {

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