/**
 * Arms the scroll-reveal animations, as an inline <head> script so it runs
 * before first paint.
 *
 * The ordering matters. The CSS that hides un-revealed content is scoped under
 * `html[data-reveal="on"]`, and nothing sets that attribute except this script.
 * So the page is authored visible and only becomes animatable once we have
 * confirmed we can animate it. Every failure mode — no IntersectionObserver,
 * JavaScript disabled or blocked, the bundle 404ing, a crash before hydration —
 * leaves the attribute unset and the content plainly readable. Doing it the
 * other way round (hide in CSS, reveal in JS) means one broken script turns the
 * marketing site into a blank page, which is exactly the failure this ordering
 * rules out.
 *
 * It also opts out entirely under prefers-reduced-motion rather than animating
 * faster: someone who asks for no motion should get none, and the CSS carries
 * the same guard in case the preference changes mid-session.
 *
 * The timer is the last line of defence. If React never hydrates, no Reveal
 * ever mounts to clear it, and after a few seconds the attribute is dropped and
 * everything appears. `Reveal` clears it on its first mount, so on a healthy
 * page the timer never fires.
 */
const source = `(function () {
  try {
    if (!('IntersectionObserver' in window)) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced && reduced.matches) return;

    var root = document.documentElement;
    root.setAttribute('data-reveal', 'on');

    window.__srRevealFallback = window.setTimeout(function () {
      root.removeAttribute('data-reveal');
    }, 5000);
  } catch (e) {
    /* Never let this script be the reason a page fails to render. */
  }
})();`;

export const revealGate = { __html: source };
