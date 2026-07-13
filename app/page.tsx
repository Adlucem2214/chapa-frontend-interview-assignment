"use client";

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function LandingPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (!res.success) {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo-password');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-0 pointer-events-none overflow-hidden h-[600px] md:h-[750px] select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.11] dark:opacity-[0.07] transition-opacity duration-300"
          style={{ backgroundImage: "url('/financial_charts_banner.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-chapa-green/12 via-transparent to-transparent dark:from-chapa-green/6" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-chapa-white dark:from-chapa-dark to-transparent" />
      </div>

      <nav className="h-20 border-b border-chapa-border-light dark:border-chapa-border-dark bg-white/60 dark:bg-chapa-dark/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 transition-all">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[3px] h-6 w-5" aria-hidden="true">
            <div className="w-[3px] h-2 bg-chapa-green rounded-full animate-[pulse_2s_infinite]" />
            <div className="w-[3px] h-5 bg-chapa-green rounded-full animate-[pulse_2s_infinite_0.2s]" />
            <div className="w-[3px] h-3 bg-chapa-green rounded-full animate-[pulse_2s_infinite_0.4s]" />
            <div className="w-[3px] h-6 bg-chapa-green rounded-full animate-[pulse_2s_infinite_0.6s]" />
          </div>
          <span className="font-bold tracking-tight text-lg text-foreground">
            Chapa <span className="text-chapa-green font-normal">Dashboard</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 text-chapa-dark"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 text-chapa-green"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m0 13.5V21M4.978 4.978l1.591 1.591m10.862 10.862l1.591 1.591M3 12h2.25m13.5 0H21M4.978 19.022l1.591-1.591m10.862-10.862l1.591-1.591M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                />
              </svg>
            )}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLoginModal(true)}
            className="hidden sm:inline-flex"
          >
            Access Terminal
          </Button>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 max-w-4xl mx-auto gap-8 relative z-10">
        <Badge variant="success" className="py-1 px-3">
          Chapa Settlement Terminal v2.0
        </Badge>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl">
          Scale your business with{' '}
          <span className="text-chapa-green inline-block relative">
            Chapa Infrastructure
          </span>
        </h1>

        <p className="text-base sm:text-lg text-chapa-slate dark:text-zinc-400 max-w-2xl leading-relaxed">
          The ultimate payment settlement hub for Ethiopian digital commerce.
          Initialize checkout APIs, review detailed bank listings, manage organization-wide active clearance controls, and inspect transactions in one high-performance dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowLoginModal(true)}
            className="font-semibold shadow-md px-8 py-3"
          >
            Access Console
          </Button>
          <a
            href="https://github.com/chapa-et"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-chapa-border-light dark:border-chapa-border-dark rounded-lg px-6 py-2.5 font-medium hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors text-foreground"
          >
            Developer API docs
          </a>
        </div>
      </section>

      <section className="border-t border-chapa-border-light dark:border-chapa-border-dark bg-white/40 dark:bg-chapa-dark/20 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-5 flex flex-col gap-3 items-start text-left">
            <div className="p-2.5 rounded-lg bg-chapa-green/10 text-chapa-green dark:bg-chapa-green/20">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <h3 className="font-bold text-foreground text-base">Checkout API Integration</h3>
            <p className="text-xs text-chapa-slate dark:text-zinc-400 leading-relaxed">
              Generate checkout sessions dynamically, redirect to secure payment pages, and verify references with immediate webhook feedback.
            </p>
          </div>
          <div className="p-5 flex flex-col gap-3 items-start text-left">
            <div className="p-2.5 rounded-lg bg-chapa-green/10 text-chapa-green dark:bg-chapa-green/20">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="font-bold text-foreground text-base">Role Clearance Matrices</h3>
            <p className="text-xs text-chapa-slate dark:text-zinc-400 leading-relaxed">
              Tailored workspaces for standard Merchants (User), operations officers (Admin), and directory managers (Super Admin) with strict guards.
            </p>
          </div>
          <div className="p-5 flex flex-col gap-3 items-start text-left">
            <div className="p-2.5 rounded-lg bg-chapa-green/10 text-chapa-green dark:bg-chapa-green/20">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21M3 21h18M12 6.75a.75.75 0 11-.001-1.501A.75.75 0 0112 6.75z" />
              </svg>
            </div>
            <h3 className="font-bold text-foreground text-base">Ethiopian Banking Registry</h3>
            <p className="text-xs text-chapa-slate dark:text-zinc-400 leading-relaxed">
              Live queries representing real banks available for checkout settlements, integrated using server-side endpoint proxies.
            </p>
          </div>
        </div>
      </section>

      <footer className="h-16 border-t border-chapa-border-light dark:border-chapa-border-dark flex items-center justify-between px-6 md:px-12 text-xs text-chapa-slate dark:text-zinc-500 bg-white/10 dark:bg-chapa-dark/10">
        <span>Chapa Dashboard assignment</span>
        <span>Standard cryptographic gateway integration</span>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div
            className="w-full max-w-md border rounded-2xl p-6 shadow-xl relative animate-scale-up"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 p-1.5 text-chapa-slate hover:text-foreground cursor-pointer rounded-full transition-colors flex items-center justify-center"
              aria-label="Close login console"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold tracking-tight text-foreground text-center">
              Sign in to Chapa Console
            </h2>
            <p className="text-xs text-chapa-slate dark:text-zinc-400 mt-1.5 text-center">
              Enter your credentials to access the Chapa dashboard terminal.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 mt-6">
              {error && (
                <div className="p-3 rounded-lg text-xs bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green outline-none"
                  placeholder="name@chapa.co"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-chapa-slate dark:text-zinc-400">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-chapa-border-light dark:border-chapa-border-dark bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-chapa-green outline-none"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                variant="primary"
                className="w-full font-semibold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-chapa-border-light dark:border-chapa-border-dark">
              <h3 className="text-xs font-bold text-chapa-slate dark:text-zinc-500 uppercase tracking-wider text-center mb-3">
                Quick-Start demo profiles
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickSelect('abebe@chapa.co')}
                  className="p-2 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg text-left hover:border-chapa-green hover:bg-chapa-green/5 dark:hover:bg-chapa-green/10 transition-all font-medium text-foreground cursor-pointer"
                >
                  <div className="font-bold">Abebe Kebede</div>
                  <div className="text-[10px] text-chapa-slate">Merchant (User)</div>
                </button>

                <button
                  onClick={() => handleQuickSelect('yared@chapa.co')}
                  className="p-2 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg text-left hover:border-chapa-green hover:bg-chapa-green/5 dark:hover:bg-chapa-green/10 transition-all font-medium text-foreground cursor-pointer"
                >
                  <div className="font-bold">Yared Hailu</div>
                  <div className="text-[10px] text-chapa-slate">Settlement Admin</div>
                </button>

                <button
                  onClick={() => handleQuickSelect('solomon@chapa.co')}
                  className="p-2 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg text-left hover:border-chapa-green hover:bg-chapa-green/5 dark:hover:bg-chapa-green/10 transition-all font-medium text-foreground cursor-pointer"
                >
                  <div className="font-bold">Solomon Berhanu</div>
                  <div className="text-[10px] text-chapa-slate">Super Admin</div>
                </button>

                <button
                  onClick={() => handleQuickSelect('dawit@chapa.co')}
                  className="p-2 border border-chapa-border-light dark:border-chapa-border-dark rounded-lg text-left hover:border-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-all font-medium text-foreground cursor-pointer"
                >
                  <div className="font-bold">Dawit Assefa</div>
                  <div className="text-[10px] text-red-500 font-semibold">Suspended Merchant</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
