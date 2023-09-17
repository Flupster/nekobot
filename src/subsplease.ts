import Nyaa from "./nyaa"
import bot from "./irc"

Nyaa.on("release", (release) => {
  if (!release.title.includes("[SubsPlease]")) return

  const ssplit = release.size.split(" ")
  if (ssplit.length !== 2) {
    console.warn(new Date(), "Failed to parse size")
    return
  }

  const size = (parseFloat(ssplit[0]) * 1.048576).toFixed(2) + ssplit[1].replace("i", "")
  const message = `[Release] ${release.title} (${size}) - ${release.guid} - ${release.torrent}`

  bot.say("#subsplease", message)
})
