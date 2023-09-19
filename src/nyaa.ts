import { load } from "cheerio"
import EventEmitter from "events"
import { getReleaseById, insertRelease } from "./db"
import TokyoTosho from "./tokyotosho"
import logger from "./log"

interface Nyaa {
  categoryMap: Map<string, string>
  log: logger.Logger
  on(event: "release", listener: (release: NyaaRelease) => void): this
  on(event: "tokyorelease", listener: (release: TokyoRelease) => void): this
}

class Nyaa extends EventEmitter {
  constructor() {
    super()
    this.log = logger.getLogger("Nyaa")
    setInterval(this.update.bind(this), 30000)
    TokyoTosho.on("release", (r, c) => this.convertTokyoTorrent(r, c))

    this.categoryMap = new Map<string, string>([
      ["1_1", "Anime - Anime Music Video"],
      ["1_2", "Anime - English-translated"],
      ["1_3", "Anime - Non-English-translated"],
      ["1_4", "Anime - Raw"],
      ["2_1", "Audio - Lossless"],
      ["2_2", "Audio - Lossy"],
      ["3_1", "Literature - English-translated"],
      ["3_2", "Literature - Non-English-translated"],
      ["3_3", "Literature - Raw"],
      ["4_1", "Live Action - English-translated"],
      ["4_2", "Live Action - Idol/Promotional Video"],
      ["4_3", "Live Action - Non-English-translated"],
      ["4_4", "Live Action - Raw"],
      ["5_1", "Pictures - Graphics"],
      ["5_2", "Pictures - Photos"],
      ["6_1", "Software - Applications"],
      ["6_2", "Software - Games"],
    ])
  }

  async update() {
    const releases = await this.getReleases()

    if (releases.length === 0) {
      this.log.warn("Got 0 releases from Nyaa")
      return
    }

    for (const release of releases.reverse()) {
      const exists = getReleaseById(release.id)
      if (!exists) {
        insertRelease(release.id, release.title)
        this.emit("release", release)
      }
    }
  }

  async getReleases(): Promise<NyaaRelease[]> {
    const response = await fetch("https://nyaa.si/")
    this.log.trace("GET https://nyaa.si/", response.status)

    const text = await response.text()
    const $ = load(text)

    return $(".torrent-list tbody tr")
      .toArray()
      .map((el) => {
        const release: Partial<NyaaRelease> = {}
        const tds = $(el).find("td")

        release.id = parseInt($(tds[1]).find("a").attr("href")?.split("/")[2] ?? "", 10)
        release.title = $(tds[1]).find("a").last().attr("title")
        release.guid = `https://nyaa.si/view/${release.id}`
        release.link = `https://nyaa.si/download/${release.id}.torrent`
        release.torrent = `https://nyaa.si/view/${release.id}/torrent`
        release.categoryId = $(tds[0]).find("a").attr("href")?.substring(4) as CategoryIds
        release.category = this.categoryMap.get(release.categoryId) as Categories
        release.comments = parseInt($(tds[1]).find(".comments").text().trim(), 10) ?? 0
        release.downloads = parseInt($(tds[7]).text(), 10) ?? 0
        release.infoHash = ""
        release.leechers = parseInt($(tds[6]).text(), 10) ?? 0
        release.remake = el.attribs.class.includes("danger")
        release.seeders = parseInt($(tds[5]).text(), 10) ?? 0
        release.size = $(tds[3]).text()
        release.trusted = el.attribs.class.includes("success")
        release.pubDate = new Date($(tds[4]).text())

        release.comments = isNaN(release.comments) ? 0 : release.comments

        return release as NyaaRelease
      })
  }

  convertTokyoTorrent(torrent: TokyoTorrent, category: string) {
    // convert size from XB to XiB
    const sizeRegex = /(\d.+)?([KMGTP])B/
    const sizeMatch = sizeRegex.exec(torrent.size)
    if (!sizeMatch) {
      this.log.warn("TokyoTorrent size could not be parsed", torrent.size)
      return
    }

    // extract nyaa id
    const idRegex = /https:\/\/nyaa\.si\/download\/(\d+)\.torrent/
    const idMatch = idRegex.exec(torrent.url)
    if (!idMatch) {
      this.log.warn("Nyaa ID from tokyo url could not be parsed", torrent.url)
      return
    }

    const id = parseInt(idMatch[1], 10)
    const size = `${parseFloat(sizeMatch[1]).toFixed(1)} ${sizeMatch[2]}iB`

    this.emit("tokyorelease", {
      category,
      title: torrent.name,
      size,
      torrent: `https://nyaa.si/view/${id}/torrent`,
    })

    insertRelease(id, torrent.name)
  }
}

export default new Nyaa()
