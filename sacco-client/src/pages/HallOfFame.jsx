import { useState, useEffect } from 'react'
import api from '../api/axios'

const HISTORICAL_CYCLES = [
  {
    id: 'hist-1',
    name: 'Cycle 1',
    code: 'C1',
    period: '2025 — 12th Jan / 27th Apr',
    description: 'The foundational phase of our Sacco, establishing core contribution baselines, member accountability, and our initial community-backed credit loop.',
    stats: [
      { label: 'Members', value: '20' },
      { label: 'Total Contributions', value: 'KES 30,800' },
      { label: 'Loans Issued', value: '18' },
      { label: 'Status', value: 'Completed' },
    ],
    pdf: '/reports/cycle1-report.pdf',
  },
  {
    id: 'hist-2',
    name: 'Cycle 2',
    code: 'C2',
    period: '2025 — 30th Aug / 14th Dec',
    description: 'A developmental chapter focused on capital expansion and asset growth, successfully scaling our overall pool to accommodate larger loan applications.',
    stats: [
      { label: 'Members', value: '23' },
      { label: 'Total Contributions', value: 'KES 55,000' },
      { label: 'Loans Issued', value: '21' },
      { label: 'Status', value: 'Completed' },
    ],
    pdf: '/reports/cycle2-report.pdf',
  },
  {
    id: 'hist-3',
    name: 'Cycle 3',
    code: 'C3',
    period: '2026 — 31st Jan / 10th May',
    description: 'Our final manual record-keeping phase, maximizing loan turnarounds and optimizing member dividends prior to upgrading to automated digital tracking.',
    stats: [
      { label: 'Members', value: '18' },
      { label: 'Total Contributions', value: 'KES 55,800' },
      { label: 'Loans Issued', value: '27' },
      { label: 'Status', value: 'Completed' },
    ],
    pdf: '/reports/cycle3-report.pdf',
  },
]

