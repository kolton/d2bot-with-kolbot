/** @typedef {Unit} me */

(function () {
	me.weaponSwitch = function (slot) {
		if (this.gametype === 0 || this.weaponswitch === slot && slot !== undefined) {
			return true;
		}

		let originalSlot = this.weaponswitch;


		let i, tick, switched = false,
			packetHandler = (bytes) => bytes.length > 0 && bytes[0] === 0x97 && (switched = true) && false; // false to not block
		addEventListener('gamepacket', packetHandler);

		for (i = 0; i < 10; i += 1) {
			i > 0 && print('Switch weapons -- attempt #' + (i + 1));

			for (let j = 100; --j && me.idle;) {
				delay(3); // wait max 300 ms to be idle
			}

			i > 0 && delay(Math.min(1 + (me.ping * 1.5), 10));
			!switched && sendPacket(1, 0x60); // Swap weapons

			tick = getTickCount();

			while (getTickCount() - tick < 500 + (me.ping * 5)) {
				if (switched || originalSlot !== me.weaponswitch) {
					while (!me.idle) {
						delay(1);
					}

					removeEventListener('gamepacket', packetHandler);

					return true;
				}

				delay(3);
			}
			// Retry
		}

		removeEventListener('gamepacket', packetHandler);

		return false;
	};

	(function (original) {
		// Put a skill on desired slot
		me.setSkill = function (skillId, hand, item) {
			// Check if the skill is already set
			if (me.getSkill(hand === 0 && 2 || 3) === skillId) return true;

			if (!item && !me.getSkill(skillId, 1)) return false;

			// Charged skills must be cast from right hand
			if (hand === undefined || hand === 3 || item) {
				item && hand !== 0 && print('[ÿc9Warningÿc0] charged skills must be cast from right hand');
				hand = 0;
			}

			return !!original.apply(me, [skillId, hand, item]);
		}
	})(me.setSkill);

	Object.defineProperties(me, {
		primarySlot: {
			get: function () {
				const Config = require('Config');
				if (Config.PrimarySlot === -1) { // determine primary slot if not set
					if ((Precast.haveCTA > -1) || Precast.checkCTA()) { // have cta
						if (this.checkSlot(Precast.haveCTA ^ 1)) { // have item on non-cta slot
							Config.PrimarySlot = Precast.haveCTA ^ 1; // set non-cta slot as primary
						} else { // other slot is empty
							Config.PrimarySlot = Precast.haveCTA; // set cta as primary slot
						}
					} else if (!this.checkSlot(0) && this.checkSlot(1)) { // only slot II has items
						Config.PrimarySlot = 1;
					} else { // both slots have items, both are empty, or only slot I has items
						Config.PrimarySlot = 0;
					}
				}

				return Config.PrimarySlot;
			},
			enumerable: false,
		},
	})
});