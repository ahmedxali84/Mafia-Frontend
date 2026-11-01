'use client';
import { useEffect } from 'react';

// `interactive-widget=resizes-content`: when the phone keyboard opens, the page shrinks above it, so
// the chat box stays visible. Safari doesn't know this key and logs a warning when it's in the page's
// viewport tag, so it's added here, after load, only on the other browsers (Safari already behaves
// this way on its own).
export default function KeyboardResize() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const webkitOnly = /iPhone|iPad|iPod/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua));
    const meta = document.querySelector('meta[name="viewport"]');
    if (webkitOnly || !meta || meta.content.includes('interactive-widget')) return;
    meta.content += ', interactive-widget=resizes-content';
  }, []);
  return null;
}
