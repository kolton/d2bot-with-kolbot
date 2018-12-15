const ParserUtils = ParserUtils || Object.create(null)

/**
 * Map props on item units to getter functions
 * Allows us to add custom logic
 */
ParserUtils.itemPropToFn = {
  name: item => item.name,
  quality: item => item.quality,
  color: item => item.getColor(),
  maxQuantity: item => item,
}