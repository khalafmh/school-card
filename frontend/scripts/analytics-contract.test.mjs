import assert from "node:assert/strict"
import {readFile, readdir} from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const frontendRoot = new URL("../", import.meta.url)
const sourceRoot = new URL("src/", frontendRoot)
const [html, analyticsSource, sourceFileNames] = await Promise.all([
    readFile(new URL("index.html", frontendRoot), "utf8"),
    readFile(new URL("analytics.ts", sourceRoot), "utf8"),
    readdir(sourceRoot, {recursive: true}),
])
const sourceFiles = await Promise.all(sourceFileNames
    .filter(fileName => /\.[jt]sx?$/.test(fileName))
    .map(async fileName => ({fileName, source: await readFile(new URL(fileName, sourceRoot), "utf8")})))
const appSource = sourceFiles.find(({fileName}) => fileName === "App.tsx")?.source
assert.ok(appSource, "App.tsx must be included in the analytics contract scan")

const eventListMatch = analyticsSource.match(/analyticsEvents\s*=\s*\[([\s\S]*?)]\s*as const/)
assert.ok(eventListMatch, "analyticsEvents must remain a readonly event allowlist")
const analyticsEvents = [...eventListMatch[1].matchAll(/"([^"]+)"/g)].map(match => match[1])
assert.ok(analyticsEvents.length > 0, "analyticsEvents must not be empty")
assert.equal(new Set(analyticsEvents).size, analyticsEvents.length, "analytics event names must be unique")

const privacyScript = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .find(source => source.includes("window.filterUmamiPayload"))
assert.ok(privacyScript, "the Umami privacy callback must be defined inline before the tracker loads")
const runtimeEventListMatch = privacyScript.match(/allowedEvents\s*=\s*new Set\(\[([\s\S]*?)]\)/)
assert.ok(runtimeEventListMatch, "the runtime event allowlist must be explicit")
const runtimeEvents = [...runtimeEventListMatch[1].matchAll(/"([^"]+)"/g)].map(match => match[1])

const origin = "https://school-card.mahdi.pro"
const context = {window: {location: {origin}}, URL}
vm.runInNewContext(privacyScript, context)
const filterPayload = context.window.filterUmamiPayload

const basePayload = {
    hostname: "school-card.mahdi.pro",
    title: "بطاقة تعريفية",
    url: `${origin}/`,
    referrer: "",
}

test("tracker configuration preserves the privacy contract", () => {
    const callbackPosition = html.indexOf("window.filterUmamiPayload")
    const trackerPosition = html.indexOf("https://umami.mahdi.pro/script.js")
    assert.ok(callbackPosition >= 0 && trackerPosition > callbackPosition, "privacy callback must load first")

    for (const attribute of [
        'crossorigin="anonymous"',
        'data-before-send="filterUmamiPayload"',
        'data-do-not-track="true"',
        'data-domains="school-card.mahdi.pro"',
        'data-exclude-hash="true"',
        'data-exclude-search="true"',
        'data-performance="true"',
    ]) {
        assert.ok(html.includes(attribute), `missing tracker attribute: ${attribute}`)
    }

    assert.match(html, /integrity="sha384-[A-Za-z0-9+/=]+"/)
    assert.ok(!html.includes("/recorder.js"), "session replay and heatmap collection must not be loaded")
})

test("only typed, data-free custom events are allowed", () => {
    const appEvents = [...appSource.matchAll(/trackEvent\("([^"]+)"\)/g)].map(match => match[1])
    assert.deepEqual([...new Set(appEvents)].sort(), [...analyticsEvents].sort())
    assert.deepEqual([...runtimeEvents].sort(), [...analyticsEvents].sort(), "runtime and typed allowlists must match")

    for (const {fileName, source} of sourceFiles) {
        if (fileName !== "analytics.ts") {
            assert.ok(!source.includes("window.umami"), `${fileName} must use the typed analytics wrapper`)
        }
    }

    for (const eventName of analyticsEvents) {
        const result = filterPayload("event", {...basePayload, name: eventName, data: undefined})
        assert.ok(result, `approved event was rejected: ${eventName}`)
        assert.equal(result.data, undefined)
    }

    assert.equal(filterPayload("event", {...basePayload, name: "user supplied text"}), false)
    assert.equal(filterPayload("event", {...basePayload, name: analyticsEvents[0], data: {value: "PII"}}), false)
    assert.equal(filterPayload("event", {...basePayload, data: "PII"}), false)
})

test("URLs and referrers are minimized and renderer traffic is rejected", () => {
    const sentinel = "PII_SENTINEL_DO_NOT_SEND"
    const result = filterPayload("event", {
        ...basePayload,
        url: `${origin}/?name=${sentinel}#${sentinel}`,
        referrer: `https://referrer.example/private/${sentinel}?value=${sentinel}#${sentinel}`,
    })

    assert.ok(result)
    assert.equal(result.url, `${origin}/`)
    assert.equal(result.referrer, "https://referrer.example/")
    assert.ok(!JSON.stringify(result).includes(sentinel))

    assert.equal(filterPayload("event", {...basePayload, url: `${origin}/school-card?name=${sentinel}`}), false)
    assert.equal(filterPayload("performance", {...basePayload, url: `${origin}/school-card`}), false)
    assert.equal(filterPayload("event", {...basePayload, url: `${origin}/unexpected/${sentinel}`}), false)
    assert.equal(filterPayload("event", {...basePayload, url: "https://attacker.example/"}), false)
    assert.equal(filterPayload("event", {...basePayload, url: "not a valid URL"}), false)
})

test("identification and unknown payload types fail closed", () => {
    assert.equal(filterPayload("identify", {...basePayload}), false)
    assert.equal(filterPayload("event", {...basePayload, id: "persistent-id"}), false)
    assert.equal(filterPayload("replay", {...basePayload}), false)

    const performancePayload = filterPayload("performance", {...basePayload, cls: 0.01, lcp: 1200})
    assert.ok(performancePayload)
    assert.equal(performancePayload.cls, 0.01)
    assert.equal(performancePayload.lcp, 1200)
})
