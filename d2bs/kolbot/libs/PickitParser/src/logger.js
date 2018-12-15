const pickitLogger = (() => {
  const baseConfig = {
    prefix: 'PickerParser: ',
    displayConsole: true,
    outputD2bot: true,
    outputScriptErr: false,
    colorPrefix: 'ÿc8',
  }

  const log = (msg, logColor, overrideConfig) => {
    const config = overrideConfig ? {...baseConfig, ...overrideConfig,} : baseConfig
    const {
      prefix,
      colorPrefix,
      displayConsole,
      outputD2bot,
      outputScriptErr,
    } = config

    if (displayConsole) {
      showConsole()
    }

    if (outputD2bot) {
      D2Bot.printToConsole(`${prefix} ${msg}`)
    }

    if (outputScriptErr) {
      Misc.errorReport(`${prefix} ${msg}`)
    }

    // Babel string transform doesn't handle 'ÿ'
    print(colorPrefix + prefix + 'ÿc' + logColor + ' ' + msg)
  }

  const info = msg => log(msg, PickitEnum.LOG_LEVEL_INFO_COLOR)

  const warn = msg => log(
    msg,
    PickitEnum.LOG_LEVEL_WARN_COLOR,
    {
      displayConsole: true,
    }
  )

  const error = msg => log(
    msg,
    PickitEnum.LOG_LEVEL_ERROR_COLOR,
    {    
      displayConsole: true,
      outputD2bot: true,
      outputScriptErr: true,
    }
  )

  return {
    info,
    warn,
    error,
  }
})()
