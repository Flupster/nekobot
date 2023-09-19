import irc from "matrix-org-irc"
import logger from "./log"

const log = logger.getLogger("IRC")

const bot = new irc.Client(process.env.IRC_SERVER, process.env.IRC_NICK, {
  autoRejoin: true,
  floodProtection: true,
  floodProtectionDelay: 1000,
  realName: process.env.IRC_NAME,
  userName: process.env.IRC_NICK,
  channels: ["#tokyotosho-api", "#nyaannounce"],
})

// Register with NickServ
bot.on("registered", () => {
  log.trace("Identifying with NickServ")
  bot.say("NickServ", `IDENTIFY ${process.env.IRC_PASS}`)
})

// On netError exit with code 1
bot.on("netError", (e) => {
  log.error("Got netError:", e)
  process.exit(1)
})

bot.on("error", (e) => log.error(e))
bot.on("message", (from, to, text, message) => log.trace(`${to} <${from}>: ${message} - ${text}`))

// Message queue as events do not honor flood protection
const messageQueue: { target: string; text: string }[] = []
export const privmsg = (target: string, text: string) => messageQueue.push({ target, text })
const queue = () => {
  const message = messageQueue.pop()
  if (message) bot.say(message.target, message.text)
}

setInterval(queue, 1000)

export default bot
