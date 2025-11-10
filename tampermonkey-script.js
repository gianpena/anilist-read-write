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

  function injectButton() {
    const btn = document.createElement('button');
    btn.id = 'anilist-dummy-btn';
    btn.textContent = 'Mark as watched on Anilist';
    btn.style.marginLeft = '10px';
    btn.onclick = function() {
      const originalText = btn.textContent;
      btn.textContent = 'Marked as watched!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
      console.log('Dummy script executed!');
    };
    const info = document.querySelector('div.info');
    if (info) {
      const title = info.querySelector('h1.title.d-title');
      if (title && title.nextSibling) {
        info.insertBefore(btn, title.nextSibling);
      } else if (title) {
        info.appendChild(btn);
      } else {
        info.appendChild(btn);
      }
    } else {
      document.body.appendChild(btn);
    }
  }

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

  injectButton();

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.attributeName === 'class') { scheduleCheck(); break; }
      if (m.type === 'childList') { scheduleCheck(); break; }
    }
  });
})();