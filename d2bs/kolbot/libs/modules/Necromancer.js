(function (module, require) {
	const Necromancer = function () {

	};

	Necromancer.getIronGolem = function (unit = me) {
		if (!unit instanceof me) throw TypeError('Must give a unit.');
		let owner, golem = getUnit(1, 291);
		if (golem) for (; golem.getNext();) if ((owner = golem.getParent()) && owner && owner.name === unit.name) return copyUnit(golem);

		return false;
	};
})(module, require);