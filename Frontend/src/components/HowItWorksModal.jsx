import { X } from 'lucide-react';

export default function HowItWorksModal({ open, onClose }) {
  if (!open) return null;

  const steps = [
    'Upload your episodic story as a .txt file.',
    'Click Analyze Story to send it to the AI engine.',
    'Review KPI scores, charts, and character analytics.',
    'Use the Rewrite Impact Analyzer to plan character changes.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-lift">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-6 space-y-4">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {i + 1}
              </span>
              <p className="pt-1 text-slate-600">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
