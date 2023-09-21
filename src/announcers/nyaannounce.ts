import Nyaa from "../nyaa"
import bot from "../irc"
import logger from "../log"
import { getChannelByName } from "../db"

const log = logger.getLogger("announce:nyaannounce")

const announce = (release: NyaaRelease | TokyoRelease) => {
  const enabled = getChannelByName("nyaannounce")
  if (!enabled || !enabled.enabled) {
    log.trace("Channel Disabled, Skipping release", enabled, release.title)
    return
  }

  log.trace("Announcing release:", release.title)
  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  bot.say("#nyaannounce", message)
}

Nyaa.on("release", announce)
Nyaa.on("tokyorelease", announce)
