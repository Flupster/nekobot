import irc from "matrix-org-irc"
import logger from "./log"
import { setChannelEnabled } from "./db"

const log = logger.getLogger("IRC")

const bot = new irc.Client(process.env.IRC_SERVER, process.env.IRC_NICK, {
  password: process.env.IRC_PASS,
  port: 65501,
  autoRejoin: true,
  realName: process.env.IRC_NAME,
  userName: process.env.IRC_NICK,
  channels: ["#tokyotosho-api", "#nyaannounce"],
})

// On netError exit with code 1
bot.on("netError", (e) => {
  log.error("Got netError:", e)
  process.exit(1)
})

// Commands
bot.on("message", (from, to, text, message) => {
  // Enable
  if (text === "NekoNeko enable") {
    if (!to.startsWith("#")) {
      log.warn("Enable command: not run in channel:", message)
      return
    }

    if (!message.user) {
      log.warn("Enable command: not run by user:", message)
      return
    }

    const priv = /^[@|~|&|%].*$/.exec(message.user)
    if (!priv?.length) {
      log.warn("Enable command: not run by priviledged user:", message)
    }

    log.info(`${from} enabled NekoNeko in: ${to}`)
    setChannelEnabled(to, true)
    bot.say(from, `Enabled in: ${to}`)
  }

  // Disable
  if (text === "NekoNeko disable") {
    if (!to.startsWith("#")) {
      log.warn("Disable command: not run in channel:", message)
      return
    }

    if (!message.user) {
      log.warn("Disable command: not run by user:", message)
      return
    }

    const priv = /^[@|~|&|%].*$/.exec(message.user)
    if (!priv) {
      log.warn("Disable command: not run by priviledged user:", message)
    }

    log.info(`${from} disabled NekoNeko in: ${to}`)
    setChannelEnabled(to, false)
    bot.say(from, `Disabled in: ${to}`)
  }
})

bot.on("error", (e) => log.error(e))
bot.on("message", (from, to, text, message) => log.trace(`${to} <${from}>: ${text}`))

export default bot
