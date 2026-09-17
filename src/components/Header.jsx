import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  RefreshCw, 
  User, 
  LogOut, 
  Sparkles, 
  HelpCircle, 
  ShoppingBag, 
  Tractor,
  Heart,
  Settings,
  Download
} from 'lucide-react';

export function Header() {
  const { 
    language, 
    switchLanguage, 
    role, 
    switchRole, 
    currentUser, 
    logout, 
    setShowAuthModal, 
    setShowAboutModal, 
    setShowRoleModal,
    setShowSettingsModal,
    setActiveTab,
    wishlist,
    inquiries,
    isAppInstalled,
    setShowInstallModal,
    t 
  } = useApp();

  return (
    <header className="sticky-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <div 
          className="logo-container" 
          onClick={() => setActiveTab(role === 'producer' ? 'listings' : 'marketplace')}
          title="Fresh Fetch Home"
        >
          <div className="logo-badge">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div className="logo-text-wrap">
            <span className="logo-title">Fresh Fetch</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* User Auth Profile / Login */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                onClick={() => setActiveTab('profile')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  background: 'var(--bg-subtle)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--card-border)',
                  cursor: 'pointer'
                }}
                title="View Profile"
              >
                <User size={15} color="var(--primary-forest)" />
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(currentUser?.name || 'User').split(' ')[0]}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fee2e2',
                  color: '#ef4444'
                }}
                title={t('logout')}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={() => setShowAuthModal(true)}>
              <User size={15} />
              <span>{t('loginTitle')}</span>
            </button>
          )}

          {/* PWA Install Quick Button */}
          {!isAppInstalled && (
            <button
              onClick={() => setShowInstallModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.2s'
              }}
              title={t('pwaInstallTitle') || 'Install App'}
            >
              <Download size={14} />
              <span className="hidden sm:inline">{language === 'hi' ? 'ऐप डाउनलोड' : language === 'pa' ? 'ਐਪ ਡਾਊਨਲੋਡ' : 'Install'}</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="settings-header-btn"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--card-border)',
              color: 'var(--primary-forest)',
              cursor: 'pointer'
            }}
            title={language === 'hi' ? 'सेटिंग्स (Settings)' : 'Settings'}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
