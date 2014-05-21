/**
*	@filename	CraftingSystem.js
*	@author		kolton
*	@desc		Multi-profile crafting system
*
*	@notes		This system is experimental, there will be no support offered for it.
*				If you can't get it to work, leave it be.
*/

var CraftingSystem = {};

CraftingSystem.Teams = {
	"Team 1": {
		// List of profiles that will collect ingredients
		Collectors: [],

		// List of profiles that will craft/reroll items
		Workers: [],

		// List of Worker game names (without the numbers)
		CraftingGames: [],

		/*	BaseItems - list of base item class ids
		*	Ingredients - list of recipe ingredients
		*	SetAmount - number of full sets to gather before transfering
		*	Type - the type of recipe. Available options: "crafting", "runewords", "cubing"
		*/
		Sets: [
			// LLD Crafting

			// Caster Belt set, char lvl 29
			// Light Belt classid 345, shopped at nightmare Elzix
			// Sharkskin Belt classid 391, shopped at nightmare Elzix
			//{BaseItems: [345, 391], Ingredients: [615, 643, 561], SetAmount: 2, Type: "crafting"},

			// Runeword Making

			// Spirit Runeset + Hel
			//{BaseItems: [29, 30, 31], Ingredients: [616, 618, 619, 620, 624], SetAmount: 2, Type: "runewords"},

			// Misc. Cubing

			// Reroll rare Diadem
			//{BaseItems: [421], Ingredients: [601, 601, 601], SetAmount: 1, Type: "cubing"}
		]
	}
};

// ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##

// Get the Crafting System information for current profile
CraftingSystem.getInfo = function () {
	var i, j, info;

	for (i in CraftingSystem.Teams) {
		if (CraftingSystem.Teams.hasOwnProperty(i)) {
			for (j = 0; j < CraftingSystem.Teams[i].Collectors.length; j += 1) {
				if (CraftingSystem.Teams[i].Collectors[j].toLowerCase() === me.profile.toLowerCase()) {
					info = CraftingSystem.Teams[i];
					info.collector = true;
					info.worker = false;

					return info;
				}
			}

			for (j = 0; j < CraftingSystem.Teams[i].Workers.length; j += 1) {
				if (CraftingSystem.Teams[i].Workers[j].toLowerCase() === me.profile.toLowerCase()) {
					info = CraftingSystem.Teams[i];
					info.collector = false;
					info.worker = true;

					return info;
				}
			}
		}
	}

	return false;
};

// #################################################
// # Item collector out of game specific functions #
// #################################################

CraftingSystem.check = false;
CraftingSystem.inGame = false;

CraftingSystem.outOfGameCheck = function () {
	if (!CraftingSystem.check) {
		return false;
	}

	var worker,
		info = CraftingSystem.getInfo();

	function scriptMsg(msg) {
		var obj;

		try {
			obj = JSON.parse(msg);
		} catch (e) {
			return false;
		}

		if (obj.name === "RequestWorker") {
			scriptBroadcast(JSON.stringify({name: "WorkerName", value: worker.name}));
		}

		return true;
	}

	if (info && info.collector) {
		worker = CraftingSystem.getWorker();

		if (worker && worker.game) {
			D2Bot.printToConsole("CraftingSystem: Transfering items.", 7);
			D2Bot.updateStatus("CraftingSystem: In game.");
			addEventListener("scriptmsg", scriptMsg);

			CraftingSystem.inGame = true;
			me.blockMouse = true;

			delay(2000);
			joinGame(worker.game[0], worker.game[1]);

			me.blockMouse = false;

			delay(5000);

			while (me.ingame) {
				delay(1000);
			}

			CraftingSystem.inGame = false;
			CraftingSystem.check = false;

			removeEventListener("scriptmsg", scriptMsg);

			return true;
		}
	}

	return false;
};

CraftingSystem.getWorker = function () {
	var i,
		rval = {
			game: false,
			name: false
		},
		info = CraftingSystem.getInfo();

	function CheckEvent(mode, msg) {
		var i;

		if (mode === 4) {
			for (i = 0; i < info.CraftingGames.length; i += 1) {
				if (info.CraftingGames[i] && msg.match(info.CraftingGames[i], "i")) {
					rval.game = msg.split('/');

					break;
				}
			}
		}
	}

	if (info && info.collector) {
		addEventListener('copydata', CheckEvent);

		rval.game = false;

		for (i = 0; i < info.Workers.length; i += 1) {
			sendCopyData(null, info.Workers[i], 0, JSON.stringify({name: "GetGame", profile: me.profile}));
			delay(100);

			if (rval.game) {
				rval.name = info.Workers[i];

				break;
			}
		}

		removeEventListener('copydata', CheckEvent);

		return rval;
	}

	return false;
};

