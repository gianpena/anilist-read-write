// ==UserScript==
// @name         update-progress
// @namespace    http://tampermonkey.net/
// @version      2025-11-04
// @description  log current episode after navigation
// @match        https://www.aniwave.se/anime-watch/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

let episode = -1;
let title = '';

(function () {
  'use strict';

  let timer = null;
  const DELAY_MS = 3000;

  function scheduleCheck() {
    clearTimeout(timer);
    timer = setTimeout(readEpisode, DELAY_MS);
  }

  function readEpisode() {
    const ul = document.querySelector('ul.ep-range');
    if (!ul) { console.warn('ep-range not found'); return; }
    const a = ul.querySelector('a.active');
    const txt = (a?.textContent || '').trim();
    if (txt) {
        console.log(`CURRENT EPISODE: ${txt}`);
        episode = parseInt(txt);
    }
    else console.warn('Active episode not found (yet).');

    const info = document.querySelector('div.info');
    const titleComponent = info.querySelector('h1.title.d-title');
    title = titleComponent.textContent;

    console.log(`TITLE: ${title}`);

  }

  // 2) URL changes (SPA navigation)
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;
  history.pushState = function (...args) { const r = _pushState.apply(this, args); window.dispatchEvent(new Event('urlchange')); return r; };
  history.replaceState = function (...args) { const r = _replaceState.apply(this, args); window.dispatchEvent(new Event('urlchange')); return r; };
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
  window.addEventListener('urlchange', scheduleCheck);

  // 3) React to the active class changing
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.attributeName === 'class') { scheduleCheck(); break; }
      if (m.type === 'childList') { scheduleCheck(); break; }
    }
  });
})();