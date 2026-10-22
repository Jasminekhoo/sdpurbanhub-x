import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Mail, 
  AlertCircle,
  Leaf,
  Radio,
  ShoppingBag
} from 'lucide-react';
import { DEMO_ACCOUNTS, PRODUCT_INFO } from '../data/seedData';

export const LoginView = () => {
  const { 
    login, 
    loginAsResident, 
    loginAsAdmin, 
    openPoster, 
    openHomeConsole, 
    openMall 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) setError(res.message);
  };

  const fillResident = () => {
    setEmail(DEMO_ACCOUNTS.resident.email);
    setPassword(DEMO_ACCOUNTS.resident.password);
    setError('');
  };

  const fillAdmin = () => {
    setEmail(DEMO_ACCOUNTS.admin.email);
    setPassword(DEMO_ACCOUNTS.admin.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-between selection:bg-livin-navy selection:text-white text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-white uppercase tracking-wider">{PRODUCT_INFO.track}</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-300 font-semibold">{PRODUCT_INFO.name} 2.0</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openHomeConsole}
              className="flex items-center gap-1 text-rose-400 hover:text-white transition-colors font-bold"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Console SOS (No-Smartphone Demo)</span>
            </button>
            <button
              onClick={openMall}
              className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mall Preview</span>
            </button>
            <button
              onClick={openPoster}
              className="flex items-center gap-1 text-sky-200 hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Editorial Poster (3:4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto p-6 sm:p-8 my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-livin-navy text-white shadow-md mb-4">
              <Building2 className="w-8 h-8 text-sky-200" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              UrbanHub-X
            </h1>
            <p className="mt-2 text-sm text-slate-700 font-bold">
              “{PRODUCT_INFO.tagline}”
            </p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Connecting NFC IDs, Resident App, and Property Management for inclusive community safety.
            </p>
          </div>

          {/* Judge Demo Fast Access (Prompt 2.0 Section 2 Requirement) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              One-Click Judge Demo Portals
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={loginAsResident}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-50 hover:bg-sky-100 text-livin-navy font-bold text-xs rounded-xl border border-sky-200 transition-all shadow-xs group"
              >
                <User className="w-4 h-4 text-livin-accent" />
                <span>Try Resident / Family Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={loginAsAdmin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Try Property Admin Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                Or Sign In with Demo Account
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@livincare.demo or admin@livincare.demo"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold text-xs rounded-xl shadow-md transition-colors mt-1"
            >
              Sign In to Demo
            </button>
          </form>

          {/* Demo account quick fill hints */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Resident / Family:</span>
              <button 
                type="button" 
                onClick={fillResident}
                className="text-livin-accent hover:underline font-mono"
              >
                resident@livincare.demo (Resident123!)
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Property Admin:</span>
              <button 
                type="button" 
                onClick={fillAdmin}
                className="text-livin-accent hover:underline font-mono"
              >
                admin@livincare.demo (Admin123!)
              </button>
            </div>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-slate-400 text-[11px]">
        UrbanHub-X 2.0 &copy; 2026 Sime Darby Property Hackathon. All rights reserved.
      </footer>
    </div>
  );
};
