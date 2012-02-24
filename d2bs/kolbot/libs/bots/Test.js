function Test() {
	print("ÿc8TESTING");
	
	include("gambling.js");

	function KeyDown(key) {
		if (key === 45) {
			test();
		}
	}

	print(Gambling.checkGamblers());
	
	addEventListener("keydown", KeyDown);
	
	while (true) {
		delay(2e5);
	}
}

function test() {
	Gambling.dropGold();
}

/*function test() {
	var item = getUnit(101);
	
	if (!item) {
		return;
	}
	
	var obj = {
		Character: me.name,
		ItemName: item.fname.split("\n").reverse().join(" "),
		Description: item.description,
		Area: me.area
	};
	
	var text = JSON.stringify(obj);
	
	FileTools.appendText("test.txt", text + "\n");
}*/