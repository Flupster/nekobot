import Nyaa from "../nyaa"
import bot from "../irc"
import logger from "../log"
import Db from "../db"

const log = logger.getLogger("announcer:nyaannounce")

const announce = async (release: NyaaRelease) => {
  log.trace("Announcing release:", release.title)
  const category = await Db.category.findFirst({ where: { id: { equals: release.categoryId } } })

  const url = `https://nyaa.si/view/${release.id}/torrent`
  const message = `[${category?.name ?? "???"}] - ${release.title} - (${release.size}) - ${url}`

  bot.say("#nyaannounce", message)
}

Nyaa.on("release", announce)
