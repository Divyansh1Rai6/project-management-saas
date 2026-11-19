'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Mail, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <>
          Remembered your password?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div
          className="rounded-xl border border-success/30 bg-success/5 p-6 text-center"
          style={{ animation: 'scale-in 0.3s ease-out' }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-foreground">Check your inbox</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ve sent a reset link to <span className="font-medium text-foreground">{email}</span>. The link will expire in 30 minutes.
          </p>
          <Link
            href="/reset-password"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            I have my code — reset password
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                error
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-primary/20'
              }`}
            />
            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>

          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-muted-foreground" />
            Mock only — no email is actually sent.
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
