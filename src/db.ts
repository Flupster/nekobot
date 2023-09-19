import { Database } from "bun:sqlite"
import logger from "./log"

const log = logger.getLogger("DB")

const db = new Database("neko.sqlite")

const table = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='releases';").get()

if (!table) {
  db.query(
    "CREATE TABLE releases (id INTEGER PRIMARY KEY, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
  ).get()

  log.info("Created 'releases' Table")
}

export const insertRelease = (id: number, name: string) => {
  const insert = db.prepare("INSERT INTO releases (id,name) VALUES ($id,$name)")
  log.trace("Inserting: ", id, name)
  return insert.run({ $id: id, $name: name })
}

export const getReleaseById = (id: number) => {
  const query = db.prepare("SELECT * FROM releases WHERE id = $id")
  return query.get({ $id: id }) as Release | null
}

export default db
