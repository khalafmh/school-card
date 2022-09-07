export function isBlank(s) {
    return /^\s*$/.test(s)
}

export function constrain(min: number, value: number, max: number) {
    return Math.max(min, Math.min(max, value))
}