export default function HallOfFame() {
  const [cycles, setCycles] = useState([])
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [histExpanded, setHistExpanded] = useState(null)

  useEffect(() => { fetchArchivedCycles() }, [])

  const fetchArchivedCycles = async () => {
    try {
      const { data } = await api.get('/cycles')
      const archived = data.filter(c => c.status === 'Archived')
      setCycles(archived)
      const results = {}
      await Promise.all(
        archived.map(async (cycle) => {
          try {
            const { data: sum } = await api.get(`/cycles/${cycle.id}/summary`)
            results[cycle.id] = sum
          } catch {
            results[cycle.id] = null
          }
        })
      )
      setSummaries(results)
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id) => setExpanded(expanded === id ? null : id)
  const toggleHist = (id) => setHistExpanded(histExpanded === id ? null : id)

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 font-medium tracking-wide animate-pulse">
        Loading historical ledger...
      </p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Historical Ledger
        </h2>
        <p className="text-gray-500 text-sm mt-1 max-w-2xl">
          An immutable record of every completed financial cycle. This archive preserves the baseline 
          growth numbers and distribution reports.
        </p>
      </div>

      {/* ── PRE-SYSTEM CYCLES ── */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Pre-System Ledger (Legacy)
          </span>
          <div className="h-px w-100 bg-gradient-to-r from-gray-200 to-transparent flex-1" />
        </div>

        <div className="flex flex-col gap-4">
          {HISTORICAL_CYCLES.map(cycle => {
            const isOpen = histExpanded === cycle.id
            return (
              <div key={cycle.id}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden 
                  transition-all duration-200 border-l-4 border-l-slate-400
                  ${isOpen ? 'ring-1 ring-slate-400 shadow-md' : 'hover:border-gray-300 hover:shadow'}`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleHist(cycle.id)}
                  className={`flex justify-between items-center p-5 cursor-pointer transition-colors
                    ${isOpen ? 'bg-slate-50/50' : 'hover:bg-gray-50/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs tracking-wider">
                      {cycle.code}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{cycle.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">{cycle.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                      Legacy Archive
                    </span>
                    <span className="text-gray-400 transition-transform duration-200">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 bg-white">
                    <p className="text-gray-600 text-sm mt-4 mb-5 leading-relaxed">
                      {cycle.description}
                    </p>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {cycle.stats.map(stat => (
                        <div key={stat.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
                          <p className="text-sm font-bold text-gray-800">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* PDF Actions Panel */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-9 h-9 bg-red-50 rounded-md flex items-center justify-center border border-red-100">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{cycle.name} Audited Ledger</p>
                          <p className="text-xs text-gray-400 font-mono">PDF Financial Report Summary</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <a
                          href={cycle.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                        >
                          View Document
                        </a>
                        <a
                          href={cycle.pdf}
                          download
                          className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-800 hover:bg-gray-900 rounded-lg text-xs font-medium text-white transition-colors no-underline"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── LIVE SYSTEM CYCLES ── */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            System Automations Ledger
          </span>
          <div className="h-px w-100 bg-gradient-to-r from-gray-200 to-transparent flex-1" />
        </div>

        {cycles.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cycles.map((cycle, index) => {
              const sum = summaries[cycle.id]
              const isOpen = expanded === cycle.id
              const displayIndex = String(index + 1).padStart(2, '0')

              return (
                <div key={cycle.id}
                  className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden 
                    transition-all duration-200 border-l-4 border-l-emerald-500
                    ${isOpen ? 'ring-1 ring-emerald-500 shadow-md' : 'hover:border-gray-300 hover:shadow'}`}
                >
                  <div
                    onClick={() => toggle(cycle.id)}
                    className={`flex justify-between items-center p-5 cursor-pointer transition-colors
                      ${isOpen ? 'bg-emerald-50/20' : 'hover:bg-gray-50/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs tracking-wider border border-emerald-100">
                        #{displayIndex}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">{cycle.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">
                          {new Date(cycle.startDate).toLocaleDateString()} — {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {sum && (
                        <div className="hidden md:flex gap-6 text-right">
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Pool</p>
                            <p className="text-sm font-semibold text-gray-800">
                              KES {sum.totalContributions?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Yield Earned</p>
                            <p className="text-sm font-semibold text-emerald-600">
                              KES {sum.totalInterestEarned?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        System Active
                      </span>
                      <span className="text-gray-400">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {isOpen && sum && (
                    <div className="px-5 pb-5 border-t border-gray-100 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 mb-5">
                        {[
                          { label: 'Contributions', value: sum.totalContributions, color: 'text-gray-800', bg: 'bg-gray-50' },
                          { label: 'Loans Issued', value: sum.totalLoansIssued, color: 'text-gray-800', bg: 'bg-gray-50' },
                          { label: 'Interest Accrued', value: sum.totalInterestEarned, color: 'text-emerald-700', bg: 'bg-emerald-50/40' },
                          { label: 'Penalties Settled', value: sum.totalPenaltiesCollected, color: 'text-gray-800', bg: 'bg-gray-50' },
                          { label: 'Final Net Pool', value: sum.poolBalance, color: 'text-emerald-700', bg: 'bg-emerald-50/40', heavy: true },
                        ].map(stat => (
                          <div key={stat.label} className={`${stat.bg} rounded-lg p-3 border border-gray-100`}>
                            <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
                            <p className={`text-sm ${stat.heavy ? 'font-extrabold' : 'font-bold'} ${stat.color}`}>
                              KES {stat.value?.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-6 bg-gray-50 rounded-lg p-4 border border-gray-200/60 text-xs text-gray-500">
                        <div>
                          <span className="font-medium text-gray-400">Weekly Cap:</span>{' '}
                          <span className="font-semibold text-gray-700">KES {cycle.weeklyContributionAmount?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-400">Max Loan Allowance:</span>{' '}
                          <span className="font-semibold text-gray-700">KES {cycle.maxLoanAmount?.toLocaleString()}</span>
                        </div>
                        <div className="ml-auto text-gray-400 font-mono text-[11px]">
                          Cryptographically Signed Vault Record
                        </div>
                      </div>
                    </div>
                  )}

                  {isOpen && !sum && (
                    <div className="p-5 border-t border-gray-100 text-gray-400 text-xs font-medium bg-white">
                      Runtime dynamic summary data is currently missing from the server node for this cycle.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl text-center py-12 bg-gray-50/50">
            <p className="text-gray-700 font-medium text-sm mb-1">No automated system cycles archived yet</p>
            <p className="text-gray-400 text-xs">Cycles completed inside the core runtime control panel will automatically manifest logs here.</p>
          </div>
        )}
      </div>
    </div>
  )
}