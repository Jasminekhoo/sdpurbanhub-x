import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  CreditCard, 
  Wrench, 
  Leaf, 
  ShieldCheck, 
  Radio, 
  LogOut, 
  ArrowRightLeft,
  Sparkles,
  X,
  Building2
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { 
    currentRoute, 
    navigate, 
    logout, 
    loginAsResident, 
    openHomeConsole, 
    openPoster, 
    requests, 
    facilityReports,
    currentUser,
    isMobileMenuOpen,
    closeMobileMenu
  } = useApp();

  const urgentCount = requests.filter(r => r.priority === 'Urgent' && r.status !== 'Resolved' && r.status !== 'Cancelled').length;

  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Overview', 
      icon: LayoutDashboard,
      badge: null 
    },
    { 
      path: '/admin/requests', 
      label: 'Alerts & Cases', 
      icon: ClipboardList,
      badge: urgentCount > 0 ? urgentCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { 
      path: '/admin/residents', 
      label: 'Residents (Support)', 
      icon: Users,
      badge: null
    },
    { 
      path: '/admin/nfc-security', 
      label: 'NFC Security', 
      icon: CreditCard,
      badge: null
    },
    { 
      path: '/admin/facilities', 
      label: 'Facility Reports', 
      icon: Wrench,
      badge: facilityReports.filter(f => f.status !== 'Resolved').length || null
    },
    { 
      path: '/admin/sustainability', 
      label: 'Community Impact', 
      icon: Leaf,
      badge: 'KPI'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* ========================================================
            DESKTOP & TABLET SIDEBAR (>= 768px)
           ======================================================== */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm sticky top-20">
            
            {/* Header role */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Property Admin Console
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Aster Residence
                </h3>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-livin-navy text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Demo Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={openHomeConsole}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                title="Launch No-Smartphone Home Console for elderly resident testing"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Test Console SOS</span>
              </button>

              <button
                onClick={loginAsResident}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-livin-navy text-xs font-semibold border border-sky-200 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to Resident App</span>
              </button>
            </div>

            {/* Logout */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-300 rounded-3xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Console Online
              </span>
              <span className="text-[10px] font-mono text-slate-400">v2.0</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Connected to Aster Residence dispatch hub. Cross-role live synchronization active.
            </p>
          </div>
        </aside>

        {/* ========================================================
            TABLET / MOBILE SUB-BAR: Horizontal Quick Tabs (< 768px)
           ======================================================== */}
        <div className="block md:hidden overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-livin-navy text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            MAIN CONTENT AREA
           ======================================================== */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* ========================================================
          SLIDE-OVER MOBILE DRAWER FOR ADMIN
         ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div 
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">Admin Console</span>
                    <span className="text-[10px] font-mono text-slate-400">Aster Residence</span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5 my-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-livin-navy text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    openHomeConsole();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Test Console SOS</span>
                </button>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    loginAsResident();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-50 text-livin-navy text-xs font-semibold border border-sky-200"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Switch to Resident App</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
