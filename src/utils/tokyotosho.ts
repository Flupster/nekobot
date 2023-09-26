import EventEmitter from "events"
import irc from "../irc"
import logger from "../log"

interface TokyoToshi {
  log: logger.Logger
  on(event: "release", listener: (release: number) => void): this
}

class TokyoToshi extends EventEmitter {
  constructor() {
    super()
    this.log = logger.getLogger("TokyoTosho")

    irc.on("message#tokyotosho-api", (_, message) => this.onMessage(message))
  }

  parseTokyoTorrent(message: string): number | null {
    const regex = /https:\/\/nyaa\.si\/view\/(?<id>\d+)\/torrent/g
    const match = regex.exec(message)
    if (!match?.groups) return null

    return parseInt(match.groups.id, 10)
  }

  onMessage(message: string) {
    // Parse Message
    const id = this.parseTokyoTorrent(message)
    if (!id) {
      this.log.trace("Torrent id failed regex match:", message)
      return
    }

    this.emit("release", id)
  }
}

export default new TokyoToshi()
