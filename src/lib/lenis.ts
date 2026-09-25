import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Standard smooth-scroll init — npm package instead of the CDN
// script tag used in the plain-HTML pipeline. Call once from
// BaseLayout.astro on the client.
//
// The instance is also stashed on window.__lenis: a section that takes over
// native scroll itself (e.g. Hero's locked scroll-scrub) needs to pause Lenis
// first, or the two fight over wheel input.
export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  window.__lenis = lenis;

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}
