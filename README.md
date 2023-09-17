# NekoBot

The IRC bot to announce new Nyaa releases.

NekoBot scrapes https://nyaa.si for new releases and sends a message to `#nyaannounce` in Rizon IRC

Autobrr Definition can be find here

Instructions on setting up custom definitions in autobrr can be found [here](https://autobrr.com/configuration/indexers/#custom-indexer-definitions)

## Setting up the bot

#### Dependencies
[Bun](https://bun.sh/) is used to run the bot for zero typescript dependencies and speed.  
Redis is required to keep state of last reported release


#### Setup
 - Set the last release in redis: `redis-cli set nyaa:last 0`
 - Copy .env.example to .env and edit with correct settings
 - Install bun dependencies with `bun install`

Run the bot!

```bash
# Run in terminal
bun src/index.ts;
```

```bash
# Or with PM2 to manage the process
pm2 start --interpreter bun src/index.ts --name="NekoBot"
```