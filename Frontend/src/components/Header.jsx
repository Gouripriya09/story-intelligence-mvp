import { HelpCircle } from 'lucide-react';

export default function Header({ onHowItWorks }) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
          Story Intelligence Analyzer
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-500 sm:text-xl">
          AI-Powered Story Analytics for Adaptation &amp; Rewrite Insights
        </p>
      </div>

      <button
        type="button"
        onClick={onHowItWorks}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
      >
        <HelpCircle className="h-4 w-4 text-brand-600" strokeWidth={2} />
        How it works
      </button>
    </header>
  );
}
