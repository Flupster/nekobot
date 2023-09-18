import Nyaa from "./nyaa"
import { privmsg } from "./irc"

Nyaa.on("release", (release) => {
  const message = `[${release.category}] - ${release.title} - (${release.size}) - ${release.torrent}`
  privmsg("#nyaannounce", message)
})
