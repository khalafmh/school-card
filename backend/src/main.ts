import express from "express";

const port = process.env.PORT || 8080

const app = express()

// Error handlers
app.use(function fourOhFourHandler (req: any, res: any) {
    res.status(404).send()
})
app.use(function fiveHundredHandler (err: any, req: any, res: any, next: any) {
    console.error(err)
    res.status(500).send()
})

app.get(`/`, (req: any, res: any) => {
    res.send("hello")
})

app.listen(port, (err: any) => {
    if (err != null) {
        return console.error(err)
    }
    console.log(`listening on ${port}`)
})
