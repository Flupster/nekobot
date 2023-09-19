import Nyaa from "./nyaa"
import bot from "./irc"

const announce = (release: NyaaRelease | TokyoRelease) => {
  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  bot.say("#nyaannounce", message)
}

Nyaa.on("release", announce)
Nyaa.on("tokyorelease", announce)