// #############################################
// # Item collector in-game specific functions #
// #############################################

CraftingSystem.inGameCheck = function () {
	var i,
		info = CraftingSystem.getInfo();

	if (info && info.collector) {
		for (i = 0; i < info.CraftingGames.length; i += 1) {
			if (info.CraftingGames[i] && me.gamename.match(info.CraftingGames[i], "i")) {
				CraftingSystem.dropItems();
				me.cancel();
				delay(5000);
				quit();

				return true;
			}
		}
	}

	return false;
};

CraftingSystem.neededItems = [];
CraftingSystem.validGids = [];
CraftingSystem.itemList = [];
CraftingSystem.fullSets = [];

// Check whether item can be used for crafting
CraftingSystem.validItem = function (item) {
	switch (item.itemType) {
	case 58: // Jewel
		return NTIP.CheckItem(item) === 0; // Use junk jewels only
	}

	return true;
};

// Check if the item should be picked for crafting
CraftingSystem.checkItem = function (item) {
	var i,
		info = CraftingSystem.getInfo();

	if (info) {
		for (i = 0; i < CraftingSystem.neededItems.length; i += 1) {
			if (item.classid === CraftingSystem.neededItems[i] && CraftingSystem.validItem(item)) {
				return true;
			}
		}
	}

	return false;
};

// Check if the item should be kept or dropped
CraftingSystem.keepItem = function (item) {
	var info = CraftingSystem.getInfo();

	if (info) {
		if (info.collector) {
			return CraftingSystem.validGids.indexOf(item.gid) > -1;
		}

		if (info.worker) {
			if (item.quality === 8) { // Let pickit decide whether to keep crafted
				return false;
			}

			return true;
		}
	}

	return false;
};

// Collect ingredients only if a worker needs them
CraftingSystem.getSetInfoFromWorker = function (workerName) {
	var setInfo = false,
		info = CraftingSystem.getInfo();

	function copyData(mode, msg) {
		var obj;

		if (mode === 4) {
			try {
				obj = JSON.parse(msg);
			} catch (e) {
				return false;
			}

			if (obj && obj.name === "SetInfo") {
				setInfo = obj.value;
			}
		}

		return true;
	}

	if (info && info.collector) {
		addEventListener("copydata", copyData);
		sendCopyData(null, workerName, 0, JSON.stringify({name: "GetSetInfo", profile: me.profile}));
		delay(100);

		if (setInfo !== false) {
			removeEventListener("copydata", copyData);

			return setInfo;
		}

		removeEventListener("copydata", copyData);
	}

	return false;
};

CraftingSystem.init = function (name) {
	var i, setInfo,
		info = CraftingSystem.getInfo();

	if (info && info.collector) {
		for (i = 0; i < info.Sets.length; i += 1) {
			info.Sets[i].Enabled = false;
		}

		setInfo = CraftingSystem.getSetInfoFromWorker(name);

		if (setInfo) {
			for (i = 0; i < setInfo.length; i += 1) {
				if (setInfo[i] === 1 && info.Sets[i].Enabled === false) {
					info.Sets[i].Enabled = true;
				}
			}
		}
	}
};

// Build global lists of needed items and valid ingredients
CraftingSystem.buildLists = function (onlyNeeded) {
	var i,
		info = CraftingSystem.getInfo();

	if (info && info.collector) {
		CraftingSystem.neededItems = [];
		CraftingSystem.validGids = [];
		CraftingSystem.fullSets = [];
		CraftingSystem.itemList = me.findItems(-1, 0);

		for (i = 0; i < info.Sets.length; i += 1) {
			if (!onlyNeeded || info.Sets[i].Enabled) {
				CraftingSystem.checkSet(info.Sets[i]);
			}
		}

		return true;
	}

	return false;
};

