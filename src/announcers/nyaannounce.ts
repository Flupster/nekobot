import Nyaa from "../nyaa"
import bot from "../irc"
import { getChannelByName } from "../db"

const announce = (release: NyaaRelease | TokyoRelease) => {
  const enabled = getChannelByName("nyaannounce")
  if (!enabled || !enabled.enabled) return

  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  bot.say("#nyaannounce", message)
}

Nyaa.on("release", announce)
Nyaa.on("tokyorelease", announce)
