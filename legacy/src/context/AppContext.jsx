import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEMO_ACCOUNTS, 
  INITIAL_REQUESTS, 
  STAFF_RESPONDERS, 
  FAMILY_DEPENDANTS,
  INITIAL_FACILITY_REPORTS,
  NFC_RECORDS,
  RESIDENT_SUPPORT_LIST,
  PRODUCT_INFO
} from '../data/seedData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user & role
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('livin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('livin_role') || null;
  });

  // Current route
  const [currentRoute, setCurrentRoute] = useState(() => {
    const saved = localStorage.getItem('livin_route');
    if (saved) return saved;
    const role = localStorage.getItem('livin_role');
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'user') return '/resident/home';
    return '/login';
  });

  // Requests state
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('livin_requests_2');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Facility Reports state
  const [facilityReports, setFacilityReports] = useState(() => {
    const saved = localStorage.getItem('livin_facility_reports_2');
    return saved ? JSON.parse(saved) : INITIAL_FACILITY_REPORTS;
  });

  // Resident NFC Card state
  const [residentCard, setResidentCard] = useState(() => {
    const saved = localStorage.getItem('livin_card_2');
    return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.resident.card;
  });

  // NFC Records for admin
  const [nfcRecords, setNfcRecords] = useState(() => {
    const saved = localStorage.getItem('livin_nfc_records_2');
    return saved ? JSON.parse(saved) : NFC_RECORDS;
  });

  // Family Dependants
  const [familyDependants, setFamilyDependants] = useState(() => {
    const saved = localStorage.getItem('livin_dependants_2');
    return saved ? JSON.parse(saved) : FAMILY_DEPENDANTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('livin_notifications_2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: 'Home Console SOS Acknowledged',
        message: 'Security dispatched Nurse Sarah for Robert Chen (Unit 12-08). Status: Assistance on the way.',
        timestamp: '17 Oct, 11:24 AM',
        unread: true,
        type: 'sos'
      },
      {
        id: 'notif-2',
        title: 'Welcome to Aster Residence',
        message: 'UrbanHub-X proactive community safety & family care system is active.',
        timestamp: '17 Oct, 08:00 AM',
        unread: false,
        type: 'system'
      }
    ];
  });

  // Unusual card activity banner state
  const [unusualActivityEvent, setUnusualActivityEvent] = useState(null);

  // Home Console modal state
  const [isHomeConsoleOpen, setIsHomeConsoleOpen] = useState(false);

  // Mall Preview Modal state
  const [isMallOpen, setIsMallOpen] = useState(false);

  // Poster Modal state (Prompt 1)
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  // Mobile Drawer navigation state (adaptive across phone, tablet, website)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Toast
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem('livin_user', JSON.stringify(currentUser));
    else localStorage.removeItem('livin_user');
  }, [currentUser]);

  useEffect(() => {
    if (currentRole) localStorage.setItem('livin_role', currentRole);
    else localStorage.removeItem('livin_role');
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('livin_route', currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    localStorage.setItem('livin_requests_2', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('livin_facility_reports_2', JSON.stringify(facilityReports));
  }, [facilityReports]);

  useEffect(() => {
    localStorage.setItem('livin_card_2', JSON.stringify(residentCard));
  }, [residentCard]);

  useEffect(() => {
    localStorage.setItem('livin_nfc_records_2', JSON.stringify(nfcRecords));
  }, [nfcRecords]);

  useEffect(() => {
    localStorage.setItem('livin_dependants_2', JSON.stringify(familyDependants));
  }, [familyDependants]);

  useEffect(() => {
    localStorage.setItem('livin_notifications_2', JSON.stringify(notifications));
  }, [notifications]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Safe navigation with strict cross-role protection
  const navigate = (path) => {
    setIsMobileMenuOpen(false);

    if (!currentRole && path !== '/login') {
      setCurrentRoute('/login');
      return;
    }

    if (currentRole === 'user' && path.startsWith('/admin')) {
      showToast('Restricted: Resident accounts cannot access Admin Console.', 'warning');
      setCurrentRoute('/resident/home');
      return;
    }

    if (currentRole === 'admin' && path.startsWith('/resident')) {
      showToast('Restricted: Admin accounts use the Operations Console.', 'warning');
      setCurrentRoute('/admin/dashboard');
      return;
    }

    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication
  const login = (email, password) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed === DEMO_ACCOUNTS.resident.email && password === DEMO_ACCOUNTS.resident.password) {
      setCurrentUser(DEMO_ACCOUNTS.resident);
      setCurrentRole('user');
      setCurrentRoute('/resident/home');
      showToast('Welcome back, Alex. Signed in to Resident App.', 'success');
      return { success: true };
    }
    if (trimmed === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
      setCurrentUser(DEMO_ACCOUNTS.admin);
      setCurrentRole('admin');
      setCurrentRoute('/admin/dashboard');
      showToast('Welcome Sarah Wong. Signed in to Property Admin Dashboard.', 'success');
      return { success: true };
    }
    return { 
      success: false, 
      message: 'Invalid credentials. Click "Try Resident / Family Demo" or "Try Property Admin Demo".' 
    };
  };

  const loginAsResident = () => {
    setCurrentUser(DEMO_ACCOUNTS.resident);
    setCurrentRole('user');
    setCurrentRoute('/resident/home');
    showToast('Resident / Family Demo Active: Alex Chen (Aster Residence)', 'success');
  };

  const loginAsAdmin = () => {
    setCurrentUser(DEMO_ACCOUNTS.admin);
    setCurrentRole('admin');
    setCurrentRoute('/admin/dashboard');
    showToast('Admin Console Demo Active: Sarah Wong (Operations Lead)', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCurrentRoute('/login');
    showToast('Logged out successfully.', 'info');
  };

  // Add notification
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      unread: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ====================================================================
  // CREATE REQUEST (CORE CARE FLOW - SECTION 4.C)
  // Status flow: Received -> Assigned -> Assistance on the way -> Resolved
  // ====================================================================
  const createRequest = ({ 
    who = 'Myself', 
    type = 'SOS', 
    category = 'Medical or urgent assistance', 
    location = 'Home unit', 
    description = '', 
    priority = 'Urgent',
    source = 'Resident App'
  }) => {
    const nextNum = requests.length + 1002;
    const newId = `LC-${nextNum}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let personName = who;
    if (who === 'Elderly resident') personName = 'Robert Chen (Senior Dependant)';
    else if (who === 'Child') personName = 'Chloe Chen (Child)';
    else if (who === 'Person with disability (OKU)') personName = 'Encik Harun (OKU Resident)';
    else if (who === 'Myself') personName = currentUser?.name || 'Alex Chen';

    const newRequest = {
      id: newId,
      type,
      category,
      who,
      personName,
      location: `${location} (${currentUser?.unit || 'Tower B · Unit 12-08'})`,
      description: description || `Assistance requested for ${who}: ${category}.`,
      priority,
      residentName: currentUser ? currentUser.name : 'Alex Chen',
      unit: currentUser ? currentUser.unit : 'Tower B · Unit 12-08',
      createdAt: now.toISOString(),
      status: 'Received',
      assignedTo: 'Unassigned',
      source,
      activityHistory: [
        {
          action: 'Case Received',
          actorRole: source,
          timestamp: formattedDate,
          note: `Help request dispatched for ${who} at ${location}.`
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);

    // Push notification to Family Care
    addNotification(
      `Help Request Dispatched (${newId})`,
      `${personName} at ${location}: ${category}. Status is Received.`,
      priority === 'Urgent' ? 'sos' : 'info'
    );

    showToast(`Help request ${newId} sent to Property Management!`, 'success');
    return newRequest;
  };

  // ====================================================================
  // STORYLINE 1: NO-SMARTPHONE HOME CONSOLE SOS (SECTION 4.E & 6.1)
  // ====================================================================
  const triggerConsoleSos = () => {
    const created = createRequest({
      who: 'Elderly resident',
      type: 'SOS',
      category: 'Medical or urgent assistance',
      location: 'Home unit (Kitchen area)',
      description: 'Elderly resident Robert Chen pressed Home Console physical SOS button.',
      priority: 'Urgent',
      source: 'Home Console / Help Point'
    });

    addNotification(
      '⚠️ Urgent: Home Console SOS Alert Triggered',
      'Robert Chen (Elderly parent) pressed the physical Home Console SOS button in Unit 12-08.',
      'sos'
    );

    showToast('🚨 Home Console SOS Dispatched to Aster Residence Guardhouse!', 'warning');
    return created;
  };

  // ====================================================================
  // UPDATE STATUS & ASSIGNMENT (SECTION 4.C, 5.B, 6.1)
  // Statuses: Received -> Assigned -> Assistance on the way -> Resolved
  // ====================================================================
  const updateRequestStatus = (requestId, newStatus, assignedTo, note) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let updatedReq = null;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const historyEntry = {
        action: `Status Updated to ${newStatus}`,
        actorRole: currentRole === 'admin' ? 'Property Admin Console' : `Resident (${currentUser?.name || 'Alex'})`,
        timestamp: formattedDate,
        note: note || (assignedTo ? `Assigned responder: ${assignedTo}` : `Status advanced to ${newStatus}`)
      };

      updatedReq = {
        ...req,
        status: newStatus,
        assignedTo: assignedTo !== undefined ? assignedTo : req.assignedTo,
        activityHistory: [historyEntry, ...req.activityHistory]
      };
      return updatedReq;
    }));

    // In-app notification to resident/family view
    if (newStatus === 'Assistance on the way') {
      addNotification(
        `🚨 Assistance on the Way (${requestId})`,
        `${assignedTo || 'Response officer'} is en route to ${updatedReq?.location || 'your unit'}.`,
        'sos'
      );
    } else if (newStatus === 'Resolved') {
      addNotification(
        `✓ Request Resolved (${requestId})`,
        `Assistance case for ${updatedReq?.who || 'resident'} was resolved.`,
        'success'
      );
    } else if (newStatus === 'Assigned') {
      addNotification(
        `Case Assigned (${requestId})`,
        `Assigned to ${assignedTo}.`,
        'info'
      );
    }

    showToast(`Case ${requestId} updated to "${newStatus}"`, 'success');
  };

  // Acknowledge alert
  const acknowledgeAlert = (requestId) => {
    updateRequestStatus(
      requestId, 
      'Assigned', 
      'Officer Farhan (Security Lead)', 
      'Duty Manager acknowledged alert and dispatched security unit.'
    );
  };

  // Cancel request (Section 8 requirement)
  const cancelRequest = (requestId) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status: 'Cancelled',
        activityHistory: [
          {
            action: 'Request Cancelled by Resident',
            actorRole: 'Resident App',
            timestamp: formattedDate,
            note: 'Resident confirmed accidental trigger; audit log retained.'
          },
          ...req.activityHistory
        ]
      };
    }));
    showToast(`Request ${requestId} cancelled. Audit log retained.`, 'info');
  };

  // ====================================================================
  // STORYLINE 3: SUSPICIOUS NFC CARD USE (SECTION 4.B & 6.3)
  // ====================================================================
  const simulateUnusualCardTap = () => {
    setUnusualActivityEvent({
      id: `EVT-${Date.now().toString().slice(-4)}`,
      location: 'Tower B Perimeter Turnstile #2',
      time: 'Just now (Off-schedule: 02:40 AM)',
      cardToken: residentCard.token || 'TK-8821-99B4'
    });
    showToast('Unusual NFC card activity detected. Check resident confirmation prompt.', 'warning');
  };

  const handleConfirmUnusualTap = (isMe) => {
    if (isMe) {
      // Confirmed as me
      setUnusualActivityEvent(null);
      showToast('Activity confirmed. Card remains active.', 'success');
    } else {
      // Not me -> Freeze Card immediately & create admin security case
      setResidentCard(prev => ({
        ...prev,
        status: 'Temporarily Blocked'
      }));

      // Update NFC records list
      setNfcRecords(prev => prev.map(rec => 
        rec.cardId === 'TK-8821-99B4' 
          ? { ...rec, status: 'Temporarily Blocked', lastEvent: 'Blocked: Unusual activity unconfirmed by resident' }
          : rec
      ));

      // Create Admin security case
      const secCase = {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        type: 'Security',
        category: 'Unusual card activity / Card frozen',
        who: 'Myself',
        personName: 'Alex Chen',
        location: 'Tower B Perimeter Turnstile #2',
        description: 'Resident flagged unusual card tap at 02:40 AM and froze card TK-8821-99B4.',
        priority: 'Urgent',
        residentName: 'Alex Chen',
        unit: 'Tower B · Unit 12-08',
        createdAt: new Date().toISOString(),
        status: 'Received',
        assignedTo: 'Officer Farhan (Security Lead)',
        source: 'NFC Security Subsystem',
        activityHistory: [
          {
            action: 'Card Temporarily Blocked',
            actorRole: 'Resident App (Alex Chen)',
            timestamp: 'Just now',
            note: 'Resident selected "No, not me — Freeze Card". Access suspended.'
          }
        ]
      };

      setRequests(prev => [secCase, ...prev]);

      addNotification(
        '🔒 NFC Card Temporarily Blocked',
        'Your NFC Card TK-8821-99B4 is frozen. Security case logged for management inspection.',
        'warning'
      );

      setUnusualActivityEvent(null);
      showToast('Card Temporarily Blocked. High-priority security case logged.', 'error');
    }
  };

  const unfreezeCard = () => {
    setResidentCard(prev => ({
      ...prev,
      status: 'Active'
    }));
    setNfcRecords(prev => prev.map(rec => 
      rec.cardId === 'TK-8821-99B4' 
        ? { ...rec, status: 'Active', lastEvent: 'Reactivated by Resident Demo' }
        : rec
    ));
    showToast('NFC Card unfreezed and reactivated.', 'success');
  };

  // Facility Issue Report creation (Section 4.F)
  const reportFacilityIssue = ({ category, location, description }) => {
    const newId = `FAC-${facilityReports.length + 202}`;
    const newReport = {
      id: newId,
      category,
      location,
      description,
      status: 'In Progress',
      reportedBy: currentUser?.name || 'Alex Chen',
      reportedAt: 'Just now'
    };

    setFacilityReports(prev => [newReport, ...prev]);

    // Also add to main admin requests so everything is synchronized
    createRequest({
      who: 'Myself',
      type: 'Facility',
      category,
      location,
      description,
      priority: 'Normal',
      source: 'Facility Report'
    });

    showToast(`Facility issue ${newId} logged for property maintenance.`, 'success');
    return newReport;
  };

  // Reset demo
  const resetDemoData = () => {
    setRequests(INITIAL_REQUESTS);
    setResidentCard(DEMO_ACCOUNTS.resident.card);
    setNfcRecords(NFC_RECORDS);
    setFamilyDependants(FAMILY_DEPENDANTS);
    setFacilityReports(INITIAL_FACILITY_REPORTS);
    setUnusualActivityEvent(null);
    localStorage.removeItem('livin_requests_2');
    localStorage.removeItem('livin_card_2');
    localStorage.removeItem('livin_nfc_records_2');
    localStorage.removeItem('livin_dependants_2');
    localStorage.removeItem('livin_facility_reports_2');
    localStorage.removeItem('livin_notifications_2');
    showToast('Demo data reset to clean Hackathon 2.0 state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentRoute,
        requests,
        facilityReports,
        residentCard,
        nfcRecords,
        familyDependants,
        notifications,
        unusualActivityEvent,
        residentSupportList: RESIDENT_SUPPORT_LIST,
        staffResponders: STAFF_RESPONDERS,
        productInfo: PRODUCT_INFO,
        isHomeConsoleOpen,
        isMallOpen,
        isPosterOpen,
        toast,
        isMobileMenuOpen,
        openMobileMenu: () => setIsMobileMenuOpen(true),
        closeMobileMenu: () => setIsMobileMenuOpen(false),
        toggleMobileMenu: () => setIsMobileMenuOpen(prev => !prev),
        navigate,
        login,
        loginAsResident,
        loginAsAdmin,
        logout,
        createRequest,
        triggerConsoleSos,
        updateRequestStatus,
        acknowledgeAlert,
        cancelRequest,
        simulateUnusualCardTap,
        handleConfirmUnusualTap,
        unfreezeCard,
        reportFacilityIssue,
        resetDemoData,
        showToast,
        openHomeConsole: () => setIsHomeConsoleOpen(true),
        closeHomeConsole: () => setIsHomeConsoleOpen(false),
        openMall: () => setIsMallOpen(true),
        closeMall: () => setIsMallOpen(false),
        openPoster: () => setIsPosterOpen(true),
        closePoster: () => setIsPosterOpen(false)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
