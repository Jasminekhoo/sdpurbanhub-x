import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/Header';
import { 
  Home, 
  AlertTriangle, 
  CreditCard, 
  Users, 
  ClipboardList, 
  User, 
  Wrench,
  Radio,
  ShoppingBag,
  Sparkles,
  ArrowRightLeft,
  LogOut,
  X,
  ShieldCheck,
  Building2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const ResidentLayout = ({ children }) => {
  const { 
    currentRoute, 
    navigate, 
    openHomeConsole, 
    openMall, 
    openPoster, 
    loginAsAdmin, 
    logout,
    currentUser,
    residentCard,
    requests,
    familyDependants,
    isMobileMenuOpen,
    closeMobileMenu
  } = useApp();

  const activeRequestsCount = requests.filter(
    r => r.residentName === (currentUser?.name || 'Alex Chen') && r.status !== 'Resolved' && r.status !== 'Cancelled'
  ).length;

  const navItems = [
    { 
      path: '/resident/home', 
      label: 'Home', 
      icon: Home,
      badge: null
    },
    { 
      path: '/resident/request-help', 
      label: 'Request Help', 
      icon: AlertTriangle, 
      highlight: true,
      badge: 'SOS',
      badgeColor: 'bg-rose-600 text-white animate-pulse'
    },
    { 
      path: '/resident/card', 
      label: 'My NFC Card', 
      icon: CreditCard,
      badge: residentCard.status === 'Active' ? 'Active' : 'Blocked',
      badgeColor: residentCard.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
    },
    { 
      path: '/resident/family', 
      label: 'Family Care', 
      icon: Users,
      badge: `${familyDependants.length} Linked`,
      badgeColor: 'bg-sky-100 text-livin-navy'
    },
    { 
      path: '/resident/requests', 
      label: 'My Requests', 
      icon: ClipboardList,
      badge: activeRequestsCount > 0 ? activeRequestsCount : null,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    { 
      path: '/resident/report-issue', 
      label: 'Report an Issue', 
      icon: Wrench,
      badge: null
    },
    { 
      path: '/resident/profile', 
      label: 'Profile & Privacy', 
      icon: User,
      badge: null
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <Header />

      {/* Main Container: Adaptive for Website, Tablet, and Phone */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* ========================================================
            DESKTOP & TABLET SIDEBAR (Mirrors Admin Console)
            Visible on md: (Tablets in landscape/portrait) and lg: (Desktop/Website)
           ======================================================== */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm sticky top-20">
            
            {/* Resident Profile Card Widget */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-livin-navy text-white flex items-center justify-center font-bold text-base shadow-xs">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Resident Portal
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                  {currentUser?.name || 'Alex Chen'}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  {currentUser?.unit || 'Tower B · Unit 12-08'}
                </p>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-livin-navy text-white shadow-xs'
                        : item.highlight
                        ? 'text-rose-600 hover:bg-rose-50 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${
                        isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-500 group-hover:text-slate-800'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Action Buttons for Judges & Demos */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={openHomeConsole}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-colors"
                title="Launch No-Smartphone Home Console (Storyline 1)"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Home Console SOS</span>
              </button>

              <button
                onClick={loginAsAdmin}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-livin-navy text-xs font-semibold border border-sky-200 transition-colors"
                title="Switch directly to Admin Console"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to Admin Console</span>
              </button>

              <button
                onClick={openPoster}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Editorial Poster (3:4)</span>
              </button>
            </div>

            {/* Logout Session */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Resident App</span>
              </button>
            </div>

          </div>

          {/* Connected Network Indicator (Tablet/Website) */}
          <div className="bg-slate-900 text-slate-300 rounded-3xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Community Safety Hub
              </span>
              <span className="text-[10px] font-mono text-slate-400">ONLINE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Connected to Aster Residence dispatch hub. Proactive care monitoring active.
            </p>
          </div>
        </aside>

        {/* ========================================================
            TABLET SUB-BAR: Horizontal Quick Tabs (640px to 1024px)
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
                      : item.highlight
                      ? 'bg-rose-50 text-rose-700'
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
            MAIN CONTENT VIEWPORT
           ======================================================== */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {children}
        </main>

      </div>

      {/* ========================================================
          SLIDE-OVER MOBILE & TABLET DRAWER
          Opens when user clicks hamburger menu on mobile/tablet
         ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-slide-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-livin-navy text-white flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-5 h-5 text-sky-200" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">UrbanHub-X</span>
                    <span className="text-[10px] font-mono text-slate-400">Resident Portal</span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card snippet */}
              <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-livin-navy text-white flex items-center justify-center font-bold text-sm">
                  {currentUser?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{currentUser?.name || 'Alex Chen'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser?.unit || 'Tower B · Unit 12-08'}</div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Card: {residentCard.status}</div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
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
                          : item.highlight
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Triggers */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    openHomeConsole();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Home Console SOS</span>
                </button>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    openMall();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mall Concept Preview</span>
                </button>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    loginAsAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-50 text-livin-navy text-xs font-semibold border border-sky-200"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Switch to Admin Console</span>
                </button>
              </div>
            </div>

            {/* Logout in Drawer */}
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

      {/* ========================================================
          MOBILE BOTTOM NAVIGATION (Phones: < 640px)
         ======================================================== */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 md:hidden">
        <div className="flex items-center justify-around h-16 px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive 
                    ? 'text-livin-navy font-bold' 
                    : item.highlight 
                    ? 'text-rose-600 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[9.5px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};
