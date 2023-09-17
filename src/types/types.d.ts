type Categories =
  | "Anime - Anime Music Video"
  | "Anime - English-translated"
  | "Anime - Non-English-translated"
  | "Anime - Raw"
  | "Audio - Lossless"
  | "Audio - Lossy"
  | "Literature - English-translated"
  | "Literature - Non-English-translated"
  | "Literature - Raw"
  | "Live Action - English-translated"
  | "Live Action - Idol/Promotional Video"
  | "Live Action - Non-English-translated"
  | "Live Action - Raw"
  | "Pictures - Graphics"
  | "Pictures - Photos"
  | "Software - Applications"
  | "Software - Games"

type CategoryIds =
  | "1_1"
  | "1_2"
  | "1_3"
  | "1_4"
  | "2_1"
  | "2_2"
  | "3_1"
  | "3_2"
  | "3_3"
  | "4_1"
  | "4_2"
  | "4_3"
  | "4_4"
  | "5_1"
  | "5_2"
  | "6_1"
  | "6_2"

type NyaaRelease = {
  id: number
  title: string
  guid: string
  link: string
  category: Categories
  categoryId: CategoryIds
  comments: number
  downloads: number
  infoHash: string
  leechers: number
  remake: boolean
  seeders: number
  size: string
  trusted: boolean
  pubDate: Date
}
