import React, { useState } from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { 
  Smartphone, 
  Shield, 
  Building2, 
  ArrowRight, 
  KeyRound, 
  Mail,
  CheckCircle2
} from 'lucide-react';

const ROLES = [
  {
    id: 'resident',
    title: 'Resident',
    subtitle: 'Citizen App',
    email: 'resident@urbanhubx.demo',
    password: 'Resident2026!',
    tab: 'home',
    icon: Smartphone,
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Guard Ops',
    email: 'security@urbanhubx.demo',
    password: 'GuardOps2026!',
    tab: 'overview',
    icon: Shield,
  },
  {
    id: 'property',
    title: 'Property',
    subtitle: 'Township Admin',
    email: 'property@urbanhubx.demo',
    password: 'PropertyMgmt2026!',
    tab: 'overview',
    icon: Building2,
  },
];

export function NightSafeLoginView() {
  const { navigateRole, showToast } = useNightSafe();

  const [selectedRole, setSelectedRole] = useState('resident');
  const [email, setEmail] = useState('resident@urbanhubx.demo');
  const [password, setPassword] = useState('Resident2026!');
  const [error, setError] = useState('');

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    const target = ROLES.find(r => r.id === roleId);
    if (target) {
      setEmail(target.email);
      setPassword(target.password);
    }
    setError('');
  };

  const handleFormLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    const lower = email.trim().toLowerCase();
    if (lower.includes('security') || lower.includes('guard') || selectedRole === 'security') {
      navigateRole('security', 'overview');
    } else if (lower.includes('property') || lower.includes('manager') || lower.includes('admin') || selectedRole === 'property') {
      navigateRole('property', 'overview');
    } else {
      navigateRole('resident', 'home');
    }
  };

  const handleForgotPassword = () => {
    if (showToast) {
      showToast('Password reset link sent to your email address.', 'info');
    }
  };

  const handleSignUp = () => {
    if (showToast) {
      showToast('Demo Mode: Self-registration is simulated. Please select a role above to sign in.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[#2864A6]/20 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute -bottom-16 right-8 w-[280px] h-[280px] bg-sky-500/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Main Login Chassis */}
      <main className="max-w-md w-full mx-auto relative z-10">
        <div className="bg-[#0D1726]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Logo & Name as UrbanHub-X */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E3C66] via-[#2864A6] to-sky-400 p-[2px] shadow-xl shadow-sky-500/20">
              <div className="w-full h-full bg-[#0D1726] rounded-[14px] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-sky-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l16 16" />
                  <path d="M20 4L4 20" />
                  <circle cx="12" cy="12" r="2.5" className="fill-sky-400 stroke-none" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              UrbanHub<span className="text-sky-400">-X</span>
            </h1>
          </div>

          {/* Role Selection Card Section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r.id)}
                    className={`relative p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3C66]/80 border-sky-400 ring-2 ring-sky-400/40 text-white shadow-lg shadow-sky-900/40'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 text-sky-400">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400 text-[#0D1726]" />
                      </div>
                    )}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-sky-400/20 text-sky-300'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight">{r.title}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@urbanhubx.demo"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2864A6] to-sky-500 hover:from-sky-600 hover:to-[#2864A6] text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Fake Sign Up Button */}
          <div className="text-center pt-1 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignUp}
                className="text-sky-400 hover:text-sky-300 font-semibold hover:underline transition-colors ml-1 cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
