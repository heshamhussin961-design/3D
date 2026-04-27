'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { cn } from '@/lib/utils/cn';

interface NewsletterFormProps {
  className?: string;
}

/**
 * Compact email-only newsletter signup. Posts to `/api/newsletter`.
 * Two visible states: input + button, or a success badge after submit.
 */
export function NewsletterForm({ className }: NewsletterFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>(
    'idle',
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('error');
      setError('Network error. Please retry.');
    }
  }

  if (status === 'ok') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 font-inter text-sm text-gold',
          className,
        )}
      >
        <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
        <span>Subscribed. Watch for our launch update.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-2', className)}
      aria-label="Subscribe to newsletter"
    >
      <div className="flex w-full max-w-sm items-stretch border border-gold/20 bg-black/40 transition-colors duration-200 focus-within:border-gold/60">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          placeholder="you@company.com"
          className="flex-1 bg-transparent px-3 py-2.5 font-inter text-sm text-white outline-none placeholder:text-white/30"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe"
          className="flex items-center justify-center bg-gold px-4 text-black transition-opacity hover:bg-gold-light disabled:opacity-60"
        >
          <Send className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      {error ? (
        <p className="font-inter text-xs text-red-400">{error}</p>
      ) : (
        <p className="font-inter text-xs text-white/40">
          Monthly insights. No spam, ever.
        </p>
      )}
    </form>
  );
}

export default NewsletterForm;
