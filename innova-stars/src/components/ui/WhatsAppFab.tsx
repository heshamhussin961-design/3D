import { SITE_CONFIG } from '@/lib/constants';

/**
 * Floating WhatsApp call-to-action. Pinned bottom-right, always reachable.
 */
export function WhatsAppFab(): JSX.Element {
  return (
    <a
      href={SITE_CONFIG.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Innova Stars on WhatsApp"
      className="group fixed bottom-6 left-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_32px_rgba(37,211,102,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.05 4.91A10 10 0 0 0 4.5 18.46L3 22l3.62-1.47a10 10 0 0 0 4.78 1.22h.01a10 10 0 0 0 7.64-16.84zM12.41 20.1h-.01a8.32 8.32 0 0 1-4.24-1.16l-.3-.18-2.15.87.91-2.1-.2-.32a8.32 8.32 0 1 1 5.99 2.89zm4.78-6.22c-.26-.13-1.55-.77-1.79-.85s-.42-.13-.59.13-.68.85-.83 1.03-.31.19-.57.06a6.81 6.81 0 0 1-2-1.24 7.55 7.55 0 0 1-1.39-1.73c-.15-.26 0-.4.11-.52s.26-.31.39-.46a1.69 1.69 0 0 0 .26-.43.48.48 0 0 0 0-.46c-.06-.13-.59-1.42-.81-1.94s-.43-.44-.59-.45h-.5a.96.96 0 0 0-.7.32 2.92 2.92 0 0 0-.91 2.18 5.06 5.06 0 0 0 1.07 2.69 11.62 11.62 0 0 0 4.45 3.94 14.95 14.95 0 0 0 1.49.55 3.58 3.58 0 0 0 1.65.1 2.7 2.7 0 0 0 1.77-1.25 2.19 2.19 0 0 0 .15-1.25c-.06-.11-.23-.17-.49-.3z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-black/80 px-3 py-1.5 font-orbitron text-xs uppercase tracking-[0.18em] text-gold backdrop-blur-md md:group-hover:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}

export default WhatsAppFab;
