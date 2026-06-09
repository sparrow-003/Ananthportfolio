import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeLogger } from './utils/logger'

document.documentElement.classList.add('js-enhanced');

// Initialize client-side ring-buffered logging telemetry
initializeLogger();

const shouldUseAppServiceWorker = () => {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return false;

  const { hostname } = window.location;
  const search = new URLSearchParams(window.location.search);
  const isPreviewHost =
    window.self !== window.top ||
    hostname.startsWith('id-preview--') ||
    hostname.startsWith('preview--') ||
    hostname === 'lovableproject.com' ||
    hostname.endsWith('.lovableproject.com') ||
    hostname === 'lovableproject-dev.com' ||
    hostname.endsWith('.lovableproject-dev.com') ||
    hostname === 'beta.lovable.dev' ||
    hostname.endsWith('.beta.lovable.dev');

  return !isPreviewHost && search.get('sw') !== 'off';
};

const cleanupAppServiceWorkers = async () => {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) => registration.active?.scriptURL?.endsWith('/sw.js'))
      .map((registration) => registration.unregister())
  );
};

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  createRoot(newRoot).render(<App />);
}

if (shouldUseAppServiceWorker()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('[Service Worker] Registered successfully with scope:', reg.scope))
      .catch((err) => console.error('[Service Worker] Registration failed:', err));
  });
} else {
  cleanupAppServiceWorkers().catch(() => undefined);
}
