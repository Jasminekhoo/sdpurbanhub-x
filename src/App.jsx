import React from 'react';
import { useNightSafe } from './context/NightSafeContext';
import { NightSafeLoginView } from './views/NightSafeLoginView';
import { ResidentContainer } from './views/resident/ResidentContainer';
import { SecurityDashboard } from './views/security/SecurityDashboard';
import { PropertyDashboard } from './views/property/PropertyDashboard';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const { role } = useNightSafe();

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-sans selection:bg-[#2864A6] selection:text-white">
      {/* Main Single App View based on active role */}
      <div className="flex-1 flex flex-col">
        {(role === 'select' || role === 'login') && <NightSafeLoginView />}
        {role === 'resident' && (
          <ErrorBoundary>
            <ResidentContainer />
          </ErrorBoundary>
        )}
        {role === 'security' && (
          <ErrorBoundary>
            <SecurityDashboard />
          </ErrorBoundary>
        )}
        {role === 'property' && (
          <ErrorBoundary>
            <PropertyDashboard />
          </ErrorBoundary>
        )}
      </div>

      {/* Real-time Notification Toast */}
      <Toast />
    </div>
  );
}

export default App;

