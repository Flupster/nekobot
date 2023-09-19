import log4js from "log4js"

log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level: "all" } },
})

export default log4js
