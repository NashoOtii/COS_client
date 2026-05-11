import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const ROLES = ['Member', 'Treasurer', 'Secretary', 'Chairperson']

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', phoneNumber: '', email: '',
    password: '', role: 'Member',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      navigate('/login', {
        state: { message: 'Registration successful. Please sign in.' }
      })
    } catch (err) {
      const data = err.response?.data
      if (typeof data === 'string') setError(data)
      else if (data?.errors) {
        setError(Object.values(data.errors).flat().join(' '))
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center 
      justify-center px-4 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 
            bg-blue-600 rounded-2xl mb-4 text-2xl">
            🤝
          </div>
          <h1 className="text-3xl font-bold text-white">Circle of Support</h1>
          <p className="text-slate-400 mt-2 text-sm">Create your account</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 
              rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input type="text" placeholder="John Doe"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="input-field" required />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input type="tel" placeholder="e.g. 0712345678"
                value={form.phoneNumber}
                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                className="input-field" required />
            </div>

            <div>
              <label className="label">
                Email{' '}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input type="email" placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" placeholder="Minimum 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field" required />
            </div>

            <div>
              <label className="label">Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="input-field"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1.5">
                Executive roles require approval from existing executives.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}