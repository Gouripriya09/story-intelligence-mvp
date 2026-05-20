import { useRef } from 'react';
import { FileText, Loader2, Sparkles, Upload } from 'lucide-react';

export default function UploadSection({
  file,
  onFileChange,
  onAnalyze,
  isAnalyzing,
  error,
}) {
  const inputRef = useRef(null);

  const handleChoose = () => inputRef.current?.click();

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8 lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-1 flex-col gap-4 lg:max-w-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50">
            <Upload className="h-7 w-7 text-brand-600" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Upload your story</h2>
            <p className="mt-2 text-slate-500">
              Supported formats: <span className="font-medium text-slate-700">.txt</span>
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-6">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 transition hover:border-brand-200 hover:bg-brand-50/30">
            <FileText className="h-10 w-10 text-brand-500/70" strokeWidth={1.5} />
            <p className="mt-4 text-center text-sm font-medium text-slate-700">
              {file ? file.name : 'No file selected'}
            </p>
            {file && (
              <p className="mt-1 text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleChoose}
              disabled={isAnalyzing}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
            >
              Choose File
            </button>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!file || isAnalyzing}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-brand-700 hover:to-brand-600 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Story
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
