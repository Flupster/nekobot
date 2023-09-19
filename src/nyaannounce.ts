import Nyaa from "./nyaa"
import { privmsg } from "./irc"

const announce = (release: NyaaRelease | TokyoRelease) => {
  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  privmsg("#nyaannounce", message)
}

Nyaa.on("release", announce)
Nyaa.on("tokyorelease", announce)
