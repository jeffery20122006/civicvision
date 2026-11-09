import { useState, useEffect } from 'react';
import { Camera, LayoutDashboard, HardHat, Copy, Sun, Moon, Search, LogIn, LogOut, Shield, Home, ArrowLeft } from 'lucide-react';
import CitizenReporter from './CitizenReporter';
import AdminDashboard from './components/AdminDashboard';
import WorkerView from './WorkerView';
import DuplicateAnalyzer from './components/DuplicateAnalyzer';
import AuthSessionPage from './components/AuthSessionPage';
import LandingHomePage from './components/LandingHomePage';
import Logo from './components/Logo';

function App() {
  const [view, setView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthSession, setShowAuthSession] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('worker');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigateTo = (newView) => {
    // Restrict worker field session ONLY to people who login through field worker login
    if (newView === 'worker') {
      if (!isAuthenticated || currentUser?.role !== 'worker') {
        setAuthInitialRole('worker');
        setShowAuthSession(true);
        return;
      }
    }
    if (newView !== view) {
      setViewHistory(prev => [...prev, newView]);
      setView(newView);
    }
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setView(previousView);
    } else {
      setView('home');
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowAuthSession(false);
    if (user.role === 'worker') {
      setViewHistory(prev => [...prev, 'worker']);
      setView('worker');
    } else if (user.role === 'citizen') {
      setViewHistory(prev => [...prev, 'reporter']);
      setView('reporter');
    } else {
      setViewHistory(prev => [...prev, 'admin']);
      setView('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setView('home');
  };

  // Dedicated Auth Session overlay when triggered
  if (showAuthSession) {
    return (
      <AuthSessionPage 
        initialRole={authInitialRole}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToApp={() => {
          setCurrentUser({ name: 'Guest User', role: 'citizen' });
          setIsAuthenticated(true);
          setShowAuthSession(false);
        }}
        onBack={() => setShowAuthSession(false)}
      />
    );
  }

  // Render full Landing Home Page when view is 'home'
  if (view === 'home') {
    return (
      <LandingHomePage 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGetStarted={() => navigateTo('reporter')}
        onAuthorityLogin={() => {
          setAuthInitialRole('worker');
          setShowAuthSession(true);
        }}
        onViewMap={() => navigateTo('admin')}
        onNavigate={(targetView) => {
          if (targetView === 'home') setView('home');
          else navigateTo(targetView);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div 
          className="sidebar-header" 
          style={{ padding: '20px 16px', cursor: 'pointer' }}
          onClick={() => navigateTo('home')}
        >
          <Logo size="medium" />
        </div>
        <div className="nav-menu">
          <div 
            className={`nav-item ${view === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <Home size={18} /> Landing Home
          </div>
          <div 
            className={`nav-item ${view === 'reporter' ? 'active' : ''}`}
            onClick={() => navigateTo('reporter')}
          >
            <Camera size={18} /> Citizen Reporter
          </div>
          <div 
            className={`nav-item ${view === 'admin' ? 'active' : ''}`}
            onClick={() => navigateTo('admin')}
          >
            <LayoutDashboard size={18} /> Admin Dashboard
          </div>
          <div 
            className={`nav-item ${view === 'duplicates' ? 'active' : ''}`}
            onClick={() => navigateTo('duplicates')}
          >
            <Copy size={18} /> Duplicate Intelligence
          </div>
          <div 
            className={`nav-item ${view === 'worker' ? 'active' : ''}`}
            onClick={() => navigateTo('worker')}
          >
            <HardHat size={18} /> Worker View
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Universal Back Button */}
            <button 
              onClick={goBack}
              className="btn-secondary"
              title="Navigate back to previous session"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft size={16} style={{ color: 'var(--accent-color)' }} /> Back
            </button>

            <div className="topbar-search">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search ticket IDs, location, department..." 
                  className="search-bar" 
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar" style={{ flexShrink: 0, width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=f97316&color=fff`} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.2' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      {currentUser.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {currentUser.role === 'worker' ? 'Field Worker' : currentUser.role === 'citizen' ? 'Citizen User' : 'Administrator'}
                      {currentUser.department ? ` (${currentUser.department})` : ''}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  onClick={handleLogout}
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', whiteSpace: 'nowrap' }}
                >
                  <LogOut size={14} /> Switch Account
                </button>
              </div>
            ) : (
              <button 
                className="btn-primary"
                onClick={() => {
                  setAuthInitialRole('worker');
                  setShowAuthSession(true);
                }}
                style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px' }}
              >
                <LogIn size={15} /> Authority Login
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="page-content">
          {view === 'reporter' && <CitizenReporter currentUser={currentUser} />}
          {view === 'admin' && <AdminDashboard />}
          {view === 'duplicates' && <DuplicateAnalyzer />}
          {view === 'worker' && (
            isAuthenticated && currentUser?.role === 'worker' ? (
              <WorkerView currentUser={currentUser} />
            ) : (
              <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '480px', margin: '40px auto' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#0284c7' }}>
                  <HardHat size={32} />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#fff' }}>Field Worker Access Required</h3>
                <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
                  The worker field session is restricted to authorized field operations personnel. Please log in with your municipal field specialist credentials.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setAuthInitialRole('worker');
                    setShowAuthSession(true);
                  }}
                  style={{ background: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}
                >
                  <HardHat size={16} /> Login as Field Worker
                </button>
              </div>
            )
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Phones <= 768px) */}
        <nav className="mobile-bottom-nav">
          <button 
            type="button"
            className={`bottom-nav-item ${view === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button 
            type="button"
            className={`bottom-nav-item ${view === 'reporter' ? 'active' : ''}`}
            onClick={() => navigateTo('reporter')}
          >
            <Camera size={18} />
            <span>Report</span>
          </button>
          <button 
            type="button"
            className={`bottom-nav-item ${view === 'duplicates' ? 'active' : ''}`}
            onClick={() => navigateTo('duplicates')}
          >
            <Copy size={18} />
            <span>Duplicates</span>
          </button>
          <button 
            type="button"
            className={`bottom-nav-item ${view === 'admin' ? 'active' : ''}`}
            onClick={() => navigateTo('admin')}
          >
            <LayoutDashboard size={18} />
            <span>Admin</span>
          </button>
          <button 
            type="button"
            className={`bottom-nav-item ${view === 'worker' ? 'active' : ''}`}
            onClick={() => navigateTo('worker')}
          >
            <HardHat size={18} />
            <span>Worker</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;

