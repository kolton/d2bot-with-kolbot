function Test() {
	print("ÿc8TESTING");

	var c;

	//include("automule.js");

	function KeyDown(key) {
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
	Town.doChores();
	//print(Pickit.checkItem(getUnit(101)).result);
	//print(Cubing.keepItem(getUnit(101)));
	
	/*try {
		print("go");
		var tx, ty, player = getUnit(0, "aym");

		if (player) {
			tx = player.targetx;
			ty = player.targety;

			while (true) {
				if (player.targetx !== tx || player.targety !== ty) {
					tx = player.targetx;
					ty = player.targety;

					if (getDistance(me, tx, ty) < 10) {
						me.overhead("danger");
					}
				}

				delay(10);
			}
		}
	} catch (e) {
	
	}*/
}