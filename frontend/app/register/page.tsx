'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordInput } from '@/components/auth/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Full name is required';
    else if (name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    const pw = (document.getElementById('password') as HTMLInputElement)?.value ?? '';
    if (!pw) next.password = 'Password is required';
    else if (pw.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) next.password = 'Include at least one uppercase letter and one number';
    if (!agree) next.agree = 'You must accept the terms to continue';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your projects with Flowbase today."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {submitted ? (
        <div
          className="rounded-xl border border-success/30 bg-success/5 p-6 text-center"
          style={{ animation: 'scale-in 0.3s ease-out' }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-foreground">Account created</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mock registration only. In production you&apos;d be redirected to your dashboard.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-primary/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name}
              </p>
            )}
          </div>

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
                errors.email
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-primary/20'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password}
          />

          <div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agree}
                onCheckedChange={(v) => setAgree(v === true)}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agree && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.agree}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
