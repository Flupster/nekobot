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

type Release = {
  id: number
  name: string
  created_at: string
}

type TokyoTorrent = {
  id: number
  category: string
  categoryId: number
  name: string
  url: string
  size: string
  description: string | null
}

type TokyoRelease = {
  category: string
  title: string
  size: string
  torrent: string
}
