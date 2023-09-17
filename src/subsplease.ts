import Nyaa from "./nyaa"
import bot from "./irc"

// Nyaa gives it XiB, convert to XB (MiB=>MB, GiB=>GB, etc)
const convertSize = (size: string) => {
  const ssplit = size.split(" ")
  if (ssplit.length !== 2) {
    console.warn(new Date(), "Failed to parse size")
    return size.replace(" ", "").replace("i", "")
  }

  return (parseFloat(ssplit[0]) * 1.048576).toFixed(2) + ssplit[1].replace("i", "")
}

Nyaa.on("release", (release) => {
  if (!release.title.includes("[SubsPlease]")) return

  if (!release.trusted) {
    console.warn(new Date(), "Untrusted SubsPlease release", release)
    return
  }

  const message = `[Release] ${release.title} (${convertSize(release.size)}) - ${release.guid} - ${release.torrent}`
  bot.say("#subsplease", message)
})
