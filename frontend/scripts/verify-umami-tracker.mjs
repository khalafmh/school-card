import {createHash} from "node:crypto"
import {readFile} from "node:fs/promises"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")
const trackerTag = html.match(/<script[^>]+src="https:\/\/umami\.mahdi\.pro\/script\.js"[^>]*>/)?.[0]
if (!trackerTag) throw new Error("Could not find the Umami tracker script tag")

const sourceUrl = trackerTag.match(/src="([^"]+)"/)?.[1]
const expectedIntegrity = trackerTag.match(/integrity="([^"]+)"/)?.[1]
if (!sourceUrl || !expectedIntegrity) throw new Error("The tracker URL or integrity hash is missing")

const response = await fetch(sourceUrl, {cache: "no-store"})
if (!response.ok) throw new Error(`Tracker download failed with HTTP ${response.status}`)
if (response.headers.get("access-control-allow-origin") !== "*") {
    throw new Error("The tracker must return Access-Control-Allow-Origin: * for cross-origin SRI")
}

const source = Buffer.from(await response.arrayBuffer())
const actualIntegrity = `sha384-${createHash("sha384").update(source).digest("base64")}`
if (actualIntegrity !== expectedIntegrity) {
    throw new Error(`Tracker integrity mismatch\nExpected: ${expectedIntegrity}\nActual:   ${actualIntegrity}`)
}

console.log(`Verified ${sourceUrl} (${source.length} bytes, ${actualIntegrity})`)
