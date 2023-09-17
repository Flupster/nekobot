import Nyaa from "./nyaa"
import bot from "./irc"

Nyaa.on("release", (release) => {
  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  bot.say("#nyaannounce", message)
})
