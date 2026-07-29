// Fade the nav wordmark in once the hero wordmark has scrolled past.
// Essay pages pin the wordmark with `data-wordmark-fixed` + a permanent
// `.is-scrolled` class, so the listener only runs on the homepage.
const nav = document.querySelector('.nav');
if (nav && !nav.hasAttribute('data-wordmark-fixed')) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 220);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
