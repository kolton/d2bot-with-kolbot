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
	addEventListener("copydata", CopyDataEvent);

	function CopyDataEvent(mode, msg) {
		print(msg);
	}

	while (true) {
		if (c) {
			test();

			c = false;
		}

		delay(10);
	}
}

function test() {
	Pickit.pickItems();
}