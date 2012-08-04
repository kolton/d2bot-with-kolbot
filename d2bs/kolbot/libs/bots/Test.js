function Test() {
	print("ÿc8TESTING");

	var c;

	include("automule.js");

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
	//print(MuleLogger.getItemDesc(getUnit(101)));
	Pather.moveToExit(me.area + 1, true);
}