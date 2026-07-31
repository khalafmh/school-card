# Analytics

The frontend uses the self-hosted Umami 3 tracker at `https://umami.mahdi.pro`.

## Privacy contract

Analytics must remain anonymous and data-minimized:

- Only the production root page (`/` or `/index.html`) is eligible for analytics.
- `/school-card` is a private Puppeteer rendering route and must never emit analytics.
- Query strings and hashes are removed from URLs.
- External referrers are reduced to their origin; same-origin referrers are removed.
- Identification payloads, persistent IDs, event properties, and unknown payload types fail closed.
- Custom events are restricted to the typed allowlist in `frontend/src/analytics.ts`.
- Components must use `trackEvent()` rather than calling `window.umami` directly.
- Session Replay and Heatmaps must remain disabled. Do not add Umami's `recorder.js` to this site.

The approved event funnel is:

1. `choose_photo`
2. `crop_image`
3. `click_download`
4. `card_download_succeeded`

`card_download_failed` is tracked as the failure branch. These events intentionally have no properties.

Core Web Vitals collection is enabled with `data-performance="true"`. Performance payloads pass through the same privacy callback and are rejected for the private renderer.

## Environments

The production website ID must only be used for `school-card.mahdi.pro`. If staging analytics are needed, create a separate Umami website ID and restrict it to the staging hostname; never add staging domains to the production tracker.

## Verification

From `frontend/`, run:

```bash
corepack yarn test
corepack yarn build
corepack yarn verify:umami-tracker
```

The test suite validates the local analytics contract. The remote verification command checks that:

- The deployed tracker still matches the pinned SHA-384 Subresource Integrity hash.
- The tracker supports cross-origin SRI.
- Session Replay and Heatmaps are disabled for the production website.

The remote check is intentionally not part of CI because an Umami outage should not block unrelated frontend deployments.

## Upgrading Umami

The tracker is pinned fail-closed with Subresource Integrity. If `/script.js` changes, analytics stop loading while the application continues to work.

For each Umami upgrade:

1. Review tracker and release-note changes, especially payload types and privacy behavior.
2. Run `corepack yarn verify:umami-tracker`. If the hash changed, independently review the downloaded tracker before updating `integrity` in `frontend/index.html`.
3. Confirm Session Replay and Heatmaps remain disabled in **Websites → Edit → Replays & Heatmaps**.
4. Run the tests, production build, remote verification, and a browser network smoke test.
5. Use a separate website ID for any staging validation.

Do not introduce `umami.identify()`, user-derived event names, arbitrary event properties, form values, image metadata, or raw errors without a new privacy review.