// Check which ingredients a set needs and has
CraftingSystem.checkSet = function (set) {
	var i, j, amount,
		rval = {},
		setNeeds = [],
		setHas = [];

	// Get what set needs
	for (amount = 0; amount < set.SetAmount; amount += 1) { // Multiply by SetAmount
		for (i = 0; i < set.Ingredients.length; i += 1) {
			setNeeds.push(set.Ingredients[i]);
		}
	}

	// Remove what set already has
	for (i = 0; i < setNeeds.length; i += 1) {
		for (j = 0; j < CraftingSystem.itemList.length; j += 1) {
			if (CraftingSystem.itemList[j].classid === setNeeds[i]) {
				setHas.push(CraftingSystem.itemList[j].gid);
				setNeeds.splice(i, 1);
				CraftingSystem.itemList.splice(j, 1);

				i -= 1;
				j -= 1;
			}
		}
	}

	// The set is complete
	if (setNeeds.length === 0) {
		CraftingSystem.fullSets.push(setHas.slice());
	}

	CraftingSystem.neededItems = CraftingSystem.neededItems.concat(setNeeds);
	CraftingSystem.validGids = CraftingSystem.validGids.concat(setHas);

	CraftingSystem.neededItems.sort(Sort.numbers);
	CraftingSystem.validGids.sort(Sort.numbers);

	return rval;
};

// Update lists when a valid ingredient is picked
CraftingSystem.update = function (item) {
	CraftingSystem.neededItems.splice(CraftingSystem.neededItems.indexOf(item.classid), 1);
	CraftingSystem.validGids.push(item.gid);

	return true;
};

// Cube flawless gems if the ingredient is a perfect gem
CraftingSystem.checkSubrecipes = function () {
	var i;

	for (i = 0; i < CraftingSystem.neededItems.length; i += 1) {
		switch (CraftingSystem.neededItems[i]) {
		case 561: // Pgems
		case 566:
		case 571:
		case 576:
		case 581:
		case 586:
		case 601:
			if (Cubing.subRecipes.indexOf(CraftingSystem.neededItems[i]) === -1) {
				Cubing.subRecipes.push(CraftingSystem.neededItems[i]);
				Cubing.recipes.push({
					Ingredients: [CraftingSystem.neededItems[i] - 1, CraftingSystem.neededItems[i] - 1, CraftingSystem.neededItems[i] - 1],
					Index: 0,
					AlwaysEnabled: true,
					MainRecipe: "Crafting"
				});
			}

			break;
		}
	}

	return true;
};

// Check if there are any complete ingredient sets
CraftingSystem.checkFullSets = function () {
	var i,
		info = CraftingSystem.getInfo();

	if (info && info.collector) {
		for (i = 0; i < info.Workers.length; i += 1) {
			CraftingSystem.init(info.Workers[i]);
			CraftingSystem.buildLists(true);

			if (CraftingSystem.fullSets.length) {
				return true;
			}
		}
	}

	return false;
};

// Drop complete ingredient sets
CraftingSystem.dropItems = function () {
	Town.goToTown(1);
	Town.move("stash");
	Town.openStash();

	var gidList, item, worker;

	function scriptMsg(msg) {
		var obj;

		try {
			obj = JSON.parse(msg);
		} catch (e) {
			return false;
		}

		if (obj.name === "WorkerName") {
			worker = obj.value;
		}

		return true;
	}

	addEventListener("scriptmsg", scriptMsg);
	scriptBroadcast(JSON.stringify({name: "RequestWorker"}));
	delay(100);

	if (worker) {
		CraftingSystem.init(worker);
		CraftingSystem.buildLists(true);
		removeEventListener("scriptmsg", scriptMsg);

		while (CraftingSystem.fullSets.length) {
			gidList = CraftingSystem.fullSets.shift();

			while (gidList.length) {
				item = me.getItem(-1, -1, gidList.shift());

				if (item) {
					item.drop();
				}
			}
		}

		CraftingSystem.dropGold();
		delay(1000);
		me.cancel();
	}

	return true;
};

CraftingSystem.dropGold = function () {
	Town.goToTown(1);
	Town.move("stash");

	if (me.getStat(14) >= 10000) {
		gold(10000);
	} else if (me.getStat(15) + me.getStat(14) >= 10000) {
		Town.openStash();
		gold(10000 - me.getStat(14), 4);
		gold(10000);
	}
};