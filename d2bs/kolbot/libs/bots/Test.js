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

	function CopyDataEvent(mode, msg) {
		if (msg) {			
			return;
		}
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
	
}