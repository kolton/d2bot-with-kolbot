const PickitParser = ((logger, checker) => {
  const pickitList = []
  const CONFIG_FILE = 'libs/PickitParser/pickit.json'

  const validateConfig = (configs) => {
    if (!configs.length) {
      logger.error('No configurations set')

      return false
    }

    if (!FileTools.exists(CONFIG_FILE)) {
      logger.warn(`Pickit config doesn't exist: ${CONFIG_FILE}`)

      return false
    }

    return true
  }

  const buildPickitList = (configs, parsedConfigFile) => (
    configs.forEach((config) => {
      if (parsedConfigFile?.[config]) {
        const filterEnabled = parsedConfigFile[config].filter(
          pickitEntry => pickitEntry.enabled
        )
  
        pickitList.push(...filterEnabled)
      }
    })
  )

  const init = (...configs) => {
    if (!validateConfig(configs)) {
      return false
    }

    buildPickitList(configs, JSON.parse(FileTools.readText(CONFIG_FILE)))
    logger.info(`Loaded ${pickitList.length} pickit entries`)

    return true
  }

  const checkProps = (item, entry) => {

  }

  const checkMods = (item, mods) => {

  }

  const checkItem = (item, entries=pickitList) => (
    checker.checkItem(item, entries)
  )

  return {
    init,
    checkItem,
  }
})(pickitLogger, checkerKolbot)

PickitParser.init('test', 'hi', 'noexist')
