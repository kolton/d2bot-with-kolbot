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
	var i = 0, j = 0, room = getRoom(me.x, me.y);

	if (room) {
		do {
			for (i = 0; i < room.xsize; i += 1) {
				for (j = 0; j < room.ysize; j += 1) {
					//new Line(i, j, i + 10, j + 10, 0x84, true);
					new Line(room.x * 5 + i, room.y * 5 + j, room.x * 5 + i, room.y * 5 + j, 0x84, true);

					delay(1);
				}
			}
		} while (room.getNext());
	}

	me.overhead("done");
}