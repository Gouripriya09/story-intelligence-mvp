import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-soft">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-brand-700">{payload[0].value}</p>
    </div>
  );
}

export default function ChartsSection({ emotionalData, characterData, hasResults }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-2.5">
            <LineChartIcon className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Emotional Intensity Over Episodes
            </h3>
            <p className="text-sm text-slate-500">Derived from episode narrative signals</p>
          </div>
        </div>
        <div className="h-72 w-full">
          {hasResults && emotionalData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionalData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="episode"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ fill: '#7c3aed', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#6d28d9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Analyze a story to view emotional intensity trends" />
          )}
        </div>
      </article>

      <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-2.5">
            <BarChart3 className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Character Appearance Frequency
            </h3>
            <p className="text-sm text-slate-500">From AI character extraction</p>
          </div>
        </div>
        <div className="h-72 w-full">
          {hasResults && characterData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={characterData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={characterData.length > 4 ? -25 : 0}
                  textAnchor={characterData.length > 4 ? 'end' : 'middle'}
                  height={characterData.length > 4 ? 50 : 30}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="frequency" fill="#7c3aed" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Character frequency appears after analysis" />
          )}
        </div>
      </article>
    </section>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}
