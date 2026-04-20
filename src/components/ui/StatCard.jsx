export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`stat-card ${accent ? 'border-brand-500/40' : ''}`}>
      <p className="label">{label}</p>
      <p className={`font-display font-bold text-3xl tracking-wider ${accent ? 'text-brand-400 glow-text' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-dark-300 font-body mt-1">{sub}</p>}
    </div>
  )
}
