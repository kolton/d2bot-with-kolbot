/**
*   @filename   TravincalLeech.js
*   @author	 ToS/XxXGoD/YGM
*   @desc	   Travinical Leech
*/

function TravincalLeech() {

	var leader, whereisleader, partyleader, i, orgX, orgY;
	
	this.buildList = function () {
		var monsterList = [],
			monster = getUnit(1);

		if (monster) {
			do {
				if ([345, 346, 347].indexOf(monster.classid) > -1 && Attack.checkMonster(monster)) {
					monsterList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		return monsterList;
	}

	Town.doChores();
	Pather.useWaypoint(75);
	Town.move("portalspot"); 

	leader = Config.Leader;

	for (i = 0; i < Config.TravincalLeech.Wait; i += 1) {
	
		whereisleader = getParty(leader);
		if (whereisleader) {
			if (whereisleader.area === 108) {
			   return false;
			}
			if (whereisleader.area === 131) {
			   return false;
			}
		} 
	
		if (Pather.usePortal(83, null)) { // leader fails so take first portal to location
			break;
		}
			delay(1000);
	}

	if (i === Config.TravincalLeech.Wait) {
		throw new Error("No portal found to Travincal.");
	}

	partyleader = getParty(leader);
	
	if (partyleader.area === 83) {
		Precast.doPrecast(true);
	}

	while (partyleader.area === 83) {
		if (Config.TravincalLeech.Helper) {
			orgX = me.x;
			orgY = me.y;
			Pather.moveTo(orgX + 7, orgY - 40);
			Attack.clearList(this.buildList());
		}
		else
		{
			Attack.clear(10);  // Self Protect
		}
		delay(1000);
	}

	return true;
}