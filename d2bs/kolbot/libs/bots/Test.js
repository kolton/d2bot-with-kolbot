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
	//Misc.logItem("QQ", getUnit(101));
	
			for (var i = 0; i < 127; i += 1) {
				if (getUnit(101).fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(16, i, 3))) > -1) {
					print(getLocaleString(getBaseStat(16, i, 3)));
					print(getBaseStat(16, i, 14));
				
					for (var j = 0; j < 95; j += 1) {
						if (typeof getBaseStat(16, i, j) === "string") {
							print(j);
							
							print(getBaseStat(16, i, j));
						}
					}
				
				
					//code = getBaseStat(16, i, "invfile");

					break;
				}
			}
	
	/*for (var i = 0; i < 401; i += 1) {
		if ("Annihilus".indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
			print(getLocaleString(getBaseStat(17, i, 2)).toSource());
			print(getBaseStat(17, i, 15));

			break;
		}
	}*/
}

function txtfile (path, mode, msg) {
	var i, file, contents;

MainLoop:
	for (i = 0; i < 30; i += 1) {
		try {
			file = File.open(path, mode);

			switch (mode) {
			case 0:
				contents = file.readLine();

				break MainLoop;
			case 1:
				file.write(msg);

				break MainLoop;
			}
		} catch (e) {

		} finally {
			file.close();
		}

		delay(100);
	}
	
	return mode === 0 ? contents : true;
}

function thawingadventure() {
	var i, items,
		item = me.getItem(),
		count = me.itemcount,
		u = getUnit(101);

	if (!u) {
		return;
	}

	while (true) {
		sendPacket(1, 0x32, 4, getInteractedNPC().gid, 4, u.gid, 4, 0, 4, 0);

		if (me.itemcount >= count + 40) {
			while (me.itemcount !== count) {
				items = me.getItems();

				for (i = 0; i < items.length; i += 1) {
					if (items[i].mode === 0 && items[i].location === 3) {
						sendPacket(1, 0x27, 4, item.gid, 4, items[i].gid);

						delay(10);
					}
				}

				delay(10);
			}
		}

		delay(10);
	}
}