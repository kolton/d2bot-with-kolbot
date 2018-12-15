// Don't use the global scope
const PickitEnum = PickitEnum || Object.create(null)

/**
 * Result of PickitEnum item check
 * Kolbot currently relies on these numbers
 */
PickitEnum.NEEDS_IDENTIFY = -1
PickitEnum.UNWANTED = 0
PickitEnum.PICKIT = 1
PickitEnum.CUBING = 2
PickitEnum.RUNEWORD = 3
PickitEnum.SELL = 4

/**
 * Colors returned by the Item Unit
 * Result of item.getColor()
 */
PickitEnum.BLACK = 3
PickitEnum.WHITE = 20
PickitEnum.ORANGE = 19
PickitEnum.LIGHT_YELLOW = 13
PickitEnum.LIGHT_RED = 7
PickitEnum.LIGHT_GOLD = 15
PickitEnum.LIGHT_BLUE = 4
PickitEnum.LIGHT_PURPLE = 17
PickitEnum.CRYSTAL_BLUE = 6
PickitEnum.CRYSTAL_RED = 9
PickitEnum.CRYSTAL_GREEN = 12
PickitEnum.DARK_YELLOW = 14
PickitEnum.DARK_RED = 8
PickitEnum.DARK_GOLD = 16
PickitEnum.DARK_GREEN = 11
PickitEnum.DARK_BLUE = 5
