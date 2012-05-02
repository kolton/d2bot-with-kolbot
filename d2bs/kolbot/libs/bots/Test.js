function Test() {
	print("ÿc8TESTING");
	
	var c;

	function KeyDown(key) {
		//print(key);
		
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
		
		Pickit.fastPick();
		
		delay(10);
	}
}

function test() {
	Attack.clear(20);
}