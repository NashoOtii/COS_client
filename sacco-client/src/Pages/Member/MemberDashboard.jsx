import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import HallOfFame from '../HallOfFame'

export default function MemberDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [activeCycle, setActiveCycle] = useState(null)
  const [contributions, setContributions] = useState([])
  const [streak, setStreak] = useState(0)
  const [loans, setLoans] = useState([])
  const [investments, setInvestments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [loanForm, setLoanForm] = useState({ principal: '', repaymentWeeks: '' })
  const [loanMessage, setLoanMessage] = useState('')
  const [loanLoading, setLoanLoading] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const { data: cycle } = await api.get('/cycles/active')
      setActiveCycle(cycle)

      const { data: contribs } = await api.get(
        `/contributions/member/${user.memberId}`)
      setContributions(contribs)

      const { data: streakData } = await api.get(
        `/contributions/member/${user.memberId}/streak`)
      setStreak(streakData.currentStreak)

      const { data: myLoans } = await api.get(
        `/loans/member/${user.memberId}`)
      setLoans(myLoans)

      const { data: invData } = await api.get(
        `/investments/cycle/${cycle.id}`)
      setInvestments(invData)

      const { data: sum } = await api.get(`/cycles/${cycle.id}/summary`)
      setSummary(sum)
    } catch {
      // No active cycle is fine
    } finally {
      setLoading(false)
    }
  }

  const handleLoanRequest = async (e) => {
    e.preventDefault()
    setLoanMessage('')
    setLoanLoading(true)
    try {
      await api.post('/loans', {
        memberId: user.memberId,
        cycleId: activeCycle.id,
        principal: parseFloat(loanForm.principal),
        repaymentWeeks: parseInt(loanForm.repaymentWeeks),
      })
      setLoanForm({ principal: '', repaymentWeeks: '' })
      setShowLoanForm(false)
      setLoanMessage('Loan request submitted. Awaiting executive approval.')
      await fetchAll()
    } catch (err) {
      setLoanMessage(err.response?.data || 'Failed to submit loan request.')
    } finally {
      setLoanLoading(false)
    }
  }

  const totalContributed = contributions
    .filter(c => c.status === 'Paid')
    .reduce((sum, c) => sum + c.amount, 0)

  const activeLoan = loans.find(l =>
    l.status === 'Active' || l.status === 'Approved' || l.status === 'Pending')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contributions', label: 'Contributions' },
    { id: 'loans', label: 'My Loans' },
    { id: 'investments', label: 'Investments' },
    { id: 'hall-of-fame', label: '🏆 Hall of Fame' },
  ]

  const statusColor = (status) => {
    const map = {
      Pending: { bg: '#3b2800', color: '#fbbf24' },
      Approved: { bg: '#1a3a2a', color: '#4ade80' },
      Active: { bg: '#1e3a5f', color: '#60a5fa' },
      Repaid: { bg: '#1e293b', color: '#94a3b8' },
      Defaulted: { bg: '#3b1a1a', color: '#f87171' },
    }
    return map[status] || { bg: '#1e293b', color: '#94a3b8' }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#94a3b8'
    }}>
      Loading your dashboard...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>

      {/* Header */}
      <div style={{
        background: '#1e293b', borderBottom: '1px solid #334155',
        padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
            Circle of Support
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Member Dashboard
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            {user?.fullName}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem', background: '#dc2626',
              border: 'none', borderRadius: '6px',
              color: 'white', cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cycle Banner */}
      {activeCycle ? (
        <div style={{
          background: '#166534', padding: '0.75rem 2rem',
          fontSize: '0.875rem'
        }}>
          Active Cycle: <strong>{activeCycle.name}</strong> —
          Weekly contribution: <strong>
            KES {activeCycle.weeklyContributionAmount?.toLocaleString()}
          </strong>
        </div>
      ) : (
        <div style={{
          background: '#7f1d1d', padding: '0.75rem 2rem',
          fontSize: '0.875rem'
        }}>
          No active cycle at the moment.
        </div>
      )}

      {/* Tabs */}
      <div style={{
        background: '#1e293b', borderBottom: '1px solid #334155',
        padding: '0 2rem', display: 'flex'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem', border: 'none', cursor: 'pointer',
              background: 'transparent', fontSize: '0.875rem',
              color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
              borderBottom: activeTab === tab.id
                ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '2rem' }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginTop: 0 }}>
              Welcome back, {user?.fullName?.split(' ')[0]} 👋
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem', marginBottom: '2rem'
            }}>
              {[
                { label: 'Total Contributed',
                  value: `KES ${totalContributed.toLocaleString()}`,
                  color: '#4ade80' },
                { label: 'Payment Streak',
                  value: `${streak} week${streak !== 1 ? 's' : ''}`,
                  color: '#f59e0b' },
                { label: 'Active Loan',
                  value: activeLoan
                    ? `KES ${activeLoan.totalRepayable?.toLocaleString()}`
                    : 'None',
                  color: activeLoan ? '#60a5fa' : '#94a3b8' },
                { label: 'My Role', value: user?.role, color: '#a855f7' },
              ].map(card => (
                <div key={card.label} style={{
                  background: '#1e293b', borderRadius: '12px',
                  padding: '1.25rem', border: '1px solid #334155'
                }}>
                  <p style={{ margin: '0 0 0.5rem',
                    color: '#94a3b8', fontSize: '0.875rem' }}>
                    {card.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '1.375rem',
                    fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {summary && (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                padding: '1.5rem', border: '1px solid #334155',
                marginBottom: '2rem'
              }}>
                <h3 style={{ marginTop: 0, color: '#94a3b8',
                  fontSize: '0.875rem', textTransform: 'uppercase',
                  letterSpacing: '0.05em' }}>
                  Group Pool — {summary.cycleName}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem'
                }}>
                  {[
                    { label: 'Total Contributions',
                      value: summary.totalContributions, color: '#4ade80' },
                    { label: 'Loans Issued',
                      value: summary.totalLoansIssued, color: '#f59e0b' },
                    { label: 'Interest Earned',
                      value: summary.totalInterestEarned, color: '#60a5fa' },
                    { label: 'Pool Balance',
                      value: summary.poolBalance, color: '#4ade80' },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ margin: '0 0 0.25rem',
                        color: '#64748b', fontSize: '0.75rem' }}>
                        {item.label}
                      </p>
                      <p style={{ margin: 0, fontWeight: '600', color: item.color }}>
                        KES {item.value?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLoan && (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                padding: '1.5rem', border: '1px solid #3b82f6',
                marginBottom: '2rem'
              }}>
                <h3 style={{ marginTop: 0 }}>Your Active Loan</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '1rem', marginBottom: '1rem'
                }}>
                  {[
                    { label: 'Principal',
                      value: `KES ${activeLoan.principal?.toLocaleString()}` },
                    { label: 'Flat Fee',
                      value: `KES ${activeLoan.flatFee?.toLocaleString()}` },
                    { label: 'Total Repayable',
                      value: `KES ${activeLoan.totalRepayable?.toLocaleString()}` },
                    { label: 'Due Date', value: activeLoan.dueDate
                      ? new Date(activeLoan.dueDate).toLocaleDateString()
                      : 'TBD' },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ margin: '0 0 0.25rem',
                        color: '#64748b', fontSize: '0.75rem' }}>
                        {item.label}
                      </p>
                      <p style={{ margin: 0, fontWeight: '600' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: '600',
                  ...statusColor(activeLoan.status)
                }}>
                  {activeLoan.status}
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'halloffame' && <HallOfFame />}

        {/* ── CONTRIBUTIONS TAB ── */}
        {activeTab === 'contributions' && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0 }}>My Contributions</h2>
              <div style={{
                background: '#1e293b', borderRadius: '8px',
                padding: '0.5rem 1rem', border: '1px solid #334155',
                fontSize: '0.875rem'
              }}>
                🔥 Streak: <strong style={{ color: '#f59e0b' }}>
                  {streak} week{streak !== 1 ? 's' : ''}
                </strong>
              </div>
            </div>

            {contributions.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No contributions recorded yet.</p>
            ) : (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                border: '1px solid #334155', overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Cycle', 'Week', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} style={{
                          padding: '1rem', textAlign: 'left',
                          fontSize: '0.75rem', color: '#94a3b8',
                          textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((c, i) => (
                      <tr key={c.id} style={{
                        borderTop: '1px solid #334155',
                        background: i % 2 === 0 ? 'transparent' : '#ffffff08'
                      }}>
                        <td style={{ padding: '1rem', color: '#94a3b8',
                          fontSize: '0.875rem' }}>
                          {c.cycle?.name ?? `Cycle #${c.cycleId}`}
                        </td>
                        <td style={{ padding: '1rem' }}>Week {c.weekNumber}</td>
                        <td style={{ padding: '1rem', color: '#4ade80',
                          fontWeight: '600' }}>
                          KES {c.amount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: '9999px',
                            fontSize: '0.75rem', fontWeight: '600',
                            background: c.status === 'Paid' ? '#1a3a2a' : '#3b1a1a',
                            color: c.status === 'Paid' ? '#4ade80' : '#f87171'
                          }}>
                            {c.status === 'Paid' ? '✓ Paid' : c.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#94a3b8',
                          fontSize: '0.875rem' }}>
                          {new Date(c.dateRecorded).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── LOANS TAB ── */}
        {activeTab === 'loans' && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0 }}>My Loans</h2>
              {activeCycle && !activeLoan && (
                <button
                  onClick={() => setShowLoanForm(!showLoanForm)}
                  style={{
                    padding: '0.75rem 1.5rem', background: '#2563eb',
                    border: 'none', borderRadius: '8px',
                    color: 'white', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  {showLoanForm ? 'Cancel' : '+ Request Loan'}
                </button>
              )}
            </div>

            {loanMessage && (
              <p style={{
                color: loanMessage.includes('submitted') ? '#4ade80' : '#f87171',
                marginBottom: '1rem'
              }}>
                {loanMessage}
              </p>
            )}

            {showLoanForm && (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                padding: '1.5rem', marginBottom: '1.5rem',
                border: '1px solid #334155'
              }}>
                <h3 style={{ marginTop: 0 }}>Request a Loan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: 0 }}>
                  Max loan amount: <strong style={{ color: 'white' }}>
                    KES {activeCycle?.maxLoanAmount?.toLocaleString()}
                  </strong>. A 10% flat fee applies.
                  Your request will be reviewed by the executive team.
                </p>
                <form onSubmit={handleLoanRequest}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '1rem', marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem',
                        fontSize: '0.875rem', color: '#94a3b8' }}>
                        Amount (KES)
                      </label>
                      <input
                        type="number"
                        placeholder={`Max KES ${activeCycle?.maxLoanAmount?.toLocaleString()}`}
                        value={loanForm.principal}
                        onChange={e => setLoanForm({
                          ...loanForm, principal: e.target.value })}
                        required
                        style={{
                          width: '100%', padding: '0.75rem',
                          background: '#0f172a', border: '1px solid #475569',
                          borderRadius: '6px', color: 'white',
                          fontSize: '0.875rem', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem',
                        fontSize: '0.875rem', color: '#94a3b8' }}>
                        Repayment Period (weeks)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 4"
                        min="1"
                        max="52"
                        value={loanForm.repaymentWeeks}
                        onChange={e => setLoanForm({
                          ...loanForm, repaymentWeeks: e.target.value })}
                        required
                        style={{
                          width: '100%', padding: '0.75rem',
                          background: '#0f172a', border: '1px solid #475569',
                          borderRadius: '6px', color: 'white',
                          fontSize: '0.875rem', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {loanForm.principal && (
                    <div style={{
                      background: '#0f172a', borderRadius: '8px',
                      padding: '1rem', marginBottom: '1rem',
                      border: '1px solid #334155', fontSize: '0.875rem'
                    }}>
                      <span style={{ color: '#94a3b8' }}>You receive: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        KES {parseFloat(loanForm.principal).toLocaleString()}
                      </span>
                      <span style={{ color: '#94a3b8', marginLeft: '1rem' }}>
                        Fee (10%):
                      </span>
                      <span style={{ color: '#f59e0b', marginLeft: '0.25rem' }}>
                        KES {(parseFloat(loanForm.principal) * 0.1).toLocaleString()}
                      </span>
                      <span style={{ color: '#94a3b8', marginLeft: '1rem' }}>
                        You repay:
                      </span>
                      <span style={{ color: '#4ade80', fontWeight: '600',
                        marginLeft: '0.25rem' }}>
                        KES {(parseFloat(loanForm.principal) * 1.1).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loanLoading}
                    style={{
                      padding: '0.75rem 1.5rem', background: '#2563eb',
                      border: 'none', borderRadius: '8px',
                      color: 'white', cursor: 'pointer', fontWeight: '600'
                    }}
                  >
                    {loanLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            )}

            {loans.length === 0 ? (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                padding: '3rem', textAlign: 'center',
                border: '1px solid #334155', color: '#94a3b8'
              }}>
                You have no loan history yet.
                {activeCycle && !activeLoan && (
                  <p style={{ marginBottom: 0 }}>
                    Click <strong style={{ color: 'white' }}>
                      + Request Loan
                    </strong> to apply.
                  </p>
                )}
              </div>
            ) : (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                border: '1px solid #334155', overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Principal', 'Fee', 'Total', 'Weeks', 'Due Date',
                        'Status', 'Requested'].map(h => (
                        <th key={h} style={{
                          padding: '1rem', textAlign: 'left',
                          fontSize: '0.75rem', color: '#94a3b8',
                          textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan, i) => {
                      const { bg, color } = statusColor(loan.status)
                      return (
                        <tr key={loan.id} style={{
                          borderTop: '1px solid #334155',
                          background: i % 2 === 0 ? 'transparent' : '#ffffff08'
                        }}>
                          <td style={{ padding: '1rem', color: '#4ade80',
                            fontWeight: '600' }}>
                            KES {loan.principal?.toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem', color: '#f59e0b' }}>
                            KES {loan.flatFee?.toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem', fontWeight: '600' }}>
                            KES {loan.totalRepayable?.toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem', color: '#94a3b8' }}>
                            {loan.repaymentWeeks}w
                          </td>
                          <td style={{ padding: '1rem', color: '#94a3b8',
                            fontSize: '0.875rem' }}>
                            {loan.dueDate
                              ? new Date(loan.dueDate).toLocaleDateString()
                              : '—'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem', borderRadius: '9999px',
                              fontSize: '0.75rem', fontWeight: '600',
                              background: bg, color
                            }}>
                              {loan.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#94a3b8',
                            fontSize: '0.875rem' }}>
                            {new Date(loan.requestedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── INVESTMENTS TAB ── */}
        {activeTab === 'investments' && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0 }}>Group Investments</h2>
              {activeCycle && (
                <span style={{
                  fontSize: '0.875rem', color: '#94a3b8',
                  background: '#1e293b', padding: '0.5rem 1rem',
                  borderRadius: '8px', border: '1px solid #334155'
                }}>
                  {activeCycle.name}
                </span>
              )}
            </div>

            {investments.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem', marginBottom: '1.5rem'
              }}>
                {[
                  { label: 'Active Projects',
                    value: investments.filter(i => i.status === 'Active').length,
                    color: '#60a5fa' },
                  { label: 'Capital Deployed',
                    value: `KES ${investments.reduce(
                      (s, i) => s + i.capitalAllocated, 0).toLocaleString()}`,
                    color: '#f59e0b' },
                  { label: 'Returns Generated',
                    value: `KES ${investments.reduce(
                      (s, i) => s + i.returnsGenerated, 0).toLocaleString()}`,
                    color: '#4ade80' },
                  { label: 'Net Profit',
                    value: (() => {
                      const net = investments.reduce(
                        (s, i) => s + i.returnsGenerated - i.capitalAllocated, 0)
                      return `${net >= 0 ? '+' : ''}KES ${net.toLocaleString()}`
                    })(),
                    color: investments.reduce(
                      (s, i) => s + i.returnsGenerated - i.capitalAllocated, 0) >= 0
                      ? '#4ade80' : '#f87171' },
                ].map(card => (
                  <div key={card.label} style={{
                    background: '#1e293b', borderRadius: '12px',
                    padding: '1.25rem', border: '1px solid #334155'
                  }}>
                    <p style={{ margin: '0 0 0.5rem',
                      color: '#94a3b8', fontSize: '0.875rem' }}>
                      {card.label}
                    </p>
                    <p style={{ margin: 0, fontSize: '1.25rem',
                      fontWeight: 'bold', color: card.color }}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {investments.length === 0 ? (
              <div style={{
                background: '#1e293b', borderRadius: '12px',
                padding: '3rem', textAlign: 'center',
                border: '1px solid #334155', color: '#94a3b8'
              }}>
                No investment projects this cycle yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {investments.map(inv => {
                  const net = inv.returnsGenerated - inv.capitalAllocated
                  const statusMap = {
                    Active: { bg: '#1e3a5f', color: '#60a5fa' },
                    Completed: { bg: '#1a3a2a', color: '#4ade80' },
                    Cancelled: { bg: '#3b1a1a', color: '#f87171' },
                  }
                  const { bg, color } = statusMap[inv.status] ||
                    { bg: '#1e293b', color: '#94a3b8' }

                  return (
                    <div key={inv.id} style={{
                      background: '#1e293b', borderRadius: '12px',
                      padding: '1.5rem', border: '1px solid #334155'
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '1rem'
                      }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>
                            {inv.projectName}
                          </h3>
                          <p style={{ margin: 0, color: '#94a3b8',
                            fontSize: '0.875rem' }}>
                            Started {new Date(
                              inv.investmentDate).toLocaleDateString()}
                            {inv.completedDate && ` — Completed ${new Date(
                              inv.completedDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '9999px',
                          fontSize: '0.75rem', fontWeight: '600',
                          background: bg, color
                        }}>
                          {inv.status}
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '1rem', marginBottom: inv.notes ? '1rem' : 0
                      }}>
                        {[
                          { label: 'Capital In',
                            value: `KES ${inv.capitalAllocated?.toLocaleString()}`,
                            color: '#f59e0b' },
                          { label: 'Returns Out',
                            value: `KES ${inv.returnsGenerated?.toLocaleString()}`,
                            color: '#4ade80' },
                          { label: 'Net',
                            value: `${net >= 0 ? '+' : ''}KES ${net.toLocaleString()}`,
                            color: net >= 0 ? '#4ade80' : '#f87171' },
                        ].map(item => (
                          <div key={item.label} style={{
                            background: '#0f172a', borderRadius: '8px',
                            padding: '0.75rem', border: '1px solid #334155'
                          }}>
                            <p style={{ margin: '0 0 0.25rem',
                              color: '#64748b', fontSize: '0.75rem' }}>
                              {item.label}
                            </p>
                            <p style={{ margin: 0, fontWeight: '600',
                              color: item.color }}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {inv.notes && (
                        <div style={{
                          background: '#0f172a', borderRadius: '8px',
                          padding: '0.75rem', border: '1px solid #334155',
                          marginTop: '1rem'
                        }}>
                          <p style={{ margin: '0 0 0.25rem',
                            color: '#64748b', fontSize: '0.75rem' }}>
                            Notes
                          </p>
                          <p style={{ margin: 0, color: '#94a3b8',
                            fontSize: '0.875rem' }}>
                            {inv.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}