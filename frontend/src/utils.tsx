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