function Test() {
	print("ÿc8TESTING");
	
	include("gambling.js");

	function KeyDown(key) {
		print(key);
		
		if (key === 45) {
			test();
		}
	}
	
	addEventListener("keydown", KeyDown);

	while (true) {
		delay(2e5);
	}
}

function test() {
	Town.doChores();
}