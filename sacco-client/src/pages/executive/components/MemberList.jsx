import { useState, useEffect, useCallback } from 'react'
import api from '../../../api/axios'
import { SkeletonTable } from '../../../components/Skeleton'

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState([])

  // 1. Centralized fetch function
  const fetchData = useCallback(async () => {
    try {
      const [allResponse, pendResponse] = await Promise.all([
        api.get('/members'),
        api.get('/members/pending')
      ])
      
      setMembers(allResponse.data.filter(m => m.status === 'Active'))
      setPending(pendResponse.data)
    } catch (error) {
      console.error("Error fetching member data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. Initial mount fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 3. toggleStatus (Deactivate)
  const toggleStatus = async (member) => {
    try {
      const newStatusValue = member.status === 'Active' ? 1 : 0
      await api.patch(`/members/${member.id}/status`, newStatusValue, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      // Remove from active view dynamically
      setMembers(members.filter(m => m.id !== member.id))
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  // 4. reset password
  const handleResetPassword = async (member) => {
    const newPassword = prompt(`Enter new temporary password for ${member.fullName}:`)
    if (!newPassword || newPassword.trim() === '') return
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.')
      return
    }
    try {
      await api.post(`/members/${member.id}/reset-password?newPassword=${encodeURIComponent(newPassword)}`)
      alert(`Password reset for ${member.fullName} successfully.`)
    } catch (error) {
      const msg = error.response?.data
      alert(`Error: ${Array.isArray(msg) ? msg.join(' ') : msg || 'Reset failed.'}`)
    }
  }

  // 5. Delete member (Handles both active and pending states)
  const handleDelete = async (member) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${member.fullName}? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/members/${member.id}`);
      
      // Clear out of whichever list they were sitting in
      setMembers(members.filter(m => m.id !== member.id));
      setPending(pending.filter(m => m.id !== member.id));
      
      alert(`${member.fullName} has been successfully deleted.`);
    } catch (error) {
      console.error("Error deleting member:", error);
      const msg = error.response?.data;
      alert(`Error: ${Array.isArray(msg) ? msg.join(' ') : msg || 'Failed to delete member.'}`);
    }
  }

  const approveMember = async (member) => {
    try {
      await api.patch(`/members/${member.id}/status`, 0, {
        headers: { 'Content-Type': 'application/json' }
      })
      setPending(pending.filter(m => m.id !== member.id))
      await fetchData()
    } catch (error) {
      console.error("Error approving member:", error)
    }
  }

  const roleColor = (role) => {
    const map = {
      Chairperson: 'bg-purple-100 text-purple-700',
      Treasurer:   'bg-blue-100 text-blue-700',
      Secretary:   'bg-cyan-100 text-cyan-700',
      Member:      'bg-gray-100 text-gray-600',
    }
    return map[role] || 'bg-gray-100 text-gray-600'
  }

  const filtered = members.filter(m =>
    m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    m.phoneNumber?.includes(search)
  )

  const activeCount = members.filter(m => m.status === 'Active').length

  if (loading) return (
    <div>
      <div className="page-header">
        <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="section-title">Members</h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeCount} active · {members.length} total
          </p>
        </div>
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"/>
            <h3 className="text-sm font-semibold text-amber-700">
              Pending Approval ({pending.length})
            </h3>
          </div>
          <div className="card p-0 overflow-hidden border-amber-200">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-amber-100 bg-amber-50">
                    <th className="table-header text-amber-700 text-left">Member</th>
                    <th className="table-header text-amber-700 text-left">Phone</th>
                    <th className="table-header text-amber-700 text-left">Role Requested</th>
                    <th className="table-header text-amber-700 text-left">Registered</th>
                    <th className="table-header text-amber-700 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {pending.map(member => (
                    <tr key={member.id} className="hover:bg-amber-50/50">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold text-sm">
                            {member.fullName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {member.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell text-gray-500">
                        {member.phoneNumber}
                      </td>
                      <td className="table-cell">
                        <span className="badge bg-amber-100 text-amber-700">
                          {member.role}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500 text-xs">
                        {new Date(member.dateJoined).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveMember(member)}
                            className="text-xs font-semibold px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg border-none cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border-none cursor-pointer transition-colors"
                          >
                            Reject & Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-sm"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="table-header text-left">Member</th>
                <th className="table-header text-left">Phone</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Joined</th>
                <th className="table-header text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {member.fullName ? member.fullName.charAt(0) : '?'}
                      </div>
                      <span className="font-medium text-gray-900">
                        {member.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-500">
                    {member.phoneNumber}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${roleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge bg-green-100 text-green-700`}>
                      ● Active
                    </span>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">
                    {member.dateJoined ? new Date(member.dateJoined).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(member)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleResetPassword(member)}
                        className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg border-none cursor-pointer transition-colors"
                      >
                        Reset Pass
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="text-xs font-medium px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg border-none cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No members match your search.
          </div>
        )}
      </div>
    </div>
  )
}