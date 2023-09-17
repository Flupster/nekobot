import Redis from "ioredis"

const redis = new Redis({ keyPrefix: "nyaa:" })

export default redis
