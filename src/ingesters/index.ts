import { readdir } from "node:fs/promises"
import logger from "../log"

const log = logger.getLogger("ingester")
const ingesters = await readdir(import.meta.dir)

ingesters
  .filter((a) => a !== "index.ts")
  .forEach((a) => {
    log.info("Importing ingester:", a)
    import(import.meta.dir + "/" + a)
  })
