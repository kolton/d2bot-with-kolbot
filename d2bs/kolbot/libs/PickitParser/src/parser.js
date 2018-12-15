include('PickitParser/src/constants.js')
include('PickitParser/src/logger.js')
include('PickitParser/src/utils.js')
include('PickitParser/src/checkerKolbot.js')

const PickitParser = ((logger, checker) => {
  let pickitList = []
  const CONFIG_FILE = 'libs/PickitParser/pickit.json'

  const validateConfig = (configs) => {
    if (!configs.length) {
      logger.error('No configurations set')

      return false
    }

    if (!FileTools.exists(CONFIG_FILE)) {
      logger.warn('Pickit config doesn\'t exist: ' + CONFIG_FILE)

      return false
    }

    return true
  }

  const buildPickitList = (configs, parsedConfigFile) => (
    configs.reduce((acc, _, idx) => {
      const config = configs[idx]

      if (parsedConfigFile.hasOwnProperty(config)) {
        const filterEnabled = parsedConfigFile[config].filter(
          pickitEntry => pickitEntry.enabled
        )

        return [...acc, ...filterEnabled]
      }

      return acc
    }, [])
  )

  const init = (...configs) => {
    if (!validateConfig(configs)) {
      return false
    }

    pickitList = buildPickitList(
      configs,
      JSON.parse(FileTools.readText(CONFIG_FILE))
    )

    logger.info('Loaded ' + pickitList.length + ' pickit entries')

    return true
  }

  const checkProps = (item, entry) => {

  }

  const checkMods = (item, mods) => {

  }

  const checkItem = (item, entries=pickitList) => {
    return checker.checkItem(item, entries)
  }

  return {
    init: init,
    checkItem: checkItem,
  }
})(pickitLogger, checkerKolbot)

PickitParser.init('test', 'hi')
