import { useState, useEffect } from 'react'
import api from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'

export default function ContributionLogger({ activeCycle, onContributionLogged }) {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [contributions, setContributions] = useState([])
  const [weekNumber, setWeekNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/members').then(({ data }) =>
      setMembers(data.filter(m => m.status === 'Active')))
    if (activeCycle) {
      api.get(`/contributions/cycle/${activeCycle.id}`)
        .then(({ data }) => setContributions(data))
    }
  }, [activeCycle])

  const hasPaid = (memberId) =>
    contributions.some(c =>
      c.memberId === memberId &&
      c.weekNumber === weekNumber &&
      c.status === 'Paid'
    )

  const logContribution = async (memberId) => {
    if (!activeCycle) return
    setLoading(true)
    setMessage('')
    try {
      await api.post('/contributions', {
        memberId, cycleId: activeCycle.id,
        amount: activeCycle.weeklyContributionAmount,
        weekNumber, status: 'Paid',
        recordedById: user.memberId,
      })
      const { data } = await api.get(`/contributions/cycle/${activeCycle.id}`)
      setContributions(data)
      setMessage('Contribution logged successfully.')
      onContributionLogged()
    } catch (err) {
      setMessage(err.response?.data || 'Failed to log contribution.')
    } finally {
      setLoading(false)
    }
  }

  if (!activeCycle) return (
    <div className="card text-center py-12">
      <p className="text-4xl mb-4">📋</p>
      <p className="text-white font-semibold mb-2">No active cycle</p>
      <p className="text-slate-400 text-sm">Create a cycle first.</p>
    </div>
  )

  const paidCount = members.filter(m => hasPaid(m.id)).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="section-title">Log Contributions</h2>
          <p className="text-slate-400 text-sm mt-1">
            {paidCount} of {members.length} members paid this week
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-slate-400 text-sm">Week:</label>
          <input
            type="number" min="1" max="52" value={weekNumber}
            onChange={e => setWeekNumber(parseInt(e.target.value))}
            className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 
              rounded-lg text-white text-center text-sm focus:outline-none 
              focus:border-blue-500"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-6 p-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Week {weekNumber} Payment Progress</span>
          <span>{paidCount}/{members.length}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: members.length > 0
              ? `${(paidCount / members.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${
          message.includes('success')
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="table-header">Member</th>
              <th className="table-header">Phone</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Week {weekNumber} Status</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map(member => {
              const paid = hasPaid(member.id)
              return (
                <tr key={member.id}
                  className="hover:bg-slate-800/50 transition-colors">
                  <td className="table-cell font-medium">{member.fullName}</td>
                  <td className="table-cell text-slate-400">
                    {member.phoneNumber}
                  </td>
                  <td className="table-cell text-green-400 font-medium">
                    KES {activeCycle.weeklyContributionAmount?.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      paid
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {paid ? '✓ Paid' : '✗ Unpaid'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => logContribution(member.id)}
                      disabled={paid || loading}
                      className={`btn-sm border-none cursor-pointer font-medium 
                        rounded-md px-3 py-1.5 text-xs transition-colors
                        ${paid
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                      {paid ? 'Already Logged' : 'Log Payment'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}