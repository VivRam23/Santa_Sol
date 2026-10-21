// Tiny analytics bridge. Sends events to whichever tool is installed:
// Google Tag Manager / GA4 (window.dataLayer) or Plausible (window.plausible).
// Events: cta_click, phone_click, form_start, form_submit, booking_complete.
// TODO(analytics): add the chosen tool's snippet in src/layouts/Base.astro.

type Props = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  window.dataLayer?.push({ event, ...props });
  window.plausible?.(event, { props });
}

/** Wires every element with data-event="…" (and optional data-section) to track() on click. */
export function trackClicks(root: Document = document): void {
  root.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-event]');
    if (!el) return;
    track(el.dataset.event ?? 'click', {
      section: el.dataset.section ?? '',
      label: (el.textContent ?? '').trim().slice(0, 60),
    });
  });
}
