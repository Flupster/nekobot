import Nyaa from "../nyaa"
import bot from "../irc"
import logger from "../log"
import { getChannelByName } from "../db"

const log = logger.getLogger("announce:subsplease")

// Nyaa gives it XiB, convert to XB (MiB=>MB, GiB=>GB, etc)
const convertSize = (size: string) => {
  const ssplit = size.split(" ")
  if (ssplit.length !== 2) {
    log.warn("Failed to parse size", size, ssplit)
    return size.replace(" ", "").replace("i", "")
  }

  return (parseFloat(ssplit[0]) * 1.048576).toFixed(2) + ssplit[1].replace("i", "")
}

Nyaa.on("release", (release) => {
  const enabled = getChannelByName("subsplease")
  if (!enabled || !enabled.enabled) {
    log.trace("Channel Disabled, Skipping release", enabled, release.title)
    return
  }

  if (!release.title.includes("[SubsPlease]")) {
    log.trace("Release is not a SubsPlease release")
    return
  }

  if (!release.trusted) {
    log.warn("Untrusted SubsPlease release", release)
    return
  }

  const message = `[Release] ${release.title} (${convertSize(release.size)}) - ${release.guid} - ${release.torrent}`
  bot.say("#subsplease", message)
})
