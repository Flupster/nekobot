export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IRC_SERVER: string
      IRC_NICK: string
      IRC_NAME: string
      IRC_PASS: string
      IRC_DEBUG: "true" | "false"
    }
  }
}
