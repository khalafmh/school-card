import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import puppeteer, {Page} from "puppeteer";

const frontendUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5173"
const port = process.env.PORT || 8080
const width = 2160;
const aspectRatio = 12 / 7;

const app = express();
app.use(cors({
    origin: frontendUrl,
}))
app.use(bodyParser.json())

app.post("/api/render-card", async (req: Request, res: Response) => {
    const name = encodeURIComponent(req.body.name)
    const profession = encodeURIComponent(req.body.profession)
    const traits = encodeURIComponent(req.body.traits)
    const imageDataUrl = req.body.imageDataUrl

    const browser = await puppeteer.launch({headless: "chrome"})
    const page: Page = await browser.newPage()
    await page.setViewport({width: width, height: width / aspectRatio})
    await page.goto(
        `${frontendUrl}/school-card?name=${name}&profession=${profession}&traits=${traits}`,
        {waitUntil: "load"},
    )
    await page.type("#imageDataUrl", imageDataUrl)
    const screenshot = await page.screenshot({type: "png", encoding: "base64"})
    await browser.close()

    res.set("Content-Type", "application/json")
    res.json({screenshotBase64: screenshot})
});

// Error handlers
app.use(function fourOhFourHandler(req: any, res: any) {
    res.status(404).send()
});
app.use(function fiveHundredHandler(err: any, req: any, res: any, next: any) {
    console.error(err)
    res.status(500).send()
});

app.listen(port, () => {
    console.log(`listening on ${port}`)
});
