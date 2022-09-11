import express, {Request, Response} from "express";
import puppeteer from "puppeteer";

const frontendUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5173"
const port = process.env.PORT || 8080
const width = 2160;
const aspectRatio = 12 / 7;

const app = express();

app.get("/api/render-card", async (req: Request, res: Response) => {
    const browser = await puppeteer.launch({headless: "chrome"})
    const page = await browser.newPage()
    await page.setViewport({width: width, height: width / aspectRatio})

    const name = encodeURIComponent(req.query.name as string)
    const profession = encodeURIComponent(req.query.profession as string)
    const traits = encodeURIComponent(req.query.traits as string)
    const imageBase64 = encodeURIComponent(req.query.imageBase64 as string)
    await page.goto(
        `${frontendUrl}/school-card?name=${name}&profession=${profession}&traits=${traits}&imageBase64=${imageBase64}`,
        {waitUntil: "load"},
    )
    const screenshot = await page.screenshot({type: "png", encoding: "base64"})
    await browser.close()

    res.set("Content-Type", "application/json")
    res.send({screenshotBase64: screenshot})
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
