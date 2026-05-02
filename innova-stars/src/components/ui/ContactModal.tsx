'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Rocket, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils/cn';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  phone: string;
  message: string;
  /** Honeypot — kept blank for humans, bots fill it. */
  website: string;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  message?: string;
}

const INITIAL: FormValues = {
  name: '',
  phone: '',
  message: '',
  website: '',
};

// Loose phone validation — accepts +/digits/spaces/dashes/parens, 7–18 digits.
const PHONE_DIGITS_RE = /\d/g;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else {
    const digits = values.phone.match(PHONE_DIGITS_RE)?.length ?? 0;
    if (digits < 7 || digits > 18) {
      errors.phone = 'Please enter a valid phone number.';
    }
  }
  if (!values.message.trim())
    errors.message = 'Tell us a bit about your mission.';
  return errors;
}

/**
 * Contact modal triggered from the CTA and from the nav "Start Project"
 * button. Focus is trapped, ESC closes, and focus returns to the previously
 * active element on close.
 *
 * Submission is currently a mock (a simulated 1.2s delay + success state).
 * TODO: connect to a form service (Resend / Formspree / internal API route).
 */
export function ContactModal({
  open,
  onClose,
}: ContactModalProps): JSX.Element {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Remember focus, trap focus, block body scroll.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const raf = window.requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });

    function onKeydown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeydown);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  // Reset state when modal closes.
  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setValues(INITIAL);
        setErrors({});
        setSubmitted(false);
        setSubmitting(false);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErrors({
          message: data.error ?? 'Something went wrong. Please try again.',
        });
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ message: 'Network error. Check your connection and retry.' });
    } finally {
      setSubmitting(false);
    }
  }

  function update<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ): void {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl border border-gold/30 bg-deep-space p-8 shadow-[0_0_60px_rgba(212,175,55,0.15)] md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 p-2 text-white/70 transition-colors duration-200 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2
                  className="h-14 w-14 text-gold"
                  strokeWidth={1.5}
                />
                <h2
                  id={titleId}
                  className="font-orbitron text-2xl font-bold text-gold"
                >
                  Message received
                </h2>
                <p className="font-inter text-sm text-white/70">
                  We’ll reach out within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 bg-gold px-8 py-3 font-orbitron text-xs font-semibold uppercase tracking-[0.2em] text-black transition-transform duration-200 hover:scale-[1.03]"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2
                  id={titleId}
                  className="font-orbitron text-2xl font-bold text-gold md:text-3xl"
                >
                  Begin Your Mission
                </h2>
                <p className="mt-2 font-inter text-sm text-white/70">
                  Tell us about your vision.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 flex flex-col gap-6"
                >
                  {/* Honeypot — hidden from users, bots fill it and get
                      silently dropped on the server. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor="website-hp">
                      Leave this field empty
                      <input
                        id="website-hp"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={values.website}
                        onChange={(e) => update('website', e.target.value)}
                      />
                    </label>
                  </div>

                  <Input
                    ref={firstFieldRef}
                    name="name"
                    label="Name"
                    required
                    value={values.name}
                    error={errors.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                  <Input
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+971 ..."
                    required
                    value={values.phone}
                    error={errors.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />

                  <Textarea
                    name="message"
                    label="Message"
                    required
                    rows={4}
                    value={values.message}
                    error={errors.message}
                    onChange={(e) => update('message', e.target.value)}
                  />

                  <p className="font-inter text-[11px] leading-relaxed text-white/45">
                    By submitting this form, you agree to our{' '}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </a>
                    . We respond within 24 hours and never share your details.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      'inline-flex w-full items-center justify-center gap-3 bg-gold px-12 py-4 font-orbitron text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] disabled:cursor-not-allowed disabled:opacity-60',
                    )}
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
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
                            strokeOpacity="0.3"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Launching…
                      </>
                    ) : (
                      <>
                        Start Mission
                        <Rocket className="h-4 w-4" strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ContactModal;
