'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordInput } from '@/components/auth/password-input';
import Link from 'next/link';

const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return Math.min(score, 4);
}

export default function ResetPasswordPage() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = scorePassword(password);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!code.trim()) next.code = 'Reset code is required';
    else if (code.trim().length < 6) next.code = 'Code must be at least 6 characters';
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) next.password = 'Include at least one uppercase letter and one number';
    if (!confirm) next.confirm = 'Please confirm your password';
    else if (confirm !== password) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the code from your email and choose a new password."
      footer={
        <>
          Didn&apos;t get a code?{' '}
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Resend link
          </Link>
        </>
      }
    >
      {done ? (
        <div
          className="rounded-xl border border-success/30 bg-success/5 p-6 text-center"
          style={{ animation: 'scale-in 0.3s ease-out' }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-foreground">Password updated</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Back to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-foreground">
              Reset Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              placeholder="Enter the 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm tracking-wider transition-colors focus:outline-none focus:ring-2 ${
                errors.code
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-primary/20'
              }`}
            />
            {errors.code && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.code}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              id="password"
              label="New Password"
              placeholder="Create a new password"
              autoComplete="new-password"
              error={errors.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && !errors.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= strength ? strengthColors[strength] : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Strength: {strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          <div>
            <PasswordInput
              id="confirm"
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              error={errors.confirm}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
