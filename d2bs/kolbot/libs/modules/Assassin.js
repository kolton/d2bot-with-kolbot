/**
 *  @description Some specific Assassin additions
 *  @author Jaenster
 */

(function (module, require) {
	const Promise = require('Promise');

	// Cast burst of speed in town, fade before we leave town
	const usePortal = Pather.usePortal, useWaypoint = Pather.useWaypoint;
	const recastFade = () => Config.UseFade && !me.getState(sdk.states.Fade) && Skill.cast(sdk.skills.Fade);
	const castBoS = () => Config.UseFade && !me.getState(sdk.states.BurstOfSpeed) && Skill.cast(sdk.skills.BurstOfSpeed) || true;

	Pather.usePortal = function (...args) { // If you use a portal in town, we can only leave town
		if (me.inTown) {
			Town.move('portal');
			var portal = getUnit(2, "portal");
			portal && portal.moveTo(); // just move to any portal
			recastFade();
		}
		return usePortal.apply(this, args);
	};
	Pather.useWaypoint = function (...args) {
		// cast fade if we leave town
		if (me.inTown && Town.move('waypoint')) {
			let wp = getUnit(2, "waypoint");
			wp.moveTo();
			recastFade();
		}
		return useWaypoint.apply(this, args);
	};


	// A promise that once started waits to be in town, once it is cast Burst of Speed.
	(_ => _(_))(
		self => new Promise(
			resolve => me.inTown && resolve()
		).then(
			() => castBoS() && new Promise(
				resolve => !me.inTown && resolve()
			).then(() => self(self))));

	module.exports ={};
})(module, require);
