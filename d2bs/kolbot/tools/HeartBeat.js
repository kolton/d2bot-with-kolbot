/**
*	@filename	HeartBeat.js
*	@author		kolton
*	@desc		Keep a link with d2bot#. If it's lost, the d2 window is killed
*/

function main() {
	while (true) {
		sendCopyData(null, "D2Bot #", 0, "heartBeat");

		delay(1000);
	}
}