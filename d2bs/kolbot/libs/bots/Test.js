function Test() {
	print("ÿc8TESTING");
	
	include("gambling.js");

	function KeyDown(key) {
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
	while (true) {
		if (me.getState(121)) {
			Skill.cast(45, 1, 15101, 5242);
		} else {
			Skill.cast(59, 0, 15101, 5242);
		}
	}
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