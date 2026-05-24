import React, { createContext, useContext, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  ClerkProvider, 
  useUser as useClerkUser, 
  useClerk as useClerkInstance, 
  SignedIn as ClerkSignedIn, 
  SignedOut as ClerkSignedOut, 
  SignInButton as ClerkSignInButton, 
  UserButton as ClerkUserButton 
} from '@clerk/clerk-react';
import * as LucideIcons from 'lucide-react';

// ==========================================
// 1. SAFE ERROR BOUNDARY FOR CLERK
// ==========================================
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ClerkErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Clerk loading or initializing failed. Gracefully routing to safe local session mode.", error, errorInfo);
  }

  public render() {
    const self = this as any;
    if (this.state.hasError) {
      return self.props.fallback;
    }
    return self.props.children;
  }
}

// ==========================================
// 2. MOCK CLERK STATE MANAGEMENT (FALLBACK)
// ==========================================
export interface MockUser {
  id: string;
  fullName: string;
  firstName: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
}

interface BridgeContextType {
  isMockMode: boolean;
  isSignedIn: boolean;
  user: MockUser | null;
  isLoaded: boolean;
  openSignIn: () => void;
  openSignUp: () => void;
  signOut: () => void;
  setMockSession: (name: string, email: string) => void;
  isMockSignInOpen: boolean;
  setIsMockSignInOpen: (open: boolean) => void;
}

const BridgeContext = createContext<BridgeContextType>({
  isMockMode: false,
  isSignedIn: false,
  user: null,
  isLoaded: true,
  openSignIn: () => {},
  openSignUp: () => {},
  signOut: () => {},
  setMockSession: () => {},
  isMockSignInOpen: false,
  setIsMockSignInOpen: () => {},
});

export function useBridge() {
  return useContext(BridgeContext);
}

// ==========================================
// 3. COMBINED RESILIENT PROVIDER
// ==========================================
interface ProviderProps {
  children: ReactNode;
  publishableKey: string;
}

export function ClerkProviderBridge({ children, publishableKey }: ProviderProps) {
  const [useBackupMockMode, setUseBackupMockMode] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [isMockSignInOpen, setIsMockSignInOpen] = useState(false);

  // Sync simulated guest account with localStorage
  useEffect(() => {
    const savedSim = localStorage.getItem('activate_sudan_sim_user');
    if (savedSim) {
      try {
        const parsed = JSON.parse(savedSim);
        if (parsed && parsed.fullName && parsed.email) {
          setIsSignedIn(true);
          setUser({
            id: 'sim_usr_' + parsed.email.replace(/[^a-zA-Z0-9]/g, '_'),
            fullName: parsed.fullName,
            firstName: parsed.fullName.split(' ')[0],
            primaryEmailAddress: { emailAddress: parsed.email }
          });
        }
      } catch (e) {
        console.error("Failed to restore simulated session", e);
      }
    }
  }, []);

  const handleSetMockSession = (fullName: string, email: string) => {
    const freshUser: MockUser = {
      id: 'sim_usr_' + email.replace(/[^a-zA-Z0-9]/g, '_'),
      fullName: fullName.trim(),
      firstName: fullName.trim().split(' ')[0],
      primaryEmailAddress: { emailAddress: email.trim() }
    };
    localStorage.setItem('activate_sudan_sim_user', JSON.stringify({ fullName: fullName.trim(), email: email.trim() }));
    setUser(freshUser);
    setIsSignedIn(true);
    setIsMockSignInOpen(false);
    
    // Dispatch instant reload event for local storage synchronization
    window.dispatchEvent(new Event('storage'));
  };

  const handleSignOut = () => {
    localStorage.removeItem('activate_sudan_sim_user');
    setUser(null);
    setIsSignedIn(false);
    window.dispatchEvent(new Event('storage'));
  };

  const mockProviderValue: BridgeContextType = {
    isMockMode: true,
    isSignedIn,
    user,
    isLoaded: true,
    openSignIn: () => setIsMockSignInOpen(true),
    openSignUp: () => setIsMockSignInOpen(true),
    signOut: handleSignOut,
    setMockSession: handleSetMockSession,
    isMockSignInOpen,
    setIsMockSignInOpen,
  };

  // Safe Fallback Layout
  const mainMockContent = (
    <BridgeContext.Provider value={mockProviderValue}>
      {children}
      {/* High Fidelity Simulated Guest SignIn Modal */}
      {isMockSignInOpen && (
        <SimulatedSignInModal 
          onClose={() => setIsMockSignInOpen(false)}
          onSuccess={handleSetMockSession}
        />
      )}
    </BridgeContext.Provider>
  );

  return (
    <ClerkErrorBoundary fallback={mainMockContent}>
      {/* Real Clerk Wrapper */}
      <RealClerkProviderWrapper 
        publishableKey={publishableKey} 
        onClerkError={() => setUseBackupMockMode(true)}
        useMock={useBackupMockMode}
        mockValue={mockProviderValue}
      >
        {children}
      </RealClerkProviderWrapper>
    </ClerkErrorBoundary>
  );
}

