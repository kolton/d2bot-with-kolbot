function Test() {
	print("ÿc8TESTING");
	
	include("gambling.js");

	function KeyDown(key) {
		//print(key);
		
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
	for (var i = 0; i < 10; i += 1) {
		qq();
	}
}

	function qq() {
		var tome = me.findItem("ibk");

		var tick = getTickCount();

		for (var i = 0; i < 3000; i += 1) {
			clickItem(1, tome);

			if (getCursorType() === 6) {
				break;
			}

			delay(25);
		}

		if (getCursorType() !== 6) {
			return false;
		}

		//print("step 1 " + (getTickCount() - tick));
		tick = getTickCount();
		

		delay(270);
Loop:
		for (i = 0; i < 3; i += 1) {
			if (getCursorType() === 6) {
				clickItem(0, 1);
			}

			var tick2 = getTickCount();

			while (getTickCount() - tick2 < 500) {
				if (getCursorType() !== 6) {
					break Loop;
				}

				delay(10);
			}
			
			delay(300);
		}
		
		print("step 2 " + (getTickCount() - tick));

		return false;
	}