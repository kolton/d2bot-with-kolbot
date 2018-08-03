/**
*	@filename	Smith.js
*	@author		kolton//Unseen Changed to clear on the way to Smith for walking or teleporting and fixed common crash when trying to find smith and added quest check to get imbue quest if it hasn't been completed
*	@desc		walk/teleport to kill The smith and monsters along the way and get quest 
*/

function Smith() {
			 var hammer, stand, charsi;
				Town.doChores(); 
				Pather.useWaypoint(27, true);
				Pather.moveToExit([27, 28], true, Config.ClearType);
				Pather.moveToExit([28, 29], true, Config.ClearType);
				Pather.moveToExit([29, 28], true, Config.ClearType);
							 try {
                    Pather.moveToPreset(28, 2, 108 , true, Config.ClearType);
                    Attack.kill(getLocaleString(2889)); // smith
                } catch (e) {
                    print(e);
					Pather.moveToPreset(me.area, 2, 108, 0, 0, Config.ClearType);
                    Attack.clear(30); //try
                }
				if (!me.getQuest(3, 0)) {				
				stand = getUnit(2, 108);
				Misc.openChest(stand);
				delay(500);
				hammer = getUnit(4, 89);
				Pickit.pickItem(hammer);
				Town.goToTown();
				Town.move("charsi");
				charsi = getUnit(1, "charsi");
				charsi.openMenu();
				me.cancel(); ////Imbue quest
}
Town.goToTown();

	return true;
}
