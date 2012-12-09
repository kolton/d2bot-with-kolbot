function Test() {
	print("ÿc8TESTING");

	var c;

	//include("automule.js");

	function KeyDown(key) {
		if (key === 45) {
			c = true;
		}
	}

	addEventListener("keydown", KeyDown);
	/*addEventListener("mousemove",
		function () {
			for (var i = 0 ; i < arguments.length; i += 1) {
				print(arguments[i]);
			}
		}
		);*/

	while (true) {
		if (c) {
			try {
				test();
			} catch (qq) {
				print('faile');
				print(qq);
			}

			c = false;
		}

		delay(10);
	}
}

var a = -1, b = 1;

function test() {
	print("test");

	/*this.damage = 500;
	this.time = 0;

	while (true) {
		checkLifeyo();
		delay(10);
	}*/

	function qq() {
		a += 1;

		if (a === 1) {
			return true;
		}

		return false;
	}

	somefunc(qq);
}

function somefunc(func) {
	print(func.call());
}

function checkLifeyo() {
	if (!this.hp) {
		this.hp = me.hp;
	}

	if (this.hp > me.hp && me.hp < me.hpmax) {
		me.overhead("taking damage");

		if (!this.timer) {
			this.timer = getTickCount();
		}

		if (getTickCount() - this.timer >= this.time) {
			if (this.hp - this.damage > me.hp) {
				D2Bot.printToConsole("DoT chicken");
				//quit();
			}

			this.hp = 0;
			this.timer = 0;
		}
	}
}

/*var _NTIP_CheckList = [],
	stringArray = [];

function minify(filepath)
{
	var i, nipfile, result = [];
	var line;
	var string;
	var lines;
	var count = 0;

	nipfile = File.open(filepath, 0);

	if (!nipfile) {
		return false;
	}

	lines = nipfile.readAllLines();
	
	nipfile.close();

	for (i = 0; i < lines.length; i += 1) {
		result.push(lines[i].replace(/ |;|\t/g, "").toLowerCase());
	}

	result = result.join("\n");
	
	FileTools.writeText(filepath + ".mini", result);

	return true;
}*/