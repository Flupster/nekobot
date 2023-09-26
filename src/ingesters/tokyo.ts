import nyaa from "../nyaa"
import tokyotosho from "../utils/tokyotosho"
import logger from "../log"

const log = logger.getLogger("ingester:tokyotosho")

tokyotosho.on("release", async (release) => {
  log.info("New Release", release.id)
  await nyaa.getRelease(release.id)
})
