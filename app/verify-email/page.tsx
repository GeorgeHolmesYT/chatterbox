'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';
import '../../styles/verify-email.css';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!canResend) return;
    
    setResending(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Call Supabase to resend verification email
      const { error } = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(res => res.json());
      
      if (error) {
        throw new Error(error);
      }
      
      setSuccess('Verification email has been resent');
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">ChatterBox</h1>
          <p className="auth-tagline">Connect. Chat. Share.</p>
        </div>

        <h2 className="auth-title">Verify your email</h2>
        
        <div className="auth-description">
          <FiMail size={48} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--primary-color)' }} />
          <p>
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to complete your registration.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-success">
            <FiCheck />
            <span>{success}</span>
          </div>
        )}

        <div className="auth-form">
          <button 
            className="auth-button" 
            onClick={handleResendEmail}
            disabled={!canResend || resending}
          >
            {resending ? (
              <div className="auth-loading-spinner"></div>
            ) : canResend ? (
              'Resend verification email'
            ) : (
              `Resend in ${countdown}s`
            )}
          </button>
        </div>

        <div className="auth-footer">
          <Link href="/login" className="auth-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
