import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = '(prefers-reduced-motion: reduce)';
const prefersReduced = matchMedia(REDUCED).matches;
const isTouch = matchMedia('(pointer: coarse)').matches;

const NAV_OFFSET = 80; // keep in sync with `scroll-padding-top: 5rem` in global.css

function initLenis(): Lenis | null {
  if (prefersReduced || isTouch) return null;
  const lenis = new Lenis({ smoothWheel: false }); // native wheel/trackpad (no added latency); scrollTo stays eased
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Same-page anchors (hrefs are base-prefixed like /portfolio/#apps, so handle them ourselves)
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#main') return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -NAV_OFFSET });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.pushState(null, '', url.hash);
  });
  return lenis;
}

function initReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function initTyping() {
  const el = document.querySelector<HTMLElement>('[data-typing]');
  if (!el) return;
  const text = el.textContent ?? '';
  el.textContent = '';
  el.style.visibility = 'visible';
  let i = 0;
  const id = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(id);
  }, 90);
}

function initHeroCycle() {
  const imgs = document.querySelectorAll<HTMLImageElement>('[data-hero-phone] [data-phone] img');
  if (imgs.length < 2) return;
  let active = 0;
  setInterval(() => {
    if (document.hidden) return;
    imgs[active].style.opacity = '0';
    active = (active + 1) % imgs.length;
    imgs[active].style.opacity = '1';
  }, 3200);
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const docTop = (el: HTMLElement) => {
  let top = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop; // ignores transforms
  return top;
};

/** Proximity snap: after wheel input settles, ease to the nearest item if within 30% of a viewport of it. */
function createShowcaseSnap(lenis: Lenis, items: HTMLElement[]) {
  let stopped = false;
  let timer: number | undefined;
  const settle = () => {
    timer = undefined;
    if (stopped) return;
    const y = lenis.scroll; // current position: native wheel already applied
    let target = NaN;
    for (const el of items) {
      const t = Math.ceil(docTop(el));
      if (isNaN(target) || Math.abs(t - y) < Math.abs(target - y)) target = t;
    }
    const d = Math.abs(target - y);
    if (d > 1 && d <= 0.3 * innerHeight) lenis.scrollTo(target, { duration: 0.45, easing: easeOutCubic });
  };
  const onInput = ({ event }: { event: Event }) => {
    clearTimeout(timer);
    if (event.type.includes('touch')) return;
    timer = window.setTimeout(settle, 100);
  };
  lenis.on('virtual-scroll', onInput);
  return {
    stop: () => { stopped = true; clearTimeout(timer); },
    start: () => { stopped = false; },
    destroy: () => { lenis.off('virtual-scroll', onInput); clearTimeout(timer); },
  };
}

function initShowcase(lenis: Lenis | null) {
  const section = document.querySelector<HTMLElement>('[data-showcase]');
  if (!section) return;
  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-showcase-list] > li'));
  const stage = Array.from(section.querySelectorAll<HTMLElement>('[data-stage-phone]'));
  const rail = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-rail-index]'));
  let programmatic = false;

  const setActive = (i: number) => {
    stage.forEach((p, j) => {
      p.style.opacity = j === i ? '1' : '0';
      p.style.transform = j === i ? 'translateY(0)' : `translateY(${j < i ? -24 : 24}px)`;
    });
    rail.forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
  };

  const mm = gsap.matchMedia();
  mm.add(`(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, () => {
    section.classList.add('showcase--enhanced');
    setActive(0);
    const triggers = items.map((item, i) =>
      ScrollTrigger.create({
        trigger: item, start: 'top center', end: 'bottom center',
        onToggle: (self) => self.isActive && !programmatic && setActive(i),
      }),
    );
    const inView = ScrollTrigger.create({
      trigger: section, start: 'top center', end: 'bottom center',
      onToggle: (self) => section.classList.toggle('showcase--in-view', self.isActive),
    });
    const snap = lenis ? createShowcaseSnap(lenis, items) : null;
    const onRail = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.railIndex);
      const target = items[i];
      programmatic = true;
      snap?.stop();
      setActive(i);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        programmatic = false;
        snap?.start();
        setActive(i);
      };
      if (lenis) lenis.scrollTo(target, { offset: 0, onComplete: finish });
      else {
        addEventListener('scrollend', finish, { once: true });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(finish, lenis ? 2500 : 1000);
    };
    rail.forEach((b) => b.addEventListener('click', onRail));
    ScrollTrigger.refresh();
    return () => {
      triggers.forEach((t) => t.kill());
      inView.kill();
      snap?.destroy();
      rail.forEach((b) => b.removeEventListener('click', onRail));
      section.classList.remove('showcase--enhanced', 'showcase--in-view');
      programmatic = false;
    };
  });
}

if (!prefersReduced) {
  clearTimeout((window as unknown as { __motionFallback?: number }).__motionFallback);
  const lenis = initLenis();
  initReveals();
  initTyping();
  initHeroCycle();
  initShowcase(lenis);
  addEventListener('load', () => ScrollTrigger.refresh());
}
