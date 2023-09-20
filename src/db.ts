import { Database } from "bun:sqlite"
import logger from "./log"

const log = logger.getLogger("DB")

const db = new Database("neko.sqlite")

const table_releases = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='releases';").get()
if (!table_releases) {
  db.query(
    "CREATE TABLE releases (id INTEGER PRIMARY KEY, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
  ).get()

  log.info("Created 'releases' Table")
}

const table_channels = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='channels';").get()
if (!table_channels) {
  db.query("CREATE TABLE channels (channel VARCHAR(20) PRIMARY KEY, enabled INTEGER DEFAULT 0)").get()

  log.info("Created 'channels' Table")
}

export const insertRelease = (id: number, name: string) => {
  const insert = db.prepare("INSERT INTO releases (id,name) VALUES ($id,$name)")
  log.trace("Inserting release: ", id, name)
  return insert.run({ $id: id, $name: name })
}

export const getReleaseById = (id: number) => {
  const query = db.prepare("SELECT * FROM releases WHERE id = $id")
  return query.get({ $id: id }) as Release | null
}

export const getChannelByName = (channel: string) => {
  const query = db.prepare("SELECT * FROM channels WHERE channel = $channel")
  const chan = query.get({ $channel: channel }) as { channel: string; enabled: number }
  if (!chan) return null

  return {
    channel: chan.channel,
    enabled: Boolean(chan.enabled),
  }
}

export const setChannelEnabled = (channel: string, enabled: boolean) => {
  if (channel.startsWith("#")) channel.substring(1, channel.length)

  const chan = getChannelByName(channel)
  if (!chan) {
    log.info("Inserting channel:", { channel, enabled })
    const insert = db.prepare("INSERT INTO channels (channel,enabled) VALUES ($channel,$enabled)")
    return insert.run({ $channel: channel, $enabled: enabled ? 1 : 0 })
  } else {
    const set = db.prepare("UPDATE channels SET enabled = $enabled WHERE channel = $channel")
    return set.run({ $channel: channel, $enabled: enabled ? 1 : 0 })
  }
}

export default db
