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
	var townCheck = false;

	this.togglePause = function () {
		var i,	script,
			scripts = ["default.dbj", "tools/antihostile.js", "tools/rushthread.js"];

		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script) {
				if (script.running) {
					if (script.name === "default.dbj") {
						print("ÿc1Pausing.");
					}

					script.pause();
				} else {
					if (script.name === "default.dbj") {
						print("ÿc2Resuming.");
					}

					script.resume();
				}
			}
		}

		return true;
	};

	addEventListener("scriptmsg",
		function (msg) {
			if (msg === "townCheck") {
				if (me.area === 136) {
					print("Can't tp from uber trist.");
				} else {
					townCheck = true;
				}
			}
		}
		);

	// Init config and attacks
	Config.init();
	Pickit.init();
	Attack.init();
	Storage.Init();
	Cubing.init();
	Runewords.init();

	while (true) {
		if (!me.inTown && (townCheck ||
			(Config.TownHP > 0 && me.hp < Math.floor(me.hpmax * Config.TownHP / 100)) ||
			(Config.TownMP > 0 && me.hp < Math.floor(me.hpmax * Config.TownMP / 100)))) {
			this.togglePause();

			while (!me.gameReady) {
				delay(200);
			}

			try {
				me.overhead("Going to town");
				Town.goToTown();
				Town.doChores();
				Town.move("portalspot");

				if (!Pather.usePortal(null, me.name)) {
					throw new Error("TownChicken: Failed to use portal.");
				}

				if (Config.PublicMode) {
					Pather.makePortal();
				}
			} catch (e) {
				Misc.errorReport("TownChicken fail");
				quit();
			} finally {
				this.togglePause();

				townCheck = false;
			}
		}

		delay(50);
	}
}
