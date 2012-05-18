function Test() {
	print("ÿc8TESTING");
	
	var c;

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
	Attack.clear(30);
}