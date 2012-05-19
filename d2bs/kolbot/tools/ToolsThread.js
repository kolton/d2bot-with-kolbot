/**
*	@filename	ToolsThread.js
*	@author		kolton
*	@desc		several tools to help the player - potion use, chicken, Diablo clone stop, map reveal, quit with player
*/

function main() {
	var i, mercHP, ironGolem,
		quitFlag = false,
		timerLastDrink = [];

	include("OOG.js");
	include("common/Config.js");
	include("common/Cubing.js");
	include("common/Pather.js");
	include("common/Prototypes.js");
	include("common/Runewords.js");
	include("common/Town.js");
	print("ÿc3Start ToolsThread script");
	Config.init();

	for (i = 0; i < 5; i += 1) {
		timerLastDrink[i] = 0;
	}

	// Reset core chicken
	me.chickenhp = -1;
	me.chickenmp = -1;

	// General functions
	this.getPotion = function (pottype) {
		var i, length,
			items = me.getItems();

		if (!items) {
			return false;
		}

		for (i = 0, length = items.length; i < length; i = i + 1) {
			if (pottype === 78 && items[i].mode === 0 && items[i].location === 3 && items[i].itemType === 78) {
				print("ÿc2Drinking rejuventation potion from inventory.");

				return copyUnit(items[i]);
			}

			if (items[i].mode === 2 && items[i].itemType === pottype) {
				return copyUnit(items[i]);
			}
		}

		return false;
	};

	this.togglePause = function () {
		var script = getScript("default.dbj");

		if (script) {
			if (script.running) {
				print("ÿc1Pausing.");
				script.pause();
			} else {
				print("ÿc2Resuming.");
				script.resume();
			}
		}
	};

	this.drinkPotion = function (type) {
		var pottype, potion,
			tNow = getTickCount();

		switch (type) {
		case 0:
		case 1:
			if ((timerLastDrink[type] && (tNow - timerLastDrink[type] < 1000)) || me.getState(type === 0 ? 100 : 106)) {
				return false;
			}

			break;
		case 2:
		case 4:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 500)) { // small delay for juvs just to prevent using more at once
				return false;
			}

			break;
		default:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 8000)) {
				return false;
			}

			break;
		}

		if (me.mode === 0 || me.mode === 17 || me.mode === 18) { // mode 18 - can't drink while leaping/whirling etc.
			return false;
		}

		switch (type) {
		case 0:
		case 3:
			pottype = 76;
			break;
		case 1:
			pottype = 77;
			break;
		default:
			pottype = 78;
			break;
		}

		potion = this.getPotion(pottype);

		if (potion) {
			if (me.mode === 0 || me.mode === 17) {
				return false;
			}

			if (type < 3) {
				potion.interact();
			} else {
				clickItem(2, potion);
			}

			timerLastDrink[type] = getTickCount();

			return true;
		}

		return false;
	};

	this.getNearestMonster = function () {
		var gid, distance,
			monster = getUnit(1),
			range = 30;

		if (monster) {
			do {
				if (monster.hp > 0 && !monster.getParent()) {
					distance = getDistance(me, monster);

					if (distance < range) {
						range = distance;
						gid = monster.gid;
					}
				}
			} while (monster.getNext());
		}

		monster = getUnit(1, -1, -1, gid);

		if (monster) {
			return ". Nearest monster: " + monster.name;
		}

		return ".";
	};

	this.getIronGolem = function () {
		var golem = getUnit(1, "iron golem");

		if (!golem) {
			return false;
		}

		do {
			if (golem.getParent().name === me.name) {
				return golem;
			}
		} while (golem.getNext());

		return false;
	};

	// Event functions
	this.revealArea = function (area) {
		var room = getRoom(area);

		do {
			if (room instanceof Room && room.area === area) {
				room.reveal(true);
			}
		} while (room.getNext());
	};

	this.quitWithLeader = function (mode, param1, param2, name1, name2) {
		if (mode === 0 || mode === 1 || mode === 3) {
			if (Config.QuitList.indexOf(name1) > -1) {
				print(name1 + (mode === 0 ? " timed out" : " left"));

				quitFlag = true;
			}
		}
	};

	addEventListener("gameevent", this.quitWithLeader);
	addEventListener("scriptmsg",
		function (msg) {
			switch (msg) {
			case "dclone":
				this.togglePause();
				Town.goToTown();
				showConsole();
				print("ÿc4Diablo Walks the Earth");

				me.maxgametime = 0;

				break;
			}
		}
		);

	addEventListener("keyup",
		function (key) {
			switch (key) {
			case 19: // Pause/Break key
				this.togglePause();

				break;
			case 123: // F12 key
				me.overhead("Revealing " + getArea().name);
				this.revealArea(me.area);

				break;
			}
		}
		);

	while (me.ingame) {
		if (!me.inTown) {
			if (Config.UseHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseHP / 100)) {
				this.drinkPotion(0);
			}

			if (Config.UseRejuvHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseRejuvHP / 100)) {
				this.drinkPotion(2);
			}

			if (Config.LifeChicken > 0 && me.hp <= Math.floor(me.hpmax * Config.LifeChicken / 100)) {
				D2Bot.updateChickens();
				D2Bot.printToConsole("Life Chicken: " + me.hp + "/" + me.hpmax + " in " + getArea().name + this.getNearestMonster() + ";1");

				me.chickenhp = me.hpmax; // Just to trigger the core chicken

				break;
			}

			if (Config.UseMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseMP / 100)) {
				this.drinkPotion(1);
			}

			if (Config.UseRejuvMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseRejuvMP / 100)) {
				this.drinkPotion(2);
			}

			if (Config.ManaChicken > 0 && me.mp <= Math.floor(me.mpmax * Config.ManaChicken / 100)) {
				D2Bot.updateChickens();
				D2Bot.printToConsole("Mana Chicken: " + me.mp + "/" + me.mpmax + " in " + getArea().name + ";1");

				me.chickenmp = me.mpmax; // Just to trigger the core chicken

				break;
			}

			if (Config.IronGolemChicken > 0 && me.classid === 2) {
				if (!ironGolem || !copyUnit(ironGolem).x) {
					ironGolem = this.getIronGolem();
				}

				if (ironGolem) {
					if (ironGolem.hp <= Math.floor(128 * Config.IronGolemChicken / 100)) { // ironGolem.hpmax is bugged with BO
						D2Bot.updateChickens();
						D2Bot.printToConsole("Irom Golem Chicken in " + getArea().name + ";1");
						quit();

						break;
					}
				}
			}

			if (Config.UseMerc) {
				mercHP = getMercHP();

				if (mercHP > 0) {
					if (mercHP < Config.MercChicken) {
						quit();

						break;
					}

					if (mercHP < Config.UseMercRejuv) {
						this.drinkPotion(4);
					} else if (mercHP < Config.UseMercHP) {
						this.drinkPotion(3);
					}
				}
			}
		}

		if (quitFlag) {
			quit();

			break;
		}

		delay(10);
	}
}