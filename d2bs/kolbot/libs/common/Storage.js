/**
*	@filename	Storage.js
*	@author		McGod, kolton (small kolbot related edits)
*	@desc		manage inventory, belt, stash, cube
*/

var Container = function (name, width, height, location) {
	var h, w;

	this.name = name;
	this.width = width;
	this.height = height;
	this.location = location;
	this.buffer = [];
	this.itemList = [];
	this.openPositions = this.height * this.width;

	// Initalize the buffer array for use, set all as empty.
	for (h = 0; h < this.height; h += 1) {
		this.buffer.push([]);

		for (w = 0; w < this.width; w += 1) {
			this.buffer[h][w] = 0;
		}
	}

	/* Container.Mark(item)
	 *	Marks the item in the buffer, and adds it to the item list. 
	 */
	this.Mark = function (item) {
		var x, y;

		//Make sure it is in this container.
		if (item.location !== this.location || item.mode !== 0) {
			return false;
		}

		//Mark item in buffer.
		for (x = item.x; x < (item.x + item.sizex); x += 1) {
			for (y = item.y; y < (item.y + item.sizey); y += 1) {
				this.buffer[y][x] = this.itemList.length + 1;
				this.openPositions -= 1;
			}
		}

		//Add item to list.
		this.itemList.push(copyUnit(item));

		return true;
	};

	this.Reset = function () {
		var h, w;

		for (h = 0; h < this.height; h += 1) {
			for (w = 0; w < this.width; w += 1) {
				this.buffer[h][w] = 0;
			}
		}

		this.itemList = [];
		return true;
	};

	/* Container.CanFit(item)
	 *	Checks to see if we can fit the item in the buffer.
	 */
	this.CanFit = function (item) {
		return (!!this.FindSpot(item));
	};

	/* Container.FindSpot(item)
	 *	Finds a spot available in the buffer to place the item.
	 */
	this.FindSpot = function (item) {
		var x, y, nx, ny;

		//Make sure it's a valid item
		if (!item) {
			return false;
		}

		Storage.Reload();

		//Loop buffer looking for spot to place item.
		for (x = 0; x < this.height - (item.sizey - 1); x += 1) {
Loop:
			for (y = 0; y < this.width - (item.sizex - 1); y += 1) {
				//Check if there is something in this spot.
				if (this.buffer[x][y] > 0) {
					continue;
				}

				//Loop the item size to make sure we can fit it.
				for (nx = 0; nx < item.sizey; nx += 1) {
					for (ny = 0; ny < item.sizex; ny += 1) {
						if (this.buffer[x + nx][y + ny]) {
							continue Loop;
						}
					}
				}

				return ({x: x, y: y});
			}
		}

		return false;
	};

	/* Container.MoveTo(item)
	 *	Takes any item and moves it into given buffer.
	 */
	this.MoveTo = function (item) {
		var nPos, n, nDelay;

		try {
			//Can we even fit it in here?
			nPos = this.FindSpot(item);

			if (!nPos) {
				return false;
			}

			//Can't deal with items on ground!
			if (item.mode === 3) {
				return false;
			}

			//Item already on the cursor.
			if (me.itemoncursor && item.mode !== 4) {
				return false;
			}

			//Pick to cursor if not already.
			item.toCursor();

			//Loop three times to try and place it.
			for (n = 0; n < 5; n += 1) {
				clickItem(0, nPos.y, nPos.x, this.location);

				nDelay = getTickCount();

				while ((getTickCount() - nDelay) < 500) {
					if (!me.itemoncursor) {
						print("Successfully placed " + item.name + " at X: " + nPos.x + " Y: " + nPos.y);
						delay(200);

						return true;
					}

					delay(10);
				}
			}

			return true;
		} catch (e) {
			return false;
		}
	};

	/* Container.Dump()
	 *	Prints all known information about container.
	 */
	this.Dump = function () {
		var x, y, string;

		print(this.name + " has the width of " + this.width + " and the height of " + this.height);
		print(this.name + " has " + this.itemList.length + " items inside, and has " + this.openPositions + " spots left.");

		for (x = 0; x < this.height; x += 1) {
			string = "";

			for (y = 0; y < this.width; y += 1) {
				string += (this.buffer[x][y] > 0) ? "ÿc1x" : "ÿc0o";
			}

			print(string);
		}
	};

	/* Container.compare(reference)
	 *	Compare given container versus the current one, return all new items in current buffer.
	 */
	this.Compare = function (baseRef) {
		var h, w, n, item, itemList, reference;

		Storage.Reload();

		try {
			itemList = [];
			reference = baseRef.slice(0, baseRef.length);

			//Insure valid reference.
			if (typeof (reference) !== "object" || reference.length !== this.buffer.length || reference[0].length !== this.buffer[0].length) {
				throw new Error("Unable to compare different containers.");
			}

			for (h = 0; h < this.height; h += 1) {
Loop:
				for (w = 0; w < this.width; w += 1) {
					item = this.itemList[this.buffer[h][w] - 1];

					if (!item) {
						continue;
					}

					for (n = 0; n < itemList.length; n += 1) {
						if (itemList[n].gid === item.gid) {
							continue Loop;
						}
					}

					//Check if the buffers changed and the current buffer has an item there.
					if (this.buffer[h][w] > 0 && reference[h][w] > 0) {
						itemList.push(copyUnit(item));
					}
				}
			}

			return itemList;
		} catch (e) {
			return false;
		}
	};

	this.toSource = function () {
		return this.buffer.toSource();
	};
};

var Storage = new function () {
	this.Init = function () {
		this.StashY = me.gametype === 0 ? 4 : 8;
		this.Inventory = new Container("Inventory", 10, 4, 3);
		this.Stash = new Container("Stash", 6, this.StashY, 7);
		this.Belt = new Container("Belt", 4 * this.BeltSize(), 1, 2);
		this.Cube = new Container("Horadric Cube", 3, 4, 6);
		this.InvRef = [];

		this.Reload();
	};

	this.BeltSize = function () {
		var item = me.getItem(-1, 1); // get equipped item

		if (!item) { // nothing equipped
			return 1;
		}

		do {
			if (item.bodylocation === 8) { // belt slot
				switch (item.code) {
				case "lbl": // sash
				case "vbl": // light belt
					return 2;
				case "mbl": // belt
				case "tbl": // heavy belt
					return 3;
				default: // everything else
					return 4;
				}
			}
		} while (item.getNext());

		return 1; // no belt
	};

	this.Reload = function () {
		this.Inventory.Reset();
		this.Stash.Reset();
		this.Belt.Reset();
		this.Cube.Reset();
		var item = me.getItem();

		if (!item) {
			return false;
		}

		do {
			switch (item.location) {
			case 3:
				this.Inventory.Mark(item);
				break;
			case 2:
				this.Belt.Mark(item);
				break;
			case 6:
				this.Cube.Mark(item);
				break;
			case 7:
				this.Stash.Mark(item);
				break;
			}
		} while (item.getNext());

		return true;
	};
};