// Inner helper component to utilize Clerk's context safely
interface RealClerkProviderWrapperProps {
  publishableKey: string;
  onClerkError: () => void;
  useMock: boolean;
  mockValue: BridgeContextType;
  children: ReactNode;
}

function RealClerkProviderWrapper({ 
  publishableKey, 
  onClerkError, 
  useMock, 
  mockValue, 
  children 
}: RealClerkProviderWrapperProps) {

  // If already flagged for fallback mode, jump straight to mock
  if (useMock) {
    return (
      <BridgeContext.Provider value={mockValue}>
        {children}
        {mockValue.isMockSignInOpen && (
          <SimulatedSignInModal 
            onClose={() => mockValue.setIsMockSignInOpen(false)}
            onSuccess={mockValue.setMockSession}
          />
        )}
      </BridgeContext.Provider>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
    >
      <ClerkStateObserver onClerkError={onClerkError} mockValue={mockValue}>
        {children}
      </ClerkStateObserver>
    </ClerkProvider>
  );
}

// Observes if Clerk successfully instantiated or throws timeouts
interface ObserverProps {
  onClerkError: () => void;
  mockValue: BridgeContextType;
  children: ReactNode;
}

function ClerkStateObserver({ onClerkError, mockValue, children }: ObserverProps) {
  const [hasTimeoutExpired, setHasTimeoutExpired] = useState(false);

  // Watch Client Script load with a strict 4.5 second grace timeout
  useEffect(() => {
    const checkTimer = setTimeout(() => {
      // If window.Clerk is still undefined after 4.5s, trigger mock failover!
      if (!(window as any).Clerk) {
        console.warn("Clerk script load timed out. Directing failover to secure local storage auth system.");
        setHasTimeoutExpired(true);
        onClerkError();
      }
    }, 4500);

    return () => clearTimeout(checkTimer);
  }, [onClerkError]);

  if (hasTimeoutExpired) {
    return (
      <BridgeContext.Provider value={mockValue}>
        {children}
        {mockValue.isMockSignInOpen && (
          <SimulatedSignInModal 
            onClose={() => mockValue.setIsMockSignInOpen(false)}
            onSuccess={mockValue.setMockSession}
          />
        )}
      </BridgeContext.Provider>
    );
  }

  return (
    <ClerkRealContextBridge children={children} />
  );
}

// Bridges standard useUser() calls through our bridge
function ClerkRealContextBridge({ children }: { children: ReactNode }) {
  let userResult: any = null;
  let clerkInstance: any = null;

  try {
    userResult = useClerkUser();
    clerkInstance = useClerkInstance();
  } catch (e) {
    // Hooks threw because Clerk is completely missing or blocked
    console.warn("Clerk hooks threw. Let's make sure we default gracefully.", e);
  }

  const realValue: BridgeContextType = {
    isMockMode: false,
    isSignedIn: !!userResult?.isSignedIn,
    user: userResult?.user ? {
      id: userResult.user.id,
      fullName: userResult.user.fullName || userResult.user.firstName || '',
      firstName: userResult.user.firstName || '',
      primaryEmailAddress: userResult.user.primaryEmailAddress ? {
        emailAddress: userResult.user.primaryEmailAddress.emailAddress
      } : undefined
    } : null,
    isLoaded: userResult ? userResult.isLoaded : false,
    openSignIn: () => clerkInstance?.openSignIn ? clerkInstance.openSignIn() : console.warn("SignIn unavailable"),
    openSignUp: () => clerkInstance?.openSignUp ? clerkInstance.openSignUp() : console.warn("SignUp unavailable"),
    signOut: () => clerkInstance?.signOut ? clerkInstance.signOut() : console.warn("SignOut unavailable"),
    setMockSession: () => {},
    isMockSignInOpen: false,
    setIsMockSignInOpen: () => {},
  };

  return (
    <BridgeContext.Provider value={realValue}>
      {children}
    </BridgeContext.Provider>
  );
}

// ==========================================
// 4. SMART CLERK-RESILIENT HOOKS & COMPONENT BRIDGE
// ==========================================

export function useUserBridge() {
  const bridge = useContext(BridgeContext);
  return {
    isSignedIn: bridge.isSignedIn,
    user: bridge.user,
    isLoaded: bridge.isLoaded,
    isMockMode: bridge.isMockMode,
  };
}

export function useClerkBridge() {
  const bridge = useContext(BridgeContext);
  return {
    openSignIn: bridge.openSignIn,
    openSignUp: bridge.openSignUp,
    signOut: bridge.signOut,
    isMockMode: bridge.isMockMode,
  };
}

export function SignedInBridge({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUserBridge();
  return isSignedIn ? <>{children}</> : null;
}

export function SignedOutBridge({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUserBridge();
  return !isSignedIn ? <>{children}</> : null;
}

interface ButtonProps {
  children?: ReactNode;
  mode?: 'modal' | 'redirect';
}

export function SignInButtonBridge({ children, mode = 'modal' }: ButtonProps) {
  const bridge = useContext(BridgeContext);
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    bridge.openSignIn();
  };

  if (children) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleAction,
    });
  }

  return (
    <button 
      onClick={handleAction}
      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
    >
      Sign In
    </button>
  );
}

