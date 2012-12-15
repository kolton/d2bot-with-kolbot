var Hooks = {
	monsters: {
		monsterHooks: [],

		check: function () {
			var i, unit;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (!copyUnit(this.monsterHooks[i].unit).x) {
					this.monsterHooks[i].hook[0].remove();
					this.monsterHooks[i].hook[1].remove();
					this.monsterHooks.splice(i, 1);

					i -= 1;
				}
			}

			unit = getUnit(1);

			if (unit) {
				do {
					if (Attack.checkMonster(unit)) {
						if (!this.getHook(unit)) {
							this.add(unit);
						} else {
							this.updateCoords(unit);
						}
					} else {
						this.remove(unit);
					}
				} while (unit.getNext());
			}
		},

		newHook: function (unit) {
			var arr = [];

			arr.push(new Line(unit.x - 5, unit.y, unit.x + 5, unit.y, 0x62, true));
			arr.push(new Line(unit.x, unit.y - 5, unit.x, unit.y + 5, 0x62, true));

			return arr;
		},

		add: function (unit) {
			this.monsterHooks.push({
				unit: copyUnit(unit),
				hook: this.newHook(unit)
			});
		},

		updateCoords: function (unit) {
			var hook = this.getHook(unit);

			if (!hook) {
				return false;
			}

			hook[0].x = unit.x - 5;
			hook[0].x2 = unit.x + 5;
			hook[0].y = unit.y;
			hook[0].y2 = unit.y;
			hook[1].x = unit.x;
			hook[1].x2 = unit.x;
			hook[1].y = unit.y - 5;
			hook[1].y2 = unit.y + 5;

			return true;
		},

		getHook: function (unit) {
			var i;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (this.monsterHooks[i].unit.gid === unit.gid) {
					return this.monsterHooks[i].hook;
				}
			}

			return false;
		},

		remove: function (unit) {
			var i;

			for (i = 0; i < this.monsterHooks.length; i += 1) {
				if (this.monsterHooks[i].unit.gid === unit.gid) {
					this.monsterHooks[i].hook[0].remove();
					this.monsterHooks[i].hook[1].remove();
					this.monsterHooks.splice(i, 1);

					return true;
				}
			}

			return false;
		},

		flush: function () {
			while (this.monsterHooks.length) {
				this.monsterHooks[0].hook[0].remove();
				this.monsterHooks[0].hook[1].remove();
				this.monsterHooks.shift();
			}

			return true;
		}
	}
};

function main() {
	print("ÿc9Map Thread Loaded");
	include("common/attack.js");

	var revealedAreas = [];

	this.revealArea = function (area) {
		var room = getRoom(area);

		delay(200);

		do {
			if (room instanceof Room && room.area === area) {
				room.reveal();
			}
		} while (room.getNext());
	};

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(100);
		}

		if (revealedAreas.indexOf(me.area) === -1) {
			this.revealArea(me.area);
			revealedAreas.push(me.area);
		}

		Hooks.monsters.check();
		delay(40);

		while (getUIFlag(0x09)) {
			Hooks.monsters.flush();
			delay(100);
		}
	}
}