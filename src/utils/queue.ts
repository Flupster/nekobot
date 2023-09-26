import PQueue from "p-queue"
import log4js from "../log"

const log = log4js.getLogger("Queue")

const Queue = new PQueue({ concurrency: 1, interval: 5000, intervalCap: 1 })

export const getFetchText = async (url: string) => {
  const job = async () => {
    const response = await fetch(url)
    log.trace(`GET ${url}`, response.status)
    return await response.text()
  }

  return Queue.add(job)
}

export default Queue
