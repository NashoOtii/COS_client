import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 transition-all duration-300">
        <div className="flex items-center gap-3 group cursor-pointer"
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/Logo.png" 
               alt="CoS" 
               className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors duration-300">
              Circle of Support
            </p>
            <p className="text-xs text-blue-600 font-medium leading-tight">
              CoS SACCO · Est. 2025
            </p>
          </div>
        </div>
        
        {/* Updated Nav Buttons with UX Effects */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-all duration-200 active:scale-95"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="group px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            Join Now <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-200 hover:bg-blue-100 transition-colors cursor-default">
          United We Stand · Est. 2025
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
          Building a brighter tomorrow through trust and support,{' '}
          <span className="text-blue-600 inline-block hover:scale-105 transition-transform duration-300 cursor-default">Stronger Together.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Circle of Support is a student-led savings cooperative where members pool resources, access affordable loans, and share in collective financial growth — transparently and accountably.
        </p>
        <div className="flex justify-center">
          <a
            href="/constitution.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-base font-semibold bg-white text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl no-underline transition-all duration-300 text-center hover:-translate-y-1 hover:shadow-md active:scale-95"
          >
            Read Our Constitution
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-900 py-12 px-6 shadow-inner">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Members', value: '30+' },
            { label: 'Cycles Completed', value: '3' },
            { label: 'Loans Issued', value: '60+' },
            { label: 'Founded', value: '2025' },
          ].map((stat, i) => (
            <div key={stat.label} className="group cursor-default hover:-translate-y-1 transition-transform duration-300">
              <p className="text-3xl font-extrabold text-white mb-1 group-hover:text-blue-200 transition-colors">
                {stat.value}
              </p>
              <p className="text-blue-300 text-sm group-hover:text-white transition-colors">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-4 tracking-tight">
          How It Works
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
          A simple, transparent system designed to grow your money and support your peers.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Weekly Contributions',
              text: 'Every member contributes a fixed amount weekly. Small, consistent inputs build a powerful shared pool over each semester cycle.',
              color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
            },
            {
              title: 'Access Affordable Loans',
              text: 'Members in good standing can borrow from the pool at a flat fee;no hidden charges, no bureaucracy, fast approval.',
              color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
            },
            {
              title: 'Share in the Returns',
              text: 'At the end of each cycle, interest earned and project returns are distributed back to members as dividends proportional to contributions.',
              color: 'bg-amber-50 border-amber-200 hover:border-amber-300',
            },
          ].map((item) => (
            <div key={item.title} className={`group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.color}`}>
              <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4 tracking-tight">
            What We Stand For
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Membership is more than financial — it's a commitment to a set of shared values.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Accountability', text: 'Every shilling is tracked. Every decision is transparent. Every member has a right to see how the group\'s money moves.' },
              { title: 'Growth Mindset', text: 'We invest in projects and ideas that generate returns for the group — turning savings into working capital.' },
              { title: 'Integrity', text: 'Our constitution governs us. Rules apply to everyone equally, from the Chairperson to the newest member.' },
              { title: 'Mutual Support', text: 'When a member needs a loan, the group is their guarantor. We rise together, or not at all.' },
            ].map(item => (
              <div key={item.title} className="group bg-white rounded-xl p-5 border border-slate-200 flex gap-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                <span className="text-2xl flex-shrink-0 transform group-hover:rotate-12 transition-transform duration-300">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <img src="/Logo.png" 
               alt="CoS"
               className="w-20 h-20 rounded-full object-cover mx-auto mb-6 ring-4 ring-primary-100 shadow-lg hover:scale-105 transition-transform duration-500" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Ready to Join?
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Membership is by application and executive approval. Tell us about yourself and we'll review your application.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="group px-8 py-3 text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-700/20 active:scale-95"
          >
            Start Application <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 text-center text-slate-400 text-sm bg-white">
        <p className="hover:text-slate-600 transition-colors cursor-default">© 2025 Circle of Support SACCO · United We Stand</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="/constitution.pdf" target="_blank" rel="noopener noreferrer" 
             className="text-slate-400 hover:text-primary-600 no-underline transition-colors duration-200">
            Constitution
          </a>
          <button onClick={() => navigate('/login')} 
           className="text-slate-400 hover:text-primary-600 bg-transparent border-none cursor-pointer text-sm transition-colors duration-200">
            Member Login
          </button>
        </div>
      </footer>
    </div>
  )
}