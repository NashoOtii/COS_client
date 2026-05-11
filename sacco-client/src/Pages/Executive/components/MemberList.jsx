import { useState, useEffect } from 'react'
import api from '../../../api/axios'

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/members').then(({ data }) => {
      setMembers(data)
      setLoading(false)
    })
  }, [])

  const toggleStatus = async (member) => {
    const newStatus = member.status === 'Active' ? 1 : 0
    await api.patch(`/members/${member.id}/status`, newStatus, {
      headers: { 'Content-Type': 'application/json' }
    })
    setMembers(members.map(m =>
      m.id === member.id
        ? { ...m, status: member.status === 'Active' ? 'Inactive' : 'Active' }
        : m
    ))
  }

  const roleColor = (role) => {
    const map = {
      Chairperson: 'bg-purple-500/20 text-purple-300',
      Treasurer: 'bg-blue-500/20 text-blue-300',
      Secretary: 'bg-cyan-500/20 text-cyan-300',
      Member: 'bg-slate-700 text-slate-300',
    }
    return map[role] || 'bg-slate-700 text-slate-300'
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-slate-400">Loading members...</p>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">
          Members
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({members.length})
          </span>
        </h2>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="table-header">Name</th>
              <th className="table-header">Phone</th>
              <th className="table-header">Role</th>
              <th className="table-header">Status</th>
              <th className="table-header">Joined</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map(member => (
              <tr key={member.id}
                className="hover:bg-slate-800/50 transition-colors">
                <td className="table-cell font-medium">{member.fullName}</td>
                <td className="table-cell text-slate-400">
                  {member.phoneNumber}
                </td>
                <td className="table-cell">
                  <span className={`badge ${roleColor(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`badge ${
                    member.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {member.status === 'Active' ? '● Active' : '● Inactive'}
                  </span>
                </td>
                <td className="table-cell text-slate-400 text-xs">
                  {new Date(member.dateJoined).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => toggleStatus(member)}
                    className={`btn-sm border-none cursor-pointer font-medium 
                      rounded-md px-3 py-1.5 text-xs transition-colors
                      ${member.status === 'Active'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                  >
                    {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}