import irc from "matrix-org-irc"
import logger from "./log"

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

bot.on("error", (e) => log.error(e))
bot.on("message", (from, to, text) => log.trace(`${to} <${from}>: ${text}`))

export default bot
