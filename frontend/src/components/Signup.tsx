import React, { useState } from 'react';
import { Sun, Moon, Mail, Lock, User, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface SignupProps {
  onNavigateToLogin: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateToLogin, isDarkMode, setIsDarkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        onNavigateToLogin();
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      <div className="flex min-h-screen">
        <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-between border-r ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center space-x-3 rtl:space-x-reverse">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M12 7v10" />
                <path d="M16 12h-4" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Task Engine</span>
          </div>

          <div className="relative z-10 my-auto max-w-lg space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Join Task Engine & Elevate Your Engineering Workflow.
            </h1>
            <p className={isDarkMode ? 'text-zinc-400' : 'text-slate-600'}>
              Set up your profile to manage execution status, pipelines, and team productivity.
            </p>

            <div className="space-y-3 pt-4">
              {['Real-time Task Tracking', 'Automated Workflow Pipelines', 'Enterprise Security & Access'].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-zinc-500">
            © {new Date().getFullYear()} Task Engine Inc. All rights reserved.
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 relative">
          <div className="flex justify-between items-center w-full max-w-md mx-auto lg:max-w-none">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all duration-200 ml-auto ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="w-full max-w-md mx-auto my-auto py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
              <p className={isDarkMode ? 'text-zinc-400 text-sm' : 'text-slate-500 text-sm'}>
                Enter your details to set up your profile.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amira Mahmoud"
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200 ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className={`text-center text-xs mt-8 ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
              Already have an account?{' '}
              <button onClick={onNavigateToLogin} className="text-indigo-500 font-medium hover:underline focus:outline-none">
                Sign in
              </button>
            </p>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
};