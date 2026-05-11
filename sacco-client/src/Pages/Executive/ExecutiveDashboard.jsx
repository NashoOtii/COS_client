import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import CycleOverview from './components/CycleOverview'
import MemberList from './components/MemberList'
import ContributionLogger from './components/ContributionLogger'
import LoanQueue from './components/LoanQueue'
import InvestmentTracker from './components/InvestmentTracker'
import HallOfFame from '../HallOfFame'

export default function ExecutiveDashboard() {
  const { user, logout } = useAuth()
  const [activeCycle, setActiveCycle] = useState(null)
  const [summary, setSummary] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCycleData() }, [])

  const fetchCycleData = async () => {
    try {
      const { data: cycle } = await api.get('/cycles/active')
      setActiveCycle(cycle)
      const { data: sum } = await api.get(`/cycles/${cycle.id}/summary`)
      setSummary(sum)
    } catch {
      setActiveCycle(null)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'contributions', label: 'Contributions' },
    { id: 'loans', label: 'Loans' },
    { id: 'investments', label: 'Investments' },
    { id: 'halloffame', label: '🏆 Hall of Fame' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center 
      justify-center text-slate-400">
      Loading dashboard...
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 
        px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            🤝 Circle of Support
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">{user?.role} Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.fullName}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
          <button onClick={logout} className="btn-danger btn-sm">
            Logout
          </button>
        </div>
      </header>

      {/* Cycle Banner */}
      {activeCycle ? (
        <div className="bg-green-900/50 border-b border-green-800 
          px-6 py-2.5 text-sm text-green-300">
          Active Cycle:{' '}
          <strong className="text-green-100">{activeCycle.name}</strong>
          {' '}— Started{' '}
          {new Date(activeCycle.startDate).toLocaleDateString()}
        </div>
      ) : (
        <div className="bg-red-900/50 border-b border-red-800 
          px-6 py-2.5 text-sm text-red-300 flex items-center gap-3">
          No active cycle. Create one to get started.
          <button
            onClick={() => setActiveTab('overview')}
            className="btn-danger btn-sm"
          >
            Create Cycle
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 
        flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors duration-200 cursor-pointer
              bg-transparent border-x-0 border-t-0
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <CycleOverview
            activeCycle={activeCycle}
            summary={summary}
            onCycleCreated={fetchCycleData}
          />
        )}
        {activeTab === 'members' && <MemberList />}
        {activeTab === 'contributions' && (
          <ContributionLogger
            activeCycle={activeCycle}
            onContributionLogged={fetchCycleData}
          />
        )}
        {activeTab === 'loans' && <LoanQueue activeCycle={activeCycle} />}
        {activeTab === 'investments' && (
          <InvestmentTracker activeCycle={activeCycle} />
        )}
        {activeTab === 'halloffame' && <HallOfFame />}
      </main>
    </div>
  )
}