import NyaaReleases from "./nyaa"
import redis from "./redis"
import bot from "./irc"

const getLastID = async () => {
  const last = await redis.get("last")
  if (!last) throw "Last release ID is not set in redis"

  return parseInt(last, 10)
}

let reporting = false

const reportReleases = async () => {
  // Last report function is still running...
  if (reporting) {
    console.warn(new Date(), "Still reporting releases...")
    return
  }

  // Used to make sure we don't re-run the function while it's still running
  reporting = true

  console.log(new Date(), "Reporting Releases")

  // Get last Release ID from redis
  const last = await getLastID().catch((ex) => {
    console.error(new Date(), "Unable to get last release ID from redis", ex)
    process.exit(1)
  })

  // Get releases from Nyaa
  const releases = await NyaaReleases().catch((ex) => {
    console.error(new Date(), "Unable to get Nyaa Releases:", ex)
    return []
  })

  // Loop through releases where the ID is greater than last reported ID
  for (const release of releases.filter((release) => release.id > last).reverse()) {
    const message = `[${release.category}] - ${release.title} - (${release.size}) - https://nyaa.si/view/${release.id}/torrent`
    await bot.say("#nyaannounce", message)
    await redis.set("last", release.id)
  }

  // Finished function set reporting to false for next run
  reporting = false
}

// run reportReleases every 30s
setInterval(reportReleases, 30000)
