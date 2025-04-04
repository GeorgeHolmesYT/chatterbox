import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../utils/supabaseClient';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | ChatterBox</title>
        <meta name="description" content="Login to your ChatterBox account" />
      </Head>
      <div className="login-container">
        <div className="login-card">
          <div className="logo-container">
            <h1 className="logo">ChatterBox</h1>
            <p className="tagline">Connect. Chat. Share.</p>
          </div>

          <h2 className="login-title">Log in to your account</h2>

          {error && (
            <div className="error-banner">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <Link href="/auth/reset-password" className="link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <FiLogIn className="button-icon" />
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
