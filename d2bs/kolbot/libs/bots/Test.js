var a;

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
	
	addEventListener("copydata",CopyDataEvent);

	while (true) {
		if (c) {
			test();

			c = false;
		}

		delay(10);
	}
}

function test() {
	print("start");
	
	while (true) {
		sendCopyData(null, me.windowtitle, 0, "qq");
		delay(1);
	}
}