// Scroll-reveal, progressive enhancement only: the default state (see the
// `.reveal` rule in global.css) is fully visible, so the page is complete at
// first paint even if this never runs. JS only ever hides what's already
// below the fold at load, then fades each `.reveal` element in as its
// `[data-reveal-group]` ancestor's items scroll into view.
//
// Also rolls any `.num[data-target]` odometer inside a just-revealed element
// (see the digit-strip CSS in KeyStats.astro) — reusable by any future
// section that wants the same "count up" reveal, not just Key Stats.
//
// Call once from BaseLayout.astro on the client.
export function initReveal() {
  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rollOdometer(el: Element) {
    const text = el.textContent || '';
    if (reduceMotion) return; // leave the plain, correct text as-is
    el.textContent = '';
    el.classList.add('odometer');
    const frag = document.createDocumentFragment();
    const strips: { el: HTMLElement; digit: string }[] = [];
    text.split('').forEach((ch) => {
      if (ch >= '0' && ch <= '9') {
        const box = document.createElement('span');
        box.className = 'odo-digit';
        const strip = document.createElement('span');
        strip.className = 'odo-strip';
        for (let d = 0; d <= 9; d++) {
          const row = document.createElement('span');
          row.className = 'odo-row';
          row.textContent = String(d);
          strip.appendChild(row);
        }
        box.appendChild(strip);
        frag.appendChild(box);
        strips.push({ el: strip, digit: ch });
      } else {
        frag.appendChild(document.createTextNode(ch));
      }
    });
    el.appendChild(frag);
    el.getBoundingClientRect(); // force layout so the transform below actually transitions
    strips.forEach((s, i) => {
      setTimeout(() => {
        s.el.style.transform = `translateY(-${s.digit}em) translateZ(0)`;
      }, 100 + i * 90);
    });
  }

  function markRevealed(el: Element) {
    el.classList.remove('reveal-pending');
    el.classList.add('reveal-in');
    const nums = el.querySelectorAll('.num[data-target]');
    if (nums.length) nums.forEach(rollOdometer);
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(markRevealed);
    return;
  }

  const groups = document.querySelectorAll('[data-reveal-group]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markRevealed(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  groups.forEach((group) => {
    const items = group.querySelectorAll('.reveal');
    items.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (!reduceMotion && rect.top > window.innerHeight * 0.92) {
        el.classList.add('reveal-pending');
        (el as HTMLElement).style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
        io.observe(el);
      } else {
        markRevealed(el);
      }
    });
  });
}
