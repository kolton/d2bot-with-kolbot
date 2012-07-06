/**
*	@filename	TownChicken.js
*	@author		kolton
*	@desc		handle town chicken
*/

js_strict(true);

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("Gambling.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/Config.js");
include("common/CollMap.js");
include("common/Loader.js");
include("common/Misc.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");

function main() {
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

	// Init config and attacks
	Config.init();
	Attack.init();
	Storage.Init();

	while (true) {
		if (!me.inTown && ((Config.TownHP > 0 && me.hp < Math.floor(me.hpmax * Config.TownHP / 100)) || (Config.TownMP > 0 && me.hp < Math.floor(me.hpmax * Config.TownMP / 100)))) {
			this.togglePause();
			
			try {
				me.overhead("Town chicken");
				Town.goToTown();
				Town.heal();
				Town.buyPotions();
				Town.reviveMerc();
				me.cancel();
				Town.move("portalspot");

				if (!Pather.usePortal(null, me.name)) {
					throw new Error("Misc.townCheck: Failed to use portal.");
				}

				if (Config.PublicMode) {
					Pather.makePortal();
				}
			} finally {
				this.togglePause();
			}
		}

		delay(50);
	}
}