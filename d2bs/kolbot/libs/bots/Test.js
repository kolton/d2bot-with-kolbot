function Test() {
	print("ÿc8TESTING");
	
	var c;

	function KeyDown(key) {
		//print(key);
		
		if (key === 45) {
			c = true;
		}
	}
	
	addEventListener("keydown", KeyDown);
	
	while (true) {
		if (c) {
			test();
			
			c = false;
		}
		
		delay(10);
	}
}

function test() {
	pickPotions(20);
}

	var pickPotions = function (range) {
		Town.clearBelt();

		while (!me.idle) {
			delay(40);
		}

		var status,
			pickList = [],
			item = getUnit(4);

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && item.itemType >= 76 && item.itemType <= 78 && getDistance(me, item) <= range) {
					pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		pickList.sort(Pickit.sortItems);

		while (pickList.length > 0) {
			item = pickList.shift();

			if (!item || !copyUnit(item).x) {
				continue;
			}

			status = Pickit.checkItem(item);

			if (!status) {
				continue;
			}

			if (!Pickit.canPick(item)) {
				continue;
			}

			Pickit.pickItem(item, status);
		}
	};