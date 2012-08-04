function main() {
	include("common/misc.js");
	
	var i, 
		flashList = [];

	addEventListener('scriptmsg',
		function (msg) {
			if (msg.split(" ")[0] === "flash") {
				print("Flash away!");
				flashList.push(msg.split(" ")[1]);
			}

			if (msg === "unflash") {
				print("Stopping flash.");
				flashList = [];
			}
		}
	);

	while (true) {
		if (flashList.length > 0) {
			for (i = 0; i < flashList.length; i += 1) {
				Packet.flash(flashList[i]);

				if (i < flashList.length - 1) {
					delay(100);
				}
			}
		}

		delay(100);
	}
}