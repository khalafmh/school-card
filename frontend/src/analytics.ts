export const analyticsEvents = [
    "choose_photo",
    "crop_image",
    "click_download",
    "card_download_succeeded",
    "card_download_failed",
] as const

export type AnalyticsEvent = typeof analyticsEvents[number]

declare global {
    interface Window {
        umami?: {
            track: (eventName: string) => unknown
        }
    }
}

export const trackEvent = (eventName: AnalyticsEvent): void => {
    window.umami?.track(eventName)
}
