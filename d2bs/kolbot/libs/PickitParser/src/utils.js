const ParserUtils = {
  comparisionMap: {
    [PickitEnum.COMPARE_GT]: (itemMod, val) => itemMod > val,
    [PickitEnum.COMPARE_GTE]: (itemMod, val) => itemMod >= val,
    [PickitEnum.COMPARE_LT]: (itemMod, val) => itemMod < val,
    [PickitEnum.COMPARE_LTE]: (itemMod, val) => itemMod <= val,
    [PickitEnum.COMPARE_EQ]: (itemMod, val) => itemMod === val,
  },
  /**
   * Map props on item units to getter functions
   * Allows us to add custom logic
   */
  itemPropToFn: {
    name: item => item.name,
    quality: item => item.quality,
    color: item => item.getColor(),
    maxQuantity: item => item,
    mods(item, mod) {
      const {itemMod, comparator, compareValue,} = mod
      const itemModValue = item.getValue(itemMod)

      return this.comparisionMap[comparator](itemModValue, compareValue)
    },
  },
}
