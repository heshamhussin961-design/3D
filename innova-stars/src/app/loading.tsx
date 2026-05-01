/**
 * Global loading state shown by Next while a server component is rendering.
 * Same visual language as the rest of the app.
 */
export default function Loading(): JSX.Element {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="h-12 w-12 animate-spin text-gold"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.2"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-gold">
          Loading
        </p>
      </div>
    </div>
  );
}
