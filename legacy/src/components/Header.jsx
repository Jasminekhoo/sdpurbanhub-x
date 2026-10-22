import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  LogOut, 
  RotateCcw, 
  Sparkles, 
  ArrowRightLeft,
  Bell,
  ShoppingBag,
  Radio,
  X,
  Menu
} from 'lucide-react';

export const Header = () => {
  const { 
    currentUser, 
    currentRole, 
    logout, 
    navigate, 
    loginAsResident, 
    loginAsAdmin, 
    resetDemoData, 
    openPoster,
    openHomeConsole,
    openMall,
    notifications,
    productInfo,
    toggleMobileMenu
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Banner with updated Hackathon Tagline */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white uppercase tracking-wider">SIME DARBY PROPERTY — PEOPLE TRACK</span>
          <span className="text-slate-500">|</span>
          <span className="text-sky-300 font-semibold hidden md:inline">
            “{productInfo.tagline}”
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Concept / Tool buttons */}
          <button
            onClick={openHomeConsole}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
            title="Open No-Smartphone Home Console (Storyline 1 Demo)"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Home Console SOS</span>
          </button>

          <button
            onClick={openMall}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium transition-colors"
            title="Open Mall (Concept Preview)"
          >
            <ShoppingBag className="w-3 h-3" />
            <span className="hidden sm:inline">Mall Preview</span>
          </button>

          {/* Quick role switcher */}
          {currentRole === 'user' ? (
            <button
              onClick={loginAsAdmin}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-livin-navy hover:bg-livin-navy-light text-white font-medium transition-colors"
              title="Switch directly to Admin Console"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Admin Console</span>
            </button>
          ) : (
            <button
              onClick={loginAsResident}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-livin-accent hover:bg-blue-600 text-white font-medium transition-colors"
              title="Switch directly to Resident App"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Resident App</span>
            </button>
          )}

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile/Tablet menu toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => navigate(currentRole === 'admin' ? '/admin/dashboard' : '/resident/home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-livin-navy text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-livin-navy-dark transition-colors">
              <Building2 className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-livin-navy transition-colors">
                  UrbanHub-X
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentRole === 'admin' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : 'bg-sky-100 text-livin-navy border border-sky-200'
                }`}>
                  {currentRole === 'admin' ? 'Admin / Security Console' : 'Resident & Family App'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Aster Residence · Inclusive Proactive-Care Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-900">Notifications &amp; Care Alerts</span>
                  <button 
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-xl border ${
                        notif.type === 'sos' ? 'bg-rose-50 border-rose-200 text-rose-950' :
                        notif.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                        'bg-slate-50 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span>{notif.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-snug">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prompt 1 Editorial Poster Button */}
          <button
            onClick={openPoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:border-livin-navy hover:text-livin-navy bg-white text-xs font-medium transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Editorial Poster</span>
            <span className="px-1 py-0.2 rounded text-[10px] font-mono bg-slate-100">3:4</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-none">
                {currentUser?.name || 'Alex Chen'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                {currentRole === 'admin' ? 'Operations Console' : currentUser?.unit || 'Resident'}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Logout and clear session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
