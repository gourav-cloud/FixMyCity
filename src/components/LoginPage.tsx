import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, MapPin } from 'lucide-react';
import { supabaseClient } from '../services/supabase';

interface LoginPageProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

type AuthMode = 'sign-in' | 'sign-up';

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const isConfigured = Boolean(supabaseClient);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!supabaseClient) {
      setNotice({ type: 'error', message: 'Sign-in is unavailable until Supabase is configured.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = mode === 'sign-in'
        ? await supabaseClient.auth.signInWithPassword({ email, password })
        : await supabaseClient.auth.signUp({ email, password });

      if (result.error) throw result.error;

      if (result.data.session) {
        onAuthenticated();
      } else {
        setNotice({
          type: 'success',
          message: 'Account created. Check your email to confirm your address, then sign in.',
        });
        setMode('sign-in');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setNotice({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setNotice(null);
    if (!supabaseClient) {
      setNotice({ type: 'error', message: 'Sign-in is unavailable until Supabase is configured.' });
      return;
    }
    if (!email.trim()) {
      setNotice({ type: 'error', message: 'Enter your email address first.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setNotice({ type: 'success', message: 'If an account exists for that email, a password reset link is on its way.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not request a password reset.';
      setNotice({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-cyan-950/20">
        <section className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500 flex items-center justify-center text-white font-extrabold text-xl">F</div>
            <span className="font-black text-2xl tracking-tight">FixMy<span className="text-cyan-400">City</span></span>
          </div>
          <div className="max-w-md space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-cyan-300" />
            </div>
            <h1 className="text-4xl font-black leading-tight">Your neighborhood, moving forward.</h1>
            <p className="text-slate-300 leading-relaxed">
              Sign in to take part in reporting and tracking the local issues that matter to your community.
            </p>
          </div>
          <p className="text-xs text-slate-400">Real People. Real Issues. Real Change.</p>
        </section>

        <section className="p-6 sm:p-10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to FixMyCity
          </button>

          <div className="max-w-sm mx-auto pt-10 pb-4">
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-extrabold">F</div>
              <span className="font-black text-xl">FixMy<span className="text-cyan-400">City</span></span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Citizen account</p>
            <h2 className="mt-2 text-3xl font-black">{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {mode === 'sign-in' ? 'Sign in to continue to FixMyCity.' : 'Join your community on FixMyCity.'}
            </p>

            {!isConfigured && (
              <div role="alert" className="mt-6 rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-sm text-amber-100">
                Supabase is not configured. Add <code className="text-amber-200">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-amber-200">VITE_SUPABASE_ANON_KEY</code> to your environment, then restart the app.
              </div>
            )}

            {notice && (
              <div
                role={notice.type === 'error' ? 'alert' : 'status'}
                className={`mt-6 rounded-xl border p-3 text-sm ${
                  notice.type === 'error'
                    ? 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                    : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
                }`}
              >
                {notice.message}
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-200">
                Email address
                <span className="relative block mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </span>
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Password
                <span className="relative block mt-2">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </span>
              </label>

              {mode === 'sign-in' && (
                <div className="text-right -mt-2">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isSubmitting}
                    className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!isConfigured || isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              {mode === 'sign-in' ? 'New to FixMyCity?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setNotice(null);
                  setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                {mode === 'sign-in' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
