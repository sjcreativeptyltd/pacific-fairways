// Ambient cursor halo — a soft accent-colored glow that eases toward the
// pointer, desktop + fine-pointer only. Purely decorative chrome, reusable
// by any client build (color comes from --color-accent). Call once from
// BaseLayout.astro on the client.
export function initCursorHalo() {
  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduceMotion || !canHover) return;

  const halo = document.createElement('div');
  halo.className = 'cursor-halo';
  halo.setAttribute('aria-hidden', 'true');
  document.body.appendChild(halo);

  let targetX = 0,
    targetY = 0,
    curX = 0,
    curY = 0,
    started = false;

  document.addEventListener(
    'mousemove',
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started) {
        curX = targetX;
        curY = targetY;
        halo.classList.add('is-active');
        started = true;
      }
    },
    { passive: true },
  );

  document.addEventListener('mouseleave', () => halo.classList.remove('is-active'));
  document.addEventListener('mouseenter', () => {
    if (started) halo.classList.add('is-active');
  });

  function tick() {
    // Ease toward the pointer rather than snapping to it — the lag is the whole effect.
    curX += (targetX - curX) * 0.085;
    curY += (targetY - curY) * 0.085;
    halo.style.transform = `translate(${curX}px,${curY}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const hoverTargets = document.querySelectorAll('a, button, summary, input, textarea, .lot-rect');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => halo.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => halo.classList.remove('is-hover'));
  });
}
