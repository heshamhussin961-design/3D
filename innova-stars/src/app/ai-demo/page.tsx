'use client';

import { PromptInputBox } from '@/components/ui/ai-prompt-box';

export default function AiPromptDemoPage(): JSX.Element {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)',
      }}
    >
      <div className="w-[500px] max-w-full p-4">
        <PromptInputBox
          onSend={(message, files) => console.log(message, files)}
        />
      </div>
    </main>
  );
}
