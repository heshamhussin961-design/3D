'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

/**
 * Underlined textarea matching the `Input` styling.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, required, className, rows = 4, ...props }, ref) => {
    const textareaId = id ?? props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={textareaId}
          className="font-inter text-xs font-medium uppercase tracking-[0.15em] text-gold"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-gold-light">
              *
            </span>
          ) : null}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'resize-none border-0 border-b border-white/30 bg-transparent px-0 py-3 font-inter text-base text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-gold focus:shadow-[0_1px_0_0_rgba(212,175,55,0.6)]',
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
Textarea.displayName = 'Textarea';

export default Textarea;
