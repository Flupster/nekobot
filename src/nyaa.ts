import EventEmitter from "events"
import logger from "./log"
import { getFetchText } from "./utils/queue"
import { parseRelease, parseReleases } from "./utils/parser"
import Db from "./db"

interface Nyaa {
  lastId: number
  log: logger.Logger
  on(event: "release", listener: (release: NyaaRelease) => void): this
  on(event: "release-list", listener: (release: NyaaRelease) => void): this
}

class Nyaa extends EventEmitter {
  constructor() {
    super()
    this.log = logger.getLogger("Nyaa")
    this.lastId = 0

    setInterval(this.update.bind(this), 30000)

    this.on("release-list", (r) => this.getRelease(r.id))
    this.update()
  }

  async update() {
    const releases = await this.getReleases()

    if (releases.length === 0) {
      this.log.warn("Got 0 releases from Nyaa")
      return
    }

    for (const release of releases.reverse()) {
      this.emit("release-list", release)
    }
  }

  async getReleases(): Promise<NyaaRelease[]> {
    const text = await getFetchText(`https://nyaa.si`)

    if (!text) {
      this.log.error("Could not fetch:", `https://nyaa.si`)
      return []
    }

    return parseReleases(text)
  }

  async getRelease(id: number, force?: false): Promise<NyaaRelease | null> {
    const exists = await Db.release.findFirst({ where: { id: { equals: id } } })
    if (exists && !force) return exists as NyaaRelease

    const text = await getFetchText(`https://nyaa.si/view/${id}`)

    if (!text) {
      this.log.error("Could not fetch:", `https://nyaa.si/view/${id}`)
      return null
    }

    const release = parseRelease(id, text)

    if (!release) {
      this.log.error("Failed to parse release", id)
      return null
    }

    const save = await Db.release.create({ data: release }).catch((ex) => {
      this.log.error(ex)
      return null
    })

    if (!save) return null

    this.log.info("Release:", release.id)
    this.emit("release", release)
    return release
  }
}

export default new Nyaa()
