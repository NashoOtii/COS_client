import { useState, useEffect } from 'react'
import api from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'

export default function LoanQueue({ activeCycle }) {
  const { user } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    memberId: '',
    principal: '',
    repaymentWeeks: '',
  })
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchLoans()
    api.get('/members').then(({ data }) =>
      setMembers(data.filter(m => m.status === 'Active')))
  }, [])

  const fetchLoans = async () => {
    try {
      const { data } = await api.get('/loans')
      setLoans(data)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/loans', {
        memberId: parseInt(requestForm.memberId),
        cycleId: activeCycle.id,
        principal: parseFloat(requestForm.principal),
        repaymentWeeks: parseInt(requestForm.repaymentWeeks),
      })
      setRequestForm({ memberId: '', principal: '', repaymentWeeks: '' })
      setShowRequestForm(false)
      await fetchLoans()
      setMessage('Loan request submitted successfully.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to submit loan request.')
    }
  }

  const approve = async (loanId) => {
    setMessage('')
    try {
      await api.patch(`/loans/${loanId}/approve?approvedById=${user.memberId}`)
      await fetchLoans()
      setMessage('Loan approved successfully.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to approve loan.')
    }
  }

  const disburse = async (loanId) => {
    setMessage('')
    try {
      await api.patch(`/loans/${loanId}/disburse`)
      await fetchLoans()
      setMessage('Loan disbursed successfully.')
    } catch (err) {
      setMessage(err.response?.data || 'Failed to disburse loan.')
    }
  }

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

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading loans...</p>

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem'
      }}>
        <h2 style={{ margin: 0 }}>Loan Queue ({loans.length})</h2>
        {activeCycle && (
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            style={{
              padding: '0.75rem 1.5rem', background: '#2563eb',
              border: 'none', borderRadius: '8px',
              color: 'white', cursor: 'pointer', fontWeight: '600'
            }}
          >
            {showRequestForm ? 'Cancel' : '+ Request Loan'}
          </button>
        )}
      </div>

      {message && (
        <p style={{
          color: message.includes('success') ? '#4ade80' : '#f87171',
          marginBottom: '1rem'
        }}>
          {message}
        </p>
      )}

      {/* Request Form */}
      {showRequestForm && (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '1px solid #334155'
        }}>
          <h3 style={{ marginTop: 0 }}>New Loan Request</h3>
          <form onSubmit={handleRequest}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem', marginBottom: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.875rem', color: '#94a3b8'
                }}>
                  Member
                </label>
                <select
                  value={requestForm.memberId}
                  onChange={e => setRequestForm({ ...requestForm, memberId: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '0.75rem',
                    background: '#0f172a', border: '1px solid #475569',
                    borderRadius: '6px', color: 'white',
                    fontSize: '0.875rem', boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontSize: '0.875rem', color: '#94a3b8'
                }}>
                  Principal (KES)
                </label>
                <input
                  type="number"
                  placeholder={`Max: KES ${activeCycle?.maxLoanAmount?.toLocaleString()}`}
                  value={requestForm.principal}
                  onChange={e => setRequestForm({ ...requestForm, principal: e.target.value })}
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
                  Repayment Weeks
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  min="1"
                  max="52"
                  value={requestForm.repaymentWeeks}
                  onChange={e => setRequestForm({ ...requestForm, repaymentWeeks: e.target.value })}
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

            {/* Live fee preview */}
            {requestForm.principal && (
              <div style={{
                background: '#0f172a', borderRadius: '8px',
                padding: '1rem', marginBottom: '1rem',
                border: '1px solid #334155', fontSize: '0.875rem'
              }}>
                <span style={{ color: '#94a3b8' }}>Principal: </span>
                <span style={{ color: 'white' }}>
                  KES {parseFloat(requestForm.principal).toLocaleString()}
                </span>
                <span style={{ color: '#94a3b8', marginLeft: '1rem' }}>
                  Flat Fee (10%):
                </span>
                <span style={{ color: '#f59e0b', marginLeft: '0.25rem' }}>
                  KES {(parseFloat(requestForm.principal) * 0.1).toLocaleString()}
                </span>
                <span style={{ color: '#94a3b8', marginLeft: '1rem' }}>
                  Total Repayable:
                </span>
                <span style={{ color: '#4ade80', fontWeight: '600', marginLeft: '0.25rem' }}>
                  KES {(parseFloat(requestForm.principal) * 1.1).toLocaleString()}
                </span>
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem', background: '#2563eb',
                border: 'none', borderRadius: '8px',
                color: 'white', cursor: 'pointer', fontWeight: '600'
              }}
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Loans Table */}
      {loans.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No loans requested yet.</p>
      ) : (
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          border: '1px solid #334155', overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Member', 'Principal', 'Fee', 'Total', 'Due Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '1rem', textAlign: 'left',
                    fontSize: '0.75rem', color: '#94a3b8',
                    textTransform: 'uppercase'
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
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {loan.member?.fullName ?? `Member #${loan.memberId}`}
                    </td>
                    <td style={{ padding: '1rem', color: '#4ade80' }}>
                      KES {loan.principal?.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#fbbf24' }}>
                      KES {loan.flatFee?.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                      KES {loan.totalRepayable?.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
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
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {loan.status === 'Pending' && (
                        <button
                          onClick={() => approve(loan.id)}
                          style={{
                            padding: '0.375rem 0.75rem', background: '#15803d',
                            border: 'none', borderRadius: '6px',
                            color: 'white', cursor: 'pointer', fontSize: '0.75rem'
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {loan.status === 'Approved' && (
                        <button
                          onClick={() => disburse(loan.id)}
                          style={{
                            padding: '0.375rem 0.75rem', background: '#1d4ed8',
                            border: 'none', borderRadius: '6px',
                            color: 'white', cursor: 'pointer', fontSize: '0.75rem'
                          }}
                        >
                          Disburse
                        </button>
                      )}
                      {loan.status === 'Active' && (
                        <span style={{ color: '#60a5fa', fontSize: '0.75rem' }}>
                          Active
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