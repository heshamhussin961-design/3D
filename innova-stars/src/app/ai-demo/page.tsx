'use client';

import { useState } from 'react';

import { PromptInputBox } from '@/components/ui/ai-prompt-box';

export default function AiPromptDemoPage(): JSX.Element {
  const [reply, setReply] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSend(message: string): Promise<void> {
    setLoading(true);
    setError('');
    setReply('');
    try {
      const res = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reply?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      setReply(data.reply ?? '');
    } catch {
      setError('Network error. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)',
      }}
    >
      <div className="w-full max-w-2xl py-16">
        <div className="mb-6 text-center">
          <p className="font-orbitron text-[11px] font-semibold uppercase tracking-[0.3em] text-black/70">
            AI Demo
          </p>
          <h1 className="mt-2 font-orbitron text-3xl font-bold text-black md:text-4xl">
            Try the Intelligence Core
          </h1>
        </div>

        <PromptInputBox
          onSend={(message) => {
            void handleSend(message);
          }}
          isLoading={loading}
        />

        {error ? (
          <div className="mt-6 border border-red-400/50 bg-red-50/50 p-4 font-inter text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {reply ? (
          <div className="mt-6 border border-black/20 bg-white/40 p-5 font-inter text-sm leading-relaxed text-black/85 backdrop-blur-md">
            <p className="mb-2 font-orbitron text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
              Reply
            </p>
            <div className="whitespace-pre-wrap">{reply}</div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
