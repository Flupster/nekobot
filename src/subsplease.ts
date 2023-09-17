import Nyaa from "./nyaa"
import bot from "./irc"

Nyaa.on("release", (release) => {
  if (!release.title.includes("[SubsPlease]")) return

  const size = release.size.replace(" ", "").replace("i", "")
  const message = `[Release] ${release.title} (${size}) - ${release.guid} - ${release.torrent}`

  bot.say("#subsplease", message)
})
