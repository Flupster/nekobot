type NyaaRelease = {
  id: number
  title: string
  categoryId: string
  comments: number
  downloads: number
  infoHash: string
  leechers: number
  remake: boolean
  seeders: number
  size: string
  trusted: boolean
  pubDate: Date
  details: string
  exists?: boolean
}
