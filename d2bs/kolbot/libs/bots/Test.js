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

function test() {
	new Text("Nipple pinchy", 50, 260, 2, 1);
}

var _NTIP_CheckList = [],
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
}