/**
*	@filename	Mephisto.js
*	@author		kolton, njomnjomnjom
*	@desc		kill Mephisto
*/

function Mephisto() {
	this.killMephisto = function () {
		var i, angle, angles,
			pos = {},
			attackCount = 0,
			meph = getUnit(1, 242);

		if (!meph) {
			throw new Error("Mephisto not found!");
		}

		if (Config.MFLeader) {
			Pather.makePortal();
			say("kill " + meph.classid);
		}

		while (attackCount < 300 && Attack.checkMonster(meph)) {
			//if (getUnit(3, 276)) {
			if (meph.mode === 5) {
			//if (attackCount % 2 === 0) {
				angle = Math.round(Math.atan2(me.y - meph.y, me.x - meph.x) * 180 / Math.PI);
				angles = me.y > meph.y ? [-30, -60, -90] : [30, 60, 90];

				for (i = 0; i < angles.length; i += 1) {
					//pos.dist = Math.round(getDistance(me, meph));
					pos.dist = 18;
					pos.x = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * pos.dist + meph.x);
					pos.y = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * pos.dist + meph.y);

					if (Attack.validSpot(pos.x, pos.y)) {
						me.overhead("move, bitch!");
						Pather.moveTo(pos.x, pos.y);

						break;
					}
				}
			}

			if (ClassAttack.doAttack(meph) < 2) {
				break;
			}

			attackCount += 1;
		}

		return (meph.mode === 0 || meph.mode === 12);
	};

	this.moat = function () {
		var count, distance, mephisto;

		count = 0;

		delay(350);
		Pather.moveTo(17563, 8072);

		mephisto = getUnit(1, 242);

		if (!mephisto) {
			throw new Error("Mephisto not found.");
		}

		delay(350);
		Pather.moveTo(17575, 8086);
		delay(350);
		Pather.moveTo(17584, 8091);
		delay(1200);
		Pather.moveTo(17600, 8095);
		delay(550);
		Pather.moveTo(17610, 8094);
		delay(2500);
		Attack.clear(10);
		Pather.moveTo(17610, 8094);

		distance = getDistance(me, mephisto);

		while (distance > 27) {
			count += 1;

			Pather.moveTo(17600, 8095);
			delay(150);
			Pather.moveTo(17584, 8091);
			delay(150);
			Pather.moveTo(17575, 8086);
			delay(150);
			Pather.moveTo(17563, 8072);
			delay(350);
			Pather.moveTo(17575, 8086);
			delay(350);
			Pather.moveTo(17584, 8091);
			delay(1200);
			Pather.moveTo(17600, 8095);
			delay(550);
			Pather.moveTo(17610, 8094);
			delay(2500);
			Attack.clear(10);
			Pather.moveTo(17610, 8094);

			distance = getDistance(me, mephisto);

			if (count >= 5) {
				throw new Error("Failed to lure Mephisto.");
			}
		}

		return true;
	};

	this.killCouncil = function () {
		var i,
			coords = [17600, 8125, 17600, 8015, 17643, 8068];

		for (i = 0; i < coords.length; i += 2) {
			Pather.moveTo(coords[i], coords[i + 1]);

			if (Config.MFLeader) {
				Pather.makePortal();
				say("council " + i);
			}

			Attack.clearList(Attack.getMob([345, 346, 347], 0, 40));
		}

		return true;
	};

	Town.doChores();
	Pather.useWaypoint(101);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(102, true)) {
		throw new Error("Failed to move to Durance Level 3");
	}

	if (Config.Mephisto.KillCouncil) {
		this.killCouncil();
	}

	Pather.moveTo(17566, 8069);

	if (me.classid === 1) {
		if (Config.Mephisto.MoatTrick) {
			this.moat();

			Skill.usePvpRange = true;

			Attack.kill(242); // Mephisto

			Skill.usePvpRange = false;
		} else {
			//this.killMephisto();
			Attack.kill(242); // Mephisto
		}
	} else {
		Attack.kill(242); // Mephisto
	}

	Pickit.pickItems();

	if (Config.OpenChests) {
		Pather.moveTo(17572, 8011);
		Attack.openChests(5);
		Pather.moveTo(17572, 8125);
		Attack.openChests(5);
		Pather.moveTo(17515, 8061);
		Attack.openChests(5);
	}

	if (Config.Mephisto.TakeRedPortal) {
		Pather.moveTo(17590, 8068);
		delay(1500);
		Pather.moveTo(17601, 8070);
		Pather.usePortal(null);
	}

	return true;
}
