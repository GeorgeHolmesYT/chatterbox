'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../utils/supabaseClient';
import { FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function UpdatePassword() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have the access token in the URL (from the email link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (!accessToken) {
      setError('Invalid or expired password reset link. Please try again.');
    }
  }, []);

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">ChatterBox</h1>
          <p className="auth-tagline">Connect. Chat. Share.</p>
        </div>

        <h2 className="auth-title">Create new password</h2>
        
        <p className="auth-description">
          Your new password must be different from previously used passwords.
        </p>

        {error && (
          <div className="auth-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-success">
            <FiCheck />
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="password">
              <FiLock className="auth-input-icon" />
              New Password
            </label>
            <div className="auth-password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="auth-input"
                disabled={success}
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
            <label htmlFor="confirmPassword">
              <FiLock className="auth-input-icon" />
              Confirm Password
            </label>
            <div className="auth-password-container">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="auth-input"
                disabled={success}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading || success}>
            {loading ? (
              <div className="auth-loading-spinner"></div>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password?{' '}
          <Link href="/login" className="auth-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
