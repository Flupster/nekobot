import { load } from "cheerio"

const getReleases = async (): Promise<NyaaRelease[]> => {
  const response = await fetch("https://nyaa.si/")
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
      release.categoryId = $(tds[0]).find("a").attr("href")?.substring(4) as CategoryIds
      release.category = CategoryMap.get(release.categoryId) as Categories
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

const CategoryMap = new Map<string, string>([
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

export default getReleases