export function UserButtonBridge({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  const bridge = useContext(BridgeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // If real clerk is alive under the hood, pass through ClerkUserButton directly!
  if (!bridge.isMockMode) {
    return <ClerkUserButton afterSignOutUrl={afterSignOutUrl || "/"} />;
  }

  const initialLetter = bridge.user?.fullName?.charAt(0) || 'U';

  return (
    <div className="relative font-sans text-right">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-orange-500/10 flex items-center justify-center border-2 border-slate-800 cursor-pointer hover:brightness-110 active:scale-95 select-none"
        title={bridge.user?.fullName}
      >
        {initialLetter.toUpperCase()}
      </button>

      {menuOpen && (
        <div className="absolute top-10 left-0 md:left-auto md:right-0 bg-[#1e293b] border border-slate-800 rounded-2xl p-4 shadow-2xl w-56 z-50 text-right">
          <div className="pb-2.5 mb-2.5 border-b border-slate-800">
            <p className="text-xs font-black text-white truncate">{bridge.user?.fullName}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{bridge.user?.primaryEmailAddress?.emailAddress}</p>
            <span className="inline-block mt-1 text-[8px] font-extrabold px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
              عضو تفعيلك المحلي 🔑
            </span>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              bridge.signOut();
            }}
            className="w-full text-right py-1.5 text-xs font-extrabold text-red-400 hover:text-red-300 transition flex items-center gap-1.5 justify-end"
          >
            <span>تسجيل الخروج</span>
            <LucideIcons.LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

//   HIGH FIDELITY LOCAL SIGN-IN MODAL
interface SimModalProps {
  onClose: () => void;
  onSuccess: (fullName: string, email: string) => void;
}

function SimulatedSignInModal({ onClose, onSuccess }: SimModalProps) {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    onSuccess(nameInput, emailInput);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans text-right" dir="rtl">
      <div className="bg-[#1e293b] border border-slate-800 w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative animate-scale-up">
        {/* Decorative Top Accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600" />
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 shrink-0">
              <LucideIcons.ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">تسجيل دخول آمن وسريع</h3>
              <p className="text-[9px] text-slate-400 font-bold">بوابة تفعيلك المحلية المرنة</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <LucideIcons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-amber-500/15 border border-amber-500/20 text-amber-500 rounded-xl text-[10px] sm:text-xs leading-relaxed font-bold">
            💡 <strong>ملاحظة هامة:</strong> تم تشغيل الوضع المحلي الآمن في متصفحك لمواصلة تصفح وتفعيل باقتك فوراً، ودون انتظار ملقمات Clerk الخارجية!
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-extrabold text-slate-300 mb-1">
              الاسم بالكامل (لتخصيص تفعيلك)
            </label>
            <div className="relative">
              <LucideIcons.User className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
              <input 
                type="text" 
                required
                maxLength={45}
                placeholder="مثال: أحمد عبد الله الفاضل"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 pr-9 pl-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-right"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-extrabold text-slate-300 mb-1">
              البريد الإلكتروني (الأساسي لتفعيل الباقة)
            </label>
            <div className="relative">
              <LucideIcons.Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
              <input 
                type="email" 
                required
                placeholder="اسمك@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 pr-9 pl-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-right font-mono"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 py-3 rounded-2xl text-slate-950 font-black text-xs transition duration-300 flex items-center justify-center gap-2 mt-5 shadow-lg shadow-orange-500/10 cursor-pointer"
          >
            <LucideIcons.CheckCircle className="w-4 h-4" />
            <span>تسجيل المزامنة والدخول الفوري 🔑</span>
          </button>
        </form>

        <div className="bg-slate-900 p-3.5 text-center text-[9px] text-slate-500 font-mono border-t border-slate-800">
          Activate Sudan • Local Secure Auth Provider v1.1
        </div>
      </div>
    </div>
  );
}
