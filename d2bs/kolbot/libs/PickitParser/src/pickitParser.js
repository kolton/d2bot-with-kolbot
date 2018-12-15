include('PickitParser/src/constants.js')

const PickitParser = (() => {
  let pickitList = []
  const CONFIG_FILE = 'libs/PickitParser/pickit.json'
  const logConfig = {
    prefix: 'PickerParser: ',
    displayConsole: true,
    outputD2bot: true,
    outputScriptErr: false,
    color: 'ÿc8',
  }

  const logger = message => {
    const {
      color,
      prefix,
      displayConsole,
      outputD2bot,
      outputScriptErr,
    } = logConfig

    if (displayConsole) {
      showConsole()
    }

    if (outputD2bot) {
      D2Bot.printToConsole(prefix + message)
    }

    if (outputScriptErr) {
      Misc.errorReport(prefix + message)
    }

    print(color + prefix + 'ÿc0' + message)
  }

  const validateConfig = configs => {
    if (!configs.length) {
      logger('No configurations set')

      return false
    }

    if (!FileTools.exists(CONFIG_FILE)) {
      logger('Pickit config doesn\'t exist: ' + CONFIG_FILE)

      return false
    }

    return true
  }

  const buildPickitList = (configs, parsedConfigFile) => (
    configs.reduce((acc, _, idx) => {
      const config = configs[idx]

      if (parsedConfigFile.hasOwnProperty(config)) {
        const filterEnabled = parsedConfigFile[config].filter(
          ({enabled,}) => enabled
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

    logger('Loaded ' + pickitList.length + ' pickit entries')

    return true
  }

  return {
    init: init,
    logConfig: logConfig,
    logger: logger,
  }
})()

PickitParser.init('test', 'hi')
