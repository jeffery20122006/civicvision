import { useState, useEffect } from 'react';
import { Camera, LayoutDashboard, HardHat, Copy, Sun, Moon, Search, LogIn, LogOut, Shield, Home, ArrowLeft } from 'lucide-react';
import CitizenReporter from './CitizenReporter';
import AdminDashboard from './components/AdminDashboard';
import WorkerView from './WorkerView';
import DuplicateAnalyzer from './components/DuplicateAnalyzer';
import AuthSessionPage from './components/AuthSessionPage';
import LandingHomePage from './components/LandingHomePage';

function App() {
  const [view, setView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthSession, setShowAuthSession] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigateTo = (newView) => {
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
      navigateTo('worker');
    } else if (user.role === 'citizen') {
      navigateTo('reporter');
    } else {
      navigateTo('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Dedicated Auth Session overlay when triggered
  if (showAuthSession) {
    return (
      <AuthSessionPage 
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
        onGetStarted={() => navigateTo('reporter')}
        onAuthorityLogin={() => setShowAuthSession(true)}
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
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigateTo('home')}
        >
          <div 
            className="sidebar-logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              overflow: 'hidden',
              background: '#0d0f14',
              border: '1px solid rgba(249, 115, 22, 0.4)'
            }}
          >
            <img src="/logo.png" alt="Civic Vision Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>
              CIVIC<span style={{ color: 'var(--accent-color)' }}>VISION</span>
            </div>
          </div>
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
                onClick={() => setShowAuthSession(true)}
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
          {view === 'worker' && <WorkerView currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
}

export default App;

