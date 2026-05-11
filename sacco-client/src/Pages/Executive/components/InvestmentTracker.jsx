import { useState, useEffect } from 'react'
import api from '../../../api/axios'

export default function InvestmentTracker({ activeCycle }) {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [returnsForm, setReturnsForm] = useState({})
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    projectName: '',
    capitalAllocated: '',
    notes: '',
  })

  useEffect(() => {
    if (activeCycle) fetchInvestments()
    else setLoading(false)
  }, [activeCycle])

  const fetchInvestments = async () => {
    try {
      const { data } = await api.get(`/investments/cycle/${activeCycle.id}`)
      setInvestments(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/investments', {
        cycleId: activeCycle.id,
        projectName: form.projectName,
        capitalAllocated: parseFloat(form.capitalAllocated),
        notes: form.notes,
      })
      setForm({ projectName: '', capitalAllocated: '', notes: '' })
      setShowForm(false)
      await fetchInvestments()
      setMessage('Investment created successfully.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to create investment.')
    }
  }

  const handleUpdateReturns = async (investmentId) => {
    const returns = returnsForm[investmentId]
    if (!returns) return
    setMessage('')
    try {
      await api.patch(`/investments/${investmentId}/returns`,
        parseFloat(returns),
        { headers: { 'Content-Type': 'application/json' } }
      )
      await fetchInvestments()
      setReturnsForm({ ...returnsForm, [investmentId]: '' })
      setMessage('Returns updated successfully.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to update returns.')
    }
  }

  const handleComplete = async (investmentId) => {
    setMessage('')
    try {
      await api.patch(`/investments/${investmentId}/complete`)
      await fetchInvestments()
      setMessage('Investment marked as completed.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to complete investment.')
    }
  }

  const totalAllocated = investments.reduce(
    (sum, i) => sum + i.capitalAllocated, 0)
  const totalReturns = investments.reduce(
    (sum, i) => sum + i.returnsGenerated, 0)
  const netProfit = totalReturns - totalAllocated

  const statusColor = (status) => {
    const map = {
      Active: { bg: '#1e3a5f', color: '#60a5fa' },
      Completed: { bg: '#1a3a2a', color: '#4ade80' },
      Cancelled: { bg: '#3b1a1a', color: '#f87171' },
    }
    return map[status] || { bg: '#1e293b', color: '#94a3b8' }
  }

  if (!activeCycle) return (
    <p style={{ color: '#94a3b8' }}>
      No active cycle. Create a cycle first.
    </p>
  )

  if (loading) return (
    <p style={{ color: '#94a3b8' }}>Loading investments...</p>
  )

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem'
      }}>
        <h2 style={{ margin: 0 }}>
          Investment Tracker — {activeCycle.name}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem', background: '#2563eb',
            border: 'none', borderRadius: '8px',
            color: 'white', cursor: 'pointer', fontWeight: '600'
          }}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem', marginBottom: '1.5rem'
      }}>
        {[
          { label: 'Projects', value: investments.length, color: '#60a5fa' },
          { label: 'Capital Deployed', value: `KES ${totalAllocated.toLocaleString()}`, color: '#f59e0b' },
          { label: 'Returns Generated', value: `KES ${totalReturns.toLocaleString()}`, color: '#4ade80' },
          { label: 'Net Profit', value: `KES ${netProfit.toLocaleString()}`,
            color: netProfit >= 0 ? '#4ade80' : '#f87171' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#1e293b', borderRadius: '12px',
            padding: '1.25rem', border: '1px solid #334155'
          }}>
            <p style={{ margin: '0 0 0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              {card.label}
            </p>
            <p style={{ margin: 0, fontSize: '1.375rem',
              fontWeight: 'bold', color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p style={{
          color: message.includes('success') ? '#4ade80' : '#f87171',
          marginBottom: '1rem'
        }}>
          {message}
        </p>
      )}

      {/* New Project Form */}
      {showForm && (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '1px solid #334155'
        }}>
          <h3 style={{ marginTop: 0 }}>New Investment Project</h3>
          <form onSubmit={handleCreate}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem', marginBottom: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.875rem', color: '#94a3b8'
                }}>
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bulk Maize Purchase"
                  value={form.projectName}
                  onChange={e => setForm({ ...form, projectName: e.target.value })}
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
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.875rem', color: '#94a3b8'
                }}>
                  Capital to Allocate (KES)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={form.capitalAllocated}
                  onChange={e => setForm({ ...form, capitalAllocated: e.target.value })}
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                fontSize: '0.875rem', color: '#94a3b8'
              }}>
                Notes
              </label>
              <textarea
                placeholder="Describe the project, expected returns, timeline..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: '#0f172a', border: '1px solid #475569',
                  borderRadius: '6px', color: 'white',
                  fontSize: '0.875rem', boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem', background: '#2563eb',
                border: 'none', borderRadius: '8px',
                color: 'white', cursor: 'pointer', fontWeight: '600'
              }}
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Investments Table */}
      {investments.length === 0 ? (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          padding: '3rem', textAlign: 'center',
          border: '1px solid #334155', color: '#94a3b8'
        }}>
          No investment projects yet for this cycle.
          Click <strong style={{ color: 'white' }}>+ New Project</strong> to allocate funds.
        </div>
      ) : (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          border: '1px solid #334155', overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Project', 'Capital', 'Returns', 'Net', 'Status', 'Notes', 'Actions'].map(h => (
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
              {investments.map((inv, i) => {
                const { bg, color } = statusColor(inv.status)
                const net = inv.returnsGenerated - inv.capitalAllocated
                return (
                  <tr key={inv.id} style={{
                    borderTop: '1px solid #334155',
                    background: i % 2 === 0 ? 'transparent' : '#ffffff08'
                  }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                      {inv.projectName}
                    </td>
                    <td style={{ padding: '1rem', color: '#f59e0b' }}>
                      KES {inv.capitalAllocated?.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#4ade80' }}>
                      KES {inv.returnsGenerated?.toLocaleString()}
                    </td>
                    <td style={{
                      padding: '1rem', fontWeight: '600',
                      color: net >= 0 ? '#4ade80' : '#f87171'
                    }}>
                      {net >= 0 ? '+' : ''}KES {net.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem', borderRadius: '9999px',
                        fontSize: '0.75rem', fontWeight: '600',
                        background: bg, color
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem', color: '#94a3b8',
                      fontSize: '0.875rem', maxWidth: '200px'
                    }}>
                      {inv.notes || '—'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {inv.status === 'Active' && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="number"
                            placeholder="Returns"
                            value={returnsForm[inv.id] || ''}
                            onChange={e => setReturnsForm({
                              ...returnsForm, [inv.id]: e.target.value
                            })}
                            style={{
                              width: '90px', padding: '0.375rem 0.5rem',
                              background: '#0f172a', border: '1px solid #475569',
                              borderRadius: '6px', color: 'white', fontSize: '0.75rem'
                            }}
                          />
                          <button
                            onClick={() => handleUpdateReturns(inv.id)}
                            style={{
                              padding: '0.375rem 0.75rem', background: '#2563eb',
                              border: 'none', borderRadius: '6px',
                              color: 'white', cursor: 'pointer', fontSize: '0.75rem'
                            }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleComplete(inv.id)}
                            style={{
                              padding: '0.375rem 0.75rem', background: '#15803d',
                              border: 'none', borderRadius: '6px',
                              color: 'white', cursor: 'pointer', fontSize: '0.75rem'
                            }}
                          >
                            Complete
                          </button>
                        </div>
                      )}
                      {inv.status === 'Completed' && (
                        <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>
                          ✓ Completed
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}