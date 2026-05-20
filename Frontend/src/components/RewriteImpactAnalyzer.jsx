import { useEffect, useState } from 'react';
import {
  AlertCircle,
  GitBranch,
  Lightbulb,
  ListOrdered,
  PenLine,
  Search,
} from 'lucide-react';
import { REWRITE_ACTIONS, analyzeRewriteImpact } from '../utils/storyParser';

const RISK_STYLES = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function RewriteImpactAnalyzer({
  storyText,
  characters,
  hasResults,
}) {
  const [action, setAction] = useState('remove_character');
  const [character, setCharacter] = useState('');
  const [impact, setImpact] = useState(null);

  const characterOptions = characters?.length ? characters : [];

  useEffect(() => {
    if (!characters?.length) {
      setCharacter('');
      setImpact(null);
      return;
    }
    setCharacter((prev) =>
      prev && characters.some((c) => c.name === prev) ? prev : characters[0].name,
    );
  }, [characters]);

  const handleAnalyze = () => {
    if (!storyText || !character) return;
    const result = analyzeRewriteImpact(storyText, character, action);
    setImpact(result);
  };

  const disabled = !hasResults || !storyText || !character;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rewrite Impact Analyzer</h2>
          <p className="mt-1 text-slate-500">
            Simulate character rewrites and assess continuity impact
          </p>
        </div>
        <PenLine className="hidden h-8 w-8 text-brand-200 sm:block" strokeWidth={1.5} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">Rewrite action</span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            disabled={!hasResults}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          >
            {Object.entries(REWRITE_ACTIONS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-600">Character</span>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            disabled={!hasResults || characterOptions.length === 0}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          >
            <option value="">Select character…</option>
            {characterOptions.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            Analyze Impact
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ImpactCard icon={ListOrdered} title="Affected Episodes">
          {impact?.affectedEpisodes?.length ? (
            <ul className="flex flex-wrap gap-2">
              {impact.affectedEpisodes.map((ep) => (
                <li
                  key={ep}
                  className="rounded-xl bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
                >
                  Episode {ep}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              {impact ? 'No episodes reference this character.' : 'Run impact analysis to see results.'}
            </p>
          )}
        </ImpactCard>

        <ImpactCard icon={AlertCircle} title="Continuity Risk">
          {impact ? (
            <span
              className={`inline-flex rounded-xl border px-3 py-1.5 text-sm font-semibold capitalize ${RISK_STYLES[impact.continuityRisk] || RISK_STYLES.low}`}
            >
              {impact.continuityRisk}
            </span>
          ) : (
            <p className="text-sm text-slate-400">—</p>
          )}
        </ImpactCard>

        <ImpactCard icon={GitBranch} title="Broken Relationships">
          {impact?.brokenRelationships?.length ? (
            <ul className="space-y-1.5">
              {impact.brokenRelationships.map((name) => (
                <li key={name} className="text-sm font-medium text-slate-700">
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              {impact ? 'No co-appearing characters detected.' : '—'}
            </p>
          )}
        </ImpactCard>

        <ImpactCard icon={Lightbulb} title="Rewrite Suggestions">
          {impact?.suggestions?.length ? (
            <ul className="space-y-2">
              {impact.suggestions.map((s) => (
                <li key={s} className="text-sm leading-relaxed text-slate-600">
                  • {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">—</p>
          )}
        </ImpactCard>
      </div>
    </section>
  );
}

function ImpactCard({ icon: Icon, title, children }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition hover:bg-white hover:shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </article>
  );
}
