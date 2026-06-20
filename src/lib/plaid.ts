// Loads Plaid Link from the CDN on demand and resolves with the global Plaid
// factory. We load it lazily (only on the verify-bank page) so it never blocks
// initial page loads or hurts Core Web Vitals elsewhere.

const PLAID_SRC = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

interface PlaidHandler {
  open: () => void;
  exit: () => void;
}

interface PlaidFactory {
  create: (config: {
    token: string;
    onSuccess: (publicToken: string, metadata: { institution?: { name?: string } }) => void;
    onExit: (err: unknown) => void;
  }) => PlaidHandler;
}

declare global {
  interface Window {
    Plaid?: PlaidFactory;
  }
}

export function loadPlaid(): Promise<PlaidFactory> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Plaid can only load in the browser.'));
      return;
    }
    if (window.Plaid) {
      resolve(window.Plaid);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PLAID_SRC}"]`);
    const onReady = () => (window.Plaid ? resolve(window.Plaid) : reject(new Error('Plaid failed to initialize.')));
    if (existing) {
      existing.addEventListener('load', onReady);
      existing.addEventListener('error', () => reject(new Error('Failed to load Plaid.')));
      return;
    }
    const script = document.createElement('script');
    script.src = PLAID_SRC;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error('Failed to load Plaid.'));
    document.head.appendChild(script);
  });
}
