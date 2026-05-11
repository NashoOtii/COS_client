import { useState } from 'react'
import api from '../../../api/axios'

export default function CycleOverview({ activeCycle, summary, onCycleCreated }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', startDate: '',
    weeklyContributionAmount: '', maxLoanAmount: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/cycles', {
        ...form,
        weeklyContributionAmount: parseFloat(form.weeklyContributionAmount),
        maxLoanAmount: parseFloat(form.maxLoanAmount),
      })
      setShowForm(false)
      onCycleCreated()
    } catch (err) {
      setError(err.response?.data || 'Failed to create cycle.')
    } finally {
      setLoading(false)
    }
  }

  const statCards = summary ? [
    { label: 'Total Contributions', value: summary.totalContributions,
      color: 'text-green-400', icon: '💰' },
    { label: 'Loans Issued', value: summary.totalLoansIssued,
      color: 'text-amber-400', icon: '🏦' },
    { label: 'Interest Earned', value: summary.totalInterestEarned,
      color: 'text-blue-400', icon: '📈' },
    { label: 'Penalties Collected', value: summary.totalPenaltiesCollected,
      color: 'text-purple-400', icon: '⚠️' },
    { label: 'Pool Balance', value: summary.poolBalance,
      color: 'text-green-400', icon: '🏆' },
  ] : []

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Cycle Overview</h2>
        {!activeCycle && (
          <button onClick={() => setShowForm(!showForm)}
            className="btn-primary">
            {showForm ? 'Cancel' : '+ New Cycle'}
          </button>
        )}
      </div>

      {/* Create Cycle Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-base font-semibold mb-4">Create New Cycle</h3>
          {error && (
            <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 
              border border-red-500/20 rounded-lg">
              {error}
            </p>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Cycle Name</label>
                <input type="text" placeholder="e.g. Cycle 4 - Sept 2026"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input type="date" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="label">Weekly Contribution (KES)</label>
                <input type="number" placeholder="500"
                  value={form.weeklyContributionAmount}
                  onChange={e => setForm({
                    ...form, weeklyContributionAmount: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="label">Max Loan Amount (KES)</label>
                <input type="number" placeholder="10000"
                  value={form.maxLoanAmount}
                  onChange={e => setForm({ ...form, maxLoanAmount: e.target.value })}
                  className="input-field" required />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating...' : 'Create Cycle'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 
          gap-4 mb-6">
          {statCards.map(card => (
            <div key={card.label} className="stat-card">
              <p className="text-xl mb-2">{card.icon}</p>
              <p className="text-xs text-slate-400 mb-1">{card.label}</p>
              <p className={`text-lg font-bold ${card.color}`}>
                KES {card.value?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : activeCycle ? (
        <p className="text-slate-400 text-sm">Loading summary...</p>
      ) : (
        <div className="card text-center py-12">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-white font-semibold mb-2">No active cycle</p>
          <p className="text-slate-400 text-sm">
            Create a cycle to start tracking contributions.
          </p>
        </div>
      )}

      {/* Cycle Info */}
      {activeCycle && (
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-400 uppercase 
            tracking-wider mb-4">
            Cycle Settings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Cycle Name', value: activeCycle.name },
              { label: 'Weekly Contribution',
                value: `KES ${activeCycle.weeklyContributionAmount?.toLocaleString()}` },
              { label: 'Max Loan Amount',
                value: `KES ${activeCycle.maxLoanAmount?.toLocaleString()}` },
              { label: 'Started',
                value: new Date(activeCycle.startDate).toLocaleDateString() },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}