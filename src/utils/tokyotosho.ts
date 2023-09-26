import EventEmitter from "events"
import irc from "../irc"
import logger from "../log"

interface TokyoToshi {
  categoryMap: Map<number, string>
  log: logger.Logger
  on(event: "release", listener: (release: TokyoTorrent, category: string) => void): this
}

class TokyoToshi extends EventEmitter {
  constructor() {
    super()

    this.categoryMap = new Map<number, string>([
      [1, "Anime - English-translated"],
      [10, "Anime - Non-English-translated"],
      [7, "Anime - Raw"],
    ])

    this.log = logger.getLogger("TokyoTosho")

    irc.on("message#tokyotosho-api", (_, message) => this.onMessage(message))
  }

  parseTokyoTorrent(message: string): TokyoTorrent | null {
    const regex =
      /^Torrent[\u001E](?<id>\d+)[\u001E](?<category>.*)[\u001E](?<categoryId>\d+)[\u001E](?<name>.*)[\u001E](?<url>.*)[\u001E](?<size>\d.+?[KMGTP]B?)[\u001E]?(?<description>.*)$/g

    const match = regex.exec(message)
    if (!match?.groups) return null

    const torrent: Partial<TokyoTorrent> = match.groups
    torrent.id = parseInt(match.groups.id, 10)
    torrent.categoryId = parseInt(match.groups.categoryId, 10)
    torrent.description = torrent.description !== "" ? torrent.description : null
    return torrent as TokyoTorrent
  }

  onMessage(message: string) {
    // Parse Message
    const torrent = this.parseTokyoTorrent(message)
    if (!torrent) {
      this.log.trace("Torrent failed regex match:", message)
      return
    }

    // Category map
    const category = this.categoryMap.get(torrent.categoryId)
    if (!category) {
      this.log.trace("Torrent failed category mapping:", torrent.categoryId)
      return
    }

    // Is Nyaa Torrent
    const isNyaa = torrent.url.startsWith("https://nyaa.si/")
    if (!isNyaa) {
      this.log.trace("Torrent failed nyaa url match:", torrent.url)
      return
    }

    this.emit("release", torrent, category)
  }
}

export default new TokyoToshi()
