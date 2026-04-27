'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Underlined, transparent input used inside the ContactModal. The label
 * lives above the field (not floating) so the form stays readable against
 * the deep-space background.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, required, className, ...props }, ref) => {
    const inputId = id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-inter text-xs font-medium uppercase tracking-[0.15em] text-gold"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-gold-light">
              *
            </span>
          ) : null}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'border-0 border-b border-white/30 bg-transparent px-0 py-3 font-inter text-base text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-gold focus:shadow-[0_1px_0_0_rgba(212,175,55,0.6)]',
            error && 'border-red-400/70 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="font-inter text-xs text-red-400">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export default Input;
