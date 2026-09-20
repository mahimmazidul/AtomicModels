// Registers the service worker. Works from the site root and from the
// pre-rendered /elements/ and /models/ subpages by computing the relative path.

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const proto = location.protocol;
  if (proto !== 'http:' && proto !== 'https:') return; // no SW on file://
  const path = location.pathname;
  let swPath = 'sw.js';
  if (/(^|\/)(elements|models)\//.test(path)) swPath = '../sw.js';
  const register = () => navigator.serviceWorker.register(swPath).catch((err) => {
    console.warn('Service worker registration failed:', err);
  });
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register);
}
