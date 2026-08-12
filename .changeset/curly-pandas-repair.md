---
"resize-panel": minor
---

Fix behaviour the README already promised, and add a Playwright suite covering it.

- **Attributes now apply to panels created from script.** Rendering read the attributes in the constructor, which runs before the parser or `document.createElement()` has set any of them — so `w`, `h`, `src`, `min-*` and `max-*` were silently ignored by every framework that builds elements programmatically. Rendering moved to `connectedCallback`.
- **`data-theme="dark"` now applies.** The dark palette was nested as `&[data-theme="dark"]` inside `:host`, which resolves to a selector that matches no element. It is now `:host([data-theme='dark'])`.
- **Sizes are exact.** `.panel-container` had no `box-sizing`, so its 1px border sat outside the requested width: `w="400px"` rendered 402px. Panels render 2px narrower and shorter than in 1.0.0.
- **`data-display-position="none"` hides the readout without silencing the `resize` event.** It previously returned before installing the observer, so no resize events fired at all.
- **No more leaked `ResizeObserver` on re-render**, and the readout keeps its position class instead of falling back to `class="resize-display null"`.
- **The embedded iframe gets a title** from `aria-label`, which was declared in `observedAttributes` but never used.
