import { load } from "cheerio"

export const parseRelease = (id: number, text: string) => {
  const $ = load(text)

  const release: Partial<NyaaRelease> = {}
  release.id = id
  release.title = $("h3.panel-title").first().text().trim()
  release.categoryId = $("div.panel-body a:nth-child(2)").attr("href")?.substring(4)
  release.comments = parseInt($(".panel-title").last().text().trim().substring(11), 10) ?? 0
  release.downloads = parseInt($(".panel-body .row:nth-child(4) div:nth-child(4)").text().trim(), 10) ?? 0
  release.infoHash = $("kbd").first().text().trim()
  release.leechers = parseInt($(".panel-body .row:nth-child(3) div:nth-child(4) span").text().trim(), 10) ?? 0
  release.remake = $("div.panel.panel-danger").length > 0
  release.seeders = parseInt($(".panel-body .row:nth-child(2) div:nth-child(4) span").text().trim(), 10) ?? 0
  release.size = $(".panel-body .row:nth-child(4) div:nth-child(2)").text().trim()
  release.trusted = $("div.panel.panel-success").length > 0
  release.pubDate = new Date(($(".panel-body .row:nth-child(1) div:nth-child(4)").data("timestamp") as number) * 1000)
  release.details = $(".panel-body:nth-child(1)").toString()

  return release as NyaaRelease
}

export const parseReleases = (text: string) => {
  const $ = load(text)

  return $(".torrent-list tbody tr")
    .toArray()
    .map((el) => {
      const release: Partial<NyaaRelease> = {}
      const tds = $(el).find("td")

      release.id = parseInt($(tds[1]).find("a").attr("href")?.split("/")[2] ?? "", 10)
      release.title = $(tds[1]).find("a").last().attr("title")
      release.categoryId = $(tds[0]).find("a").attr("href")?.substring(4)
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
