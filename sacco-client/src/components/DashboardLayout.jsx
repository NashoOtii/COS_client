import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logoutIcon from '../assets/icons8-logout-50.png';

export default function DashboardLayout({ tabs, activeTab, onTabChange, 
  activeCycle, children }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Added state for mobile drawer

  const isExecutive = ['Chairperson', 'Treasurer', 'Secretary']
    .includes(user?.role)

  const roleColor = {
    Chairperson: 'bg-purple-500',
    Treasurer: 'bg-blue-500',
    Secretary: 'bg-cyan-500',
    Member: 'bg-green-500',
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">

      {/* 1. MOBILE SLIDE-OUT DRAWER (Replaces the bottom menu)    */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Body */}
          <div className="relative flex flex-col w-72 max-w-xs bg-gray-900 text-white h-full shadow-2xl z-10 transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/Logo.png" 
                  alt="Circle of Support" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30" />
                <span className="font-bold text-sm tracking-tight text-white">Circle of Support</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800/50"
              >
                ✕
              </button>
            </div>

            {/* Mobile User Context Profile Area */}
            <div className="px-4 py-4 border-b border-gray-800 bg-gray-950/40">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${roleColor[user?.role] || 'bg-gray-500'}`}>
                  {user?.fullName?.charAt(0) || 'M'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                    {user?.fullName || 'Member'}
                  </p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Drawer Links */}
            <nav className="flex-1 py-3 overflow-y-auto space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false); // Automatically dismiss drawer after selecting tab
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium transition-all text-left border-none cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                  }`}
                >
                  <span className="text-base flex-shrink-0 opacity-80">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Drawer Footer with Logout Link */}
            <div className="p-4 border-t border-gray-800 bg-gray-950/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border-none bg-transparent cursor-pointer"
              >
                <img 
                  src={logoutIcon}
                  alt="Logout" 
                  className="w-5 h-5 object-contain brightness-0 invert opacity-60" 
                />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIDEBAR NAVIGATION (Desktop/Tablet Only Layout)        */}

      <aside className={`
       flex flex-col bg-gray-900 text-white transition-all duration-300
       flex-shrink-0 hidden md:flex
       ${sidebarOpen ? 'w-64' : 'w-16'}
   `}>
        {/* Logo Element */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img 
                src="/Logo.png" 
                alt="Circle of Support" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-400" />
              <div>
                <p className="font-bold text-white text-sm leading-tight">Circle of</p>
                <p className="font-bold text-green-400 text-sm leading-tight">Support</p>
              </div>
            </div>
          ) : (
            <img src="/Logo.png" alt="CoS" className="w-8 h-8 rounded-full object-cover mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-1 ml-auto"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Desktop Profile Status */}
        <div className={`px-4 py-4 border-b border-gray-700 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${roleColor[user?.role] || 'bg-gray-500'}`}>
              {user?.fullName?.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Cycle Panel Info */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-700">
            {activeCycle ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2.5">
                <p className="text-xs text-green-400 font-medium">Active Cycle</p>
                <p className="text-xs text-green-300 mt-0.5 truncate">{activeCycle.name}</p>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5">
                <p className="text-xs text-amber-400 font-medium">No Active Cycle</p>
              </div>
            )}
          </div>
        )}

        {/* Desktop Navigation Links Container */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={!sidebarOpen ? tab.label : undefined}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-sm 
                font-medium transition-all duration-150 cursor-pointer 
                border-none text-left
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
            >
              <span className="text-base flex-shrink-0">{tab.icon}</span>
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Desktop Footer Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 
              text-sm font-medium text-gray-400 hover:text-red-400 
              hover:bg-red-500/10 rounded-lg transition-all cursor-pointer 
              border-none bg-transparent
              ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <img 
              src={logoutIcon} 
              alt="Logout" 
              className="w-5 h-5 object-contain brightness-0 invert opacity-60" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 3. MAIN WORKSPACE CONTENT VIEWPORT AREA                   */}
      
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Viewport Top App Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            
            {/* HAMBURGER ICON BUTTON (Visible only on mobile screen widths) */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-base md:text-lg font-bold text-gray-900 leading-none">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                {user?.role} Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeCycle && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[11px] md:text-xs font-medium text-green-700">
                  {activeCycle.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main Children Views Container */}
        {/* Adjusted padding wrapper to recover space previously taken by bottom tab layouts */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  )
}