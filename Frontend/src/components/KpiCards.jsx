import { Activity, AlertTriangle, Clapperboard, Gauge } from 'lucide-react';

const KPI_CONFIG = [
  {
    key: 'pacing_score',
    label: 'Pacing Score',
    icon: Gauge,
    accent: 'from-violet-500 to-brand-600',
    dot: 'bg-brand-600',
    format: (v) => (typeof v === 'number' ? v : '—'),
    suffix: (v) => (typeof v === 'number' ? '/100' : ''),
  },
  {
    key: 'adaptation_readiness',
    label: 'Adaptation Readiness',
    icon: Clapperboard,
    accent: 'from-emerald-400 to-teal-500',
    dot: 'bg-emerald-500',
    format: (v) => v ?? '—',
    suffix: () => '',
  },
  {
    key: 'cliffhanger_density',
    label: 'Cliffhanger Density',
    icon: Activity,
    accent: 'from-amber-400 to-orange-500',
    dot: 'bg-amber-500',
    format: (v) => v ?? '—',
    suffix: () => '',
  },
  {
    key: 'retention_risk',
    label: 'Retention Risk',
    icon: AlertTriangle,
    accent: 'from-rose-400 to-pink-500',
    dot: 'bg-rose-500',
    format: (v) => v ?? '—',
    suffix: () => '',
  },
];

export default function KpiCards({ analysis, hasResults }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPI_CONFIG.map(({ key, label, icon: Icon, accent, dot, format, suffix }) => {
        const raw = analysis?.[key];
        const display = hasResults ? format(raw) : '—';
        const extra = hasResults ? suffix(raw) : '';

        return (
          <article
            key={key}
            className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-2xl bg-gradient-to-br ${accent} p-2.5 shadow-sm`}>
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className={`mt-1 h-2 w-2 rounded-full ${dot}`} />
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {display}
              {extra && (
                <span className="ml-1 text-lg font-semibold text-slate-400">{extra}</span>
              )}
            </p>
            {!hasResults && (
              <p className="mt-2 text-xs text-slate-400">Upload & analyze to populate</p>
            )}
          </article>
        );
      })}
    </section>
  );
}
