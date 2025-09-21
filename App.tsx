import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOrder } from './hooks/useOrder';
import LoginSelectionScreen from './components/LoginSelectionScreen';
import LoginScreen from './components/LoginScreen';
import StaffDashboard from './components/StaffDashboard';
import ManagerView from './components/ManagerView';
import Header from './components/Header';
import PaymentModal from './components/PaymentModal';
import ConfirmationModal from './components/ConfirmationModal';
import { INITIAL_USERS, INITIAL_MENU_ITEMS, TAX_RATE, DEFAULT_LOGO_URL, INITIAL_BRANCHES } from './constants';
import type { User, CompletedOrder, MenuItem, OrderChannel, Expense, DailySession, Branch } from './types';
import CashierOpeningModal from './components/CashierOpeningModal';
import ExpenseModal from './components/ExpenseModal';
import CashierClosingModal from './components/CashierClosingModal';
import BranchSetupModal from './components/BranchSetupModal';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App: React.FC = () => {
  const [loginView, setLoginView] = useState<'selection' | 'staff' | 'owner'>('selection');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [language, setLanguage] = useState<'en' | 'id'>('id');
  const [orderChannel, setOrderChannel] = useState<OrderChannel>('dine_in');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<CompletedOrder | null>(null);


  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '' });
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // New Modals for Cashier Closing Feature
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);


  // --- Persisted State ---
  // Helper to load state from localStorage, with a default value
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          // The correct format is JSON.
          return JSON.parse(saved);
        } catch (e) {
          // Fallback for legacy data where logo/qris URLs were stored as raw strings.
          if (key === 'nobapos-logo' || key === 'nobapos-qris') {
            console.warn(`Legacy data found for ${key}. Using raw value.`);
            return saved as T;
          }
          // For other keys, a parse error is a real issue.
          console.error(`Failed to parse state for key "${key}" from localStorage`, e);
        }
      }
    } catch (e) {
      // This outer catch is for potential localStorage.getItem errors.
      console.error(`Failed to load state for key "${key}" from localStorage`, e);
    }
    return defaultValue;
  };

  // State management with persistence to localStorage
  const [users, setUsers] = useState<User[]>(() => loadState('nobapos-users', INITIAL_USERS));
  const [branches, setBranches] = useState<Branch[]>(() => loadState('nobapos-branches', INITIAL_BRANCHES));
  const [currentBranchId, setCurrentBranchId] = useState<number | null>(() => loadState('nobapos-device-branchId', null));
  const [canSupervisorManage, setCanSupervisorManage] = useState<boolean>(() => loadState('nobapos-canSupervisorManage', false));
  const [logoUrl, setLogoUrl] = useState<string | null>(() => loadState('nobapos-logo', DEFAULT_LOGO_URL));
  const [qrisImageUrl, setQrisImageUrl] = useState<string | null>(() => loadState('nobapos-qris', null));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadState('nobapos-menuItems', INITIAL_MENU_ITEMS));
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>(() => loadState('nobapos-completedOrders', []));
  const [dailySession, setDailySession] = useState<DailySession | null>(() => loadState('nobapos-daily-session', null));


  // Effects to save state changes back to localStorage
  useEffect(() => { localStorage.setItem('nobapos-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nobapos-branches', JSON.stringify(branches)); }, [branches]);
  useEffect(() => { localStorage.setItem('nobapos-device-branchId', JSON.stringify(currentBranchId)); }, [currentBranchId]);
  useEffect(() => { localStorage.setItem('nobapos-canSupervisorManage', JSON.stringify(canSupervisorManage)); }, [canSupervisorManage]);
  useEffect(() => { if(logoUrl) localStorage.setItem('nobapos-logo', JSON.stringify(logoUrl)); else localStorage.removeItem('nobapos-logo') }, [logoUrl]);
  useEffect(() => { if(qrisImageUrl) localStorage.setItem('nobapos-qris', JSON.stringify(qrisImageUrl)); else localStorage.removeItem('nobapos-qris') }, [qrisImageUrl]);
  useEffect(() => { localStorage.setItem('nobapos-menuItems', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('nobapos-completedOrders', JSON.stringify(completedOrders)); }, [completedOrders]);
  useEffect(() => { if (dailySession) localStorage.setItem('nobapos-daily-session', JSON.stringify(dailySession)); else localStorage.removeItem('nobapos-daily-session') }, [dailySession]);
  
  const currentBranch = useMemo(() => branches.find(b => b.id === currentBranchId), [branches, currentBranchId]);

  const {
    orderItems,
    addToOrder,
    updateQuantity,
    clearOrder,
    subtotal,
    updatePricesForChannel,
    discount,
    applyDiscount,
    removeDiscount,
    discountAmount,
    tax,
    total,
  } = useOrder();
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    
    if (user.role === 'owner') return; // Owner doesn't need a branch set for their device or shifts.

    if (!currentBranchId) {
        setIsBranchModalOpen(true);
        return;
    }
    
    // Only cashiers and supervisors have shifts that need opening.
    if (user.role === 'cashier' || user.role === 'supervisor') {
        const todayStr = formatDate(new Date());

        // A session for today exists if dailySession is not null, and its date matches today.
        const sessionExistsForToday = !!(dailySession && dailySession.date === todayStr && dailySession.branchId === currentBranchId);

        // If no session exists for today, we need to show the modal to create one.
        // This covers both cases: no session at all, or a session from a previous day.
        if (!sessionExistsForToday) {
            setIsOpeningModalOpen(true);
        }
        // If a session for today DOES exist, we do nothing, and the user resumes their shift.
    }
  };
  
  const handleSetCurrentBranch = (branchId: number) => {
    setCurrentBranchId(branchId);
    setIsBranchModalOpen(false);
    // After setting the branch, re-evaluate if the opening modal needs to be shown
    if (currentUser && (currentUser.role === 'cashier' || currentUser.role === 'supervisor')) {
        const todayStr = formatDate(new Date());
        const sessionExistsForToday = !!(dailySession && dailySession.date === todayStr && dailySession.branchId === branchId);
        if (!sessionExistsForToday) {
            setIsOpeningModalOpen(true);
        }
    }
  };


  const handleStartShift = (initialCash: number) => {
    if (!currentUser || !currentBranchId) return;
    const now = new Date();
    const todayStr = formatDate(now);
    setDailySession({ 
        date: todayStr, 
        startTime: now.toISOString(),
        initialCash: initialCash, 
        expenses: [],
        cashierId: currentUser.id,
        cashierName: currentUser.name,
        branchId: currentBranchId
    });
    setIsOpeningModalOpen(false);
  };

  const handleAddExpense = (description: string, amount: number) => {
    if (dailySession) {
        const newExpense: Expense = {
            id: Date.now(),
            description,
            amount,
            timestamp: new Date().toISOString()
        };
        setDailySession(prev => prev ? ({ ...prev, expenses: [...prev.expenses, newExpense] }) : null);
        setIsExpenseModalOpen(false);
    }
  };
  
  const handleCloseShift = () => {
    setIsClosingModalOpen(false);
    setDailySession(null); 
    // Automatically log out the user after closing the shift
    setCurrentUser(null);
    setLoginView('selection');
    clearOrder();
  };

  const handleAddToOrder = (item: MenuItem) => {
      addToOrder(item, orderChannel);
  };
  
  const handleOrderChannelChange = (channel: OrderChannel) => {
    updatePricesForChannel(channel, menuItems);
    setOrderChannel(channel);
  };

  const handleStaffLogin = (pin: string): { success: boolean; message?: string } => {
    const user = users.find(u => u.pin === pin && (u.role === 'cashier' || u.role === 'supervisor'));
    if (!user) {
      return { success: false, message: 'PIN tidak valid.' };
    }
    
    // Branch must be set before checking for active sessions
    if (!currentBranchId) {
        handleLoginSuccess(user);
        return { success: true };
    }

    const todayStr = formatDate(new Date());
    const sessionExistsForToday = !!(dailySession && dailySession.date === todayStr && dailySession.branchId === currentBranchId);

    // If a session exists for today AND it belongs to a different user, block login.
    if (sessionExistsForToday && dailySession.cashierId !== user.id) {
        return { 
            success: false, 
            message: `Sesi aktif untuk ${dailySession.cashierName}. Harap tutup sesi tersebut.` 
        };
    }
    
    // If we pass the check, login is successful.
    handleLoginSuccess(user);
    return { success: true };
  };

  const handleOwnerLogin = (pin: string): { success: boolean; message?: string } => {
    const user = users.find(u => u.pin === pin && u.role === 'owner');
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: 'PIN tidak valid.' };
  };

  const handleLogout = () => {
    const performLogout = () => {
      setCurrentUser(null);
      setLoginView('selection');
      clearOrder();
    };

    setConfirmModalContent({
      title: language === 'id' ? 'Konfirmasi Keluar' : 'Logout Confirmation',
      message: language === 'id' ? 'Apakah Anda yakin ingin keluar dari sesi ini?' : 'Are you sure you want to end your session?',
    });

    setConfirmAction(() => performLogout);
    setIsConfirmModalOpen(true);
  };
  
  const handleProcessPayment = () => {
    setPaymentTotal(total);
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = (paymentMethod: string) => {
    if (!currentUser || !currentBranchId) return;
    
    const newOrder: CompletedOrder = {
        id: `order-${Date.now()}-${Math.random()}`,
        items: orderItems,
        subtotal: subtotal,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        discountDetails: discount ? (discount.type === 'percentage' ? `${discount.value}%` : `Rp ${discount.value}`) : undefined,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString(),
        cashier: currentUser.name,
        orderChannel: orderChannel,
        branchId: currentBranchId,
    };
    
    setCompletedOrders(prev => [...prev, newOrder]);
    setLastCompletedOrder(newOrder);
    clearOrder();
  };

  const handleNewOrder = () => {
    setIsPaymentModalOpen(false);
    setLastCompletedOrder(null);
  }

  const handleConfirm = () => {
    if (confirmAction) {
        confirmAction();
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  if (!currentUser) {
    switch (loginView) {
      case 'staff':
        return <LoginScreen 
                  title="Staff Login"
                  onLogin={handleStaffLogin} 
                  logoUrl={logoUrl} 
                  onBack={() => setLoginView('selection')}
               />;
      case 'owner':
        return <LoginScreen 
                  title="Owner Login"
                  onLogin={handleOwnerLogin} 
                  logoUrl={logoUrl} 
                  onBack={() => setLoginView('selection')}
               />;
      case 'selection':
      default:
        return <LoginSelectionScreen 
                  onSelectStaff={() => setLoginView('staff')}
                  onSelectOwner={() => setLoginView('owner')}
                  logoUrl={logoUrl}
                />;
    }
  }
  
  const renderContentForRole = () => {
      switch (currentUser.role) {
          case 'owner':
          case 'supervisor':
              return <ManagerView 
                        menuItems={menuItems}
                        onUpdateMenu={setMenuItems}
                        completedOrders={completedOrders}
                        users={users}
                        onUpdateUsers={setUsers}
                        canSupervisorManage={canSupervisorManage}
                        onSetCanSupervisorManage={setCanSupervisorManage}
                        currentUser={currentUser}
                        language={language}
                        logoUrl={logoUrl}
                        onLogoChange={setLogoUrl}
                        qrisImageUrl={qrisImageUrl}
                        onQrisImageChange={setQrisImageUrl}
                        branches={branches}
                        onUpdateBranches={setBranches}
                     />;
          case 'cashier':
              if (!currentBranchId || !currentBranch) {
                // This case should be handled by the BranchSetupModal,
                // but as a fallback, show a waiting message.
                return <div className="p-8 text-center">Waiting for branch selection...</div>;
              }
              return (
                  <StaffDashboard
                      menuItems={menuItems}
                      orderItems={orderItems}
                      onAddToOrder={handleAddToOrder}
                      onUpdateQuantity={updateQuantity}
                      onClearOrder={clearOrder}
                      onProcessPayment={handleProcessPayment}
                      language={language}
                      orderChannel={orderChannel}
                      onOrderChannelChange={handleOrderChannelChange}
                      discount={discount}
                      applyDiscount={applyDiscount}
                      removeDiscount={removeDiscount}
                      discountAmount={discountAmount}
                      subtotal={subtotal}
                      tax={tax}
                      total={total}
                      onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                      onOpenClosingModal={() => setIsClosingModalOpen(true)}
                      currentBranchName={currentBranch.name}
                  />
              );
          default:
              return <div className="p-8 text-center">Unsupported user role.</div>;
      }
  };


  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen font-sans">
      <Header 
        user={currentUser} 
        onLogout={handleLogout} 
        language={language} 
        onLanguageChange={setLanguage} 
        logoUrl={logoUrl}
        branchName={currentBranch?.name}
      />
      
      {renderContentForRole()}
      
      {isPaymentModalOpen && currentUser.role === 'cashier' && (
          <PaymentModal 
            totalAmount={paymentTotal}
            onClose={handleNewOrder}
            onPaymentSuccess={handlePaymentSuccess}
            lastCompletedOrder={lastCompletedOrder}
            qrisImageUrl={qrisImageUrl}
          />
      )}
      
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
      />

      {isOpeningModalOpen && currentUser && (
          <CashierOpeningModal
            isOpen={isOpeningModalOpen}
            user={currentUser}
            onConfirm={handleStartShift}
          />
      )}
      
      {isExpenseModalOpen && (
          <ExpenseModal 
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            onSave={handleAddExpense}
          />
      )}

      {isClosingModalOpen && dailySession && (
          <CashierClosingModal
            isOpen={isClosingModalOpen}
            onClose={() => setIsClosingModalOpen(false)}
            user={currentUser}
            orders={completedOrders.filter(o => o.branchId === currentBranchId)} // Pass only this branch's orders
            shiftStartTime={dailySession.startTime}
            initialCash={dailySession.initialCash}
            expenses={dailySession.expenses}
            onConfirmAndClose={handleCloseShift}
          />
      )}
      
      {isBranchModalOpen && currentUser && (
        <BranchSetupModal 
            isOpen={isBranchModalOpen}
            branches={branches}
            onSelectBranch={handleSetCurrentBranch}
            userRole={currentUser.role}
        />
      )}
    </div>
  );
};

export default App;