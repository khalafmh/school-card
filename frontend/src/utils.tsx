import {backendUrl} from "./constants";

export function isBlank(s: any) {
    return /^\s*$/.test(s)
}

export function constrain(min: number, value: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

export async function cropImagePercent(
    src: string,
    widthPercent: number,
    heightPercent: number,
    xPercent: number,
    yPercent: number
): Promise<string> {
    const widthRatio = widthPercent / 100
    const heightRatio = heightPercent / 100
    const xRatio = xPercent / 100
    const yRatio = yPercent / 100

    const image = new Image()
    image.src = src

    const canvas = document.createElement("canvas")
    const canvasCtx = canvas.getContext("2d")

    const promise = new Promise<string>(resolve => {
        image.addEventListener("load", () => {
            canvas.width = image.width * widthRatio
            canvas.height = image.height * heightRatio
            canvasCtx!!.drawImage(
                image,
                image.width * xRatio,
                image.height * yRatio,
                image.width * widthRatio,
                image.height * heightRatio,
                0,
                0,
                image.width * widthRatio,
                image.height * heightRatio
            )
            const result = canvas.toDataURL("image/jpeg", 0.9);
            canvas.remove()
            resolve(result)
        })
    })
    return await promise
}

export async function initiateDownload(name: string, profession: string, traits: string, imageDataUrl: string) {
    return fetch(`${backendUrl}/api/render-card`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            profession,
            traits,
            imageDataUrl,
        }),
    })
        .then(async response => {
            if (response.ok) {
                const json = await response.json()
                const {screenshotBase64} = json
                const element = document.createElement("a")
                element.download = "بطاقة تعريفية.png"
                element.href = `data:image/png;base64,${screenshotBase64}`
                element.click()
                element.remove()
                return null
            } else {
                return new Error(`failed to download file: ${response.status} ${response.statusText}`)
            }
        }).catch(err => {
            err.message = `فشل التنزيل: ${err.message}`
            return err
        })
}