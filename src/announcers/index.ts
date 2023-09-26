import { readdir } from "node:fs/promises"
import logger from "../log"

const log = logger.getLogger("announce")
const announcers = await readdir(import.meta.dir)

announcers
  .filter((a) => a !== "index.ts")
  .forEach((a) => {
    log.info("Importing announcer:", a)
    import(import.meta.dir + "/" + a)
  })
