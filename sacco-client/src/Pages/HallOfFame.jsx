import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function HallOfFame() {
  const [cycles, setCycles] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetchArchivedCycles()
  }, [])

  const fetchArchivedCycles = async () => {
    try {
      const { data } = await api.get('/cycles')
      const archived = data.filter(c => c.status === 'Archived')
      setCycles(archived)

      // Fetch summary for each archived cycle
      const summaryResults = {}
      await Promise.all(
        archived.map(async (cycle) => {
          try {
            const { data: sum } = await api.get(`/cycles/${cycle.id}/summary`)
            summaryResults[cycle.id] = sum
          } catch {
            summaryResults[cycle.id] = null
          }
        })
      )
      setSummaries(summaryResults)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id) => setExpanded(expanded === id ? null : id)

  if (loading) return (
    <p style={{ color: '#94a3b8' }}>Loading Hall of Fame...</p>
  )

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 0.5rem' }}>🏆 Hall of Fame</h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
          A record of every completed cycle — the foundation this group was built on.
        </p>
      </div>

      {cycles.length === 0 ? (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          padding: '3rem', textAlign: 'center',
          border: '1px solid #334155', color: '#94a3b8'
        }}>
          <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>🏛️</p>
          <p style={{ margin: '0 0 0.5rem', color: 'white', fontWeight: '600' }}>
            No archived cycles yet
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Completed cycles will appear here once they are closed and archived.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cycles.map((cycle, index) => {
            const sum = summaries[cycle.id]
            const isOpen = expanded === cycle.id
            const cycleNumber = cycles.length - index

            return (
              <div key={cycle.id} style={{
                background: '#1e293b', borderRadius: '12px',
                border: '1px solid #334155', overflow: 'hidden'
              }}>
                {/* Cycle Header — always visible */}
                <div
                  onClick={() => toggle(cycle.id)}
                  style={{
                    padding: '1.25rem 1.5rem', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isOpen ? '#0f172a' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Medal */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.25rem',
                      background: index === 0 ? '#854d0e' :
                        index === 1 ? '#475569' :
                        index === 2 ? '#78350f' : '#1e3a5f'
                    }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' :
                        index === 2 ? '🥉' : '🏅'}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>
                        {cycle.name}
                      </h3>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
                        {new Date(cycle.startDate).toLocaleDateString()} —{' '}
                        {cycle.endDate
                          ? new Date(cycle.endDate).toLocaleDateString()
                          : 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Quick stats */}
                    {sum && (
                      <div style={{
                        display: 'flex', gap: '1.5rem',
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                            Pool
                          </p>
                          <p style={{ margin: 0, color: '#4ade80', fontWeight: '600' }}>
                            KES {sum.totalContributions?.toLocaleString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                            Interest
                          </p>
                          <p style={{ margin: 0, color: '#60a5fa', fontWeight: '600' }}>
                            KES {sum.totalInterestEarned?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <span style={{ color: '#475569', fontSize: '1.25rem' }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isOpen && sum && (
                  <div style={{
                    padding: '1.5rem', borderTop: '1px solid #334155'
                  }}>
                    {/* Full Stats Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem', marginBottom: '1.5rem'
                    }}>
                      {[
                        { label: 'Total Contributions',
                          value: `KES ${sum.totalContributions?.toLocaleString()}`,
                          color: '#4ade80', icon: '💰' },
                        { label: 'Loans Issued',
                          value: `KES ${sum.totalLoansIssued?.toLocaleString()}`,
                          color: '#f59e0b', icon: '🏦' },
                        { label: 'Interest Earned',
                          value: `KES ${sum.totalInterestEarned?.toLocaleString()}`,
                          color: '#60a5fa', icon: '📈' },
                        { label: 'Penalties Collected',
                          value: `KES ${sum.totalPenaltiesCollected?.toLocaleString()}`,
                          color: '#a855f7', icon: '⚠️' },
                        { label: 'Final Pool Balance',
                          value: `KES ${sum.poolBalance?.toLocaleString()}`,
                          color: '#4ade80', icon: '🏆' },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          background: '#0f172a', borderRadius: '10px',
                          padding: '1rem', border: '1px solid #334155'
                        }}>
                          <p style={{ margin: '0 0 0.25rem',
                            fontSize: '1.25rem' }}>
                            {stat.icon}
                          </p>
                          <p style={{ margin: '0 0 0.25rem',
                            color: '#64748b', fontSize: '0.75rem' }}>
                            {stat.label}
                          </p>
                          <p style={{ margin: 0, fontWeight: '700',
                            color: stat.color, fontSize: '1rem' }}>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Cycle settings reference */}
                    <div style={{
                      background: '#0f172a', borderRadius: '10px',
                      padding: '1rem', border: '1px solid #334155',
                      display: 'flex', gap: '2rem', flexWrap: 'wrap'
                    }}>
                      <div>
                        <p style={{ margin: '0 0 0.25rem',
                          color: '#64748b', fontSize: '0.75rem' }}>
                          Weekly Contribution
                        </p>
                        <p style={{ margin: 0, fontWeight: '600' }}>
                          KES {cycle.weeklyContributionAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.25rem',
                          color: '#64748b', fontSize: '0.75rem' }}>
                          Max Loan Amount
                        </p>
                        <p style={{ margin: 0, fontWeight: '600' }}>
                          KES {cycle.maxLoanAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 0.25rem',
                          color: '#64748b', fontSize: '0.75rem' }}>
                          Status
                        </p>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '9999px',
                          fontSize: '0.75rem', fontWeight: '600',
                          background: '#1a3a2a', color: '#4ade80'
                        }}>
                          Archived ✓
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isOpen && !sum && (
                  <div style={{
                    padding: '1.5rem', borderTop: '1px solid #334155',
                    color: '#94a3b8', fontSize: '0.875rem'
                  }}>
                    Summary data unavailable for this cycle.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}