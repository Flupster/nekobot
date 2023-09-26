import nyaa from "../nyaa"
import tokyotosho from "../utils/tokyotosho"
import logger from "../log"

const log = logger.getLogger("ingester:tokyotosho")

tokyotosho.on("release", async (id) => {
  log.info("New Release", id)
  await nyaa.getRelease(id)
})
