import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import puppeteer, {Page} from "puppeteer";
import * as process from "process";

const frontendUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5173"
const port = (process.env.PORT && parseInt(process.env.PORT)) || 8080
const width = 2160;
const aspectRatio = 12 / 7;
const browserPromise = puppeteer.launch({headless: true, args: ["--no-sandbox"]})

const app = express();
app.use(cors({
    origin: frontendUrl,
}))
app.use(bodyParser.json({limit: "10mb"}))

app.post("/api/render-card", async (req: Request, res: Response) => {
    const {name, profession, traits, imageDataUrl} = req.body

    const browser = await browserPromise
    const page: Page = await browser.newPage()
    try {
        await page.setViewport({width: width, height: width / aspectRatio})
        await page.goto(`${frontendUrl}/school-card`, {waitUntil: "load"})
        await page.evaluate((cardData) => {
            const setValue = (id: string, value: string) => {
                const input = document.getElementById(id)
                if (!(input instanceof HTMLInputElement) && !(input instanceof HTMLTextAreaElement)) {
                    throw new Error(`Missing card input: ${id}`)
                }
                input.value = value
            }

            setValue("cardName", cardData.name)
            setValue("cardProfession", cardData.profession)
            setValue("cardTraits", cardData.traits)
            setValue("cardImageDataUrl", cardData.imageDataUrl)
        }, {name, profession, traits, imageDataUrl})
        await page.click("#cardUpdateButton")
        await page.waitForFunction(() => (
            document.getElementById("cardRenderRoot")?.getAttribute("data-render-version") === "1"
        ))
        const screenshot = await page.screenshot({type: "png", encoding: "base64"})
        res.set("Content-Type", "application/json")
        res.json({screenshotBase64: screenshot})
    } catch (err) {
        console.error(err)
        res.status(500)
        res.json(err)
    } finally {
        await page.close()
    }
});

// Error handlers
app.use(function fourOhFourHandler(req: any, res: any) {
    res.status(404).send()
});
app.use(function fiveHundredHandler(err: any, req: any, res: any, next: any) {
    console.error(err)
    res.status(500).send()
});

app.listen(port, "0.0.0.0", () => {
    console.log(`listening on ${port}`)
});
