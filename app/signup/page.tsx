'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabaseClient'
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCalendar } from 'react-icons/fi'
import '../../styles/signup.css'

export default function Signup() {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Reset error when form fields change
    setError(null)
  }, [username, email, password, dateOfBirth])

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate form
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    // Validate date of birth (user must be at least 13 years old)
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 13) {
      setError('You must be at least 13 years old to sign up')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            date_of_birth: dateOfBirth,
          },
        },
      })

      if (error) throw error
      
      // Redirect to verify email page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">ChatterBox</h1>
          <p className="auth-tagline">Connect. Chat. Share.</p>
        </div>

        <h2 className="auth-title">Create your account</h2>

        {error && (
          <div className="auth-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="username">
              <FiUser className="auth-input-icon" />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">
              <FiMail className="auth-input-icon" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">
              <FiLock className="auth-input-icon" />
              Password
            </label>
            <div className="auth-password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="dateOfBirth">
              <FiCalendar className="auth-input-icon" />
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="auth-input"
              max={new Date().toISOString().split('T')[0]} // Set max date to today
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <div className="auth-loading-spinner"></div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="auth-terms">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}