/**
*	@filename	HeartBeat.js
*	@author		kolton
*	@desc		Keep a link with d2bot#. If it's lost, the d2 window is killed
*/

function main() {
	include("oog.js");
	include("json2.js");
	include("common/misc.js");
	D2Bot.init();

	while (true) {
		D2Bot.heartBeat();

		delay(1000);
	}
}