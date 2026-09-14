import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  ShieldCheck, 
  FileText, 
  Phone, 
  Globe, 
  Check, 
  ChevronRight, 
  Sparkles,
  Info
} from 'lucide-react';

export function SettingsModal() {
  const { 
    showSettingsModal, 
    setShowSettingsModal, 
    setShowPrivacyModal, 
    setShowAboutModal,
    darkMode, 
    toggleDarkMode, 
    language, 
    switchLanguage, 
    t 
  } = useApp();

  if (!showSettingsModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={20} color="var(--primary-forest)" />
            <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
              {language === 'hi' ? 'सेटिंग्स (Settings)' : language === 'pa' ? 'ਸੈਟਿੰਗਾਂ (Settings)' : 'Settings'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={() => setShowSettingsModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* 1. Dedicated Dark Mode Switcher */}
          <div 
            style={{ 
              background: darkMode ? '#1e293b' : '#f8fafc', 
              border: darkMode ? '1.5px solid #334155' : '1.5px solid #e2e8f0', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: 'var(--radius-full)', 
                  background: darkMode ? '#3b82f6' : '#fef3c7', 
                  color: darkMode ? '#ffffff' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {darkMode ? <Moon size={22} /> : <Sun size={22} />}
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                  {language === 'hi' ? 'डार्क मोड (Dark Mode)' : 'Dark Mode'}
                </div>
                <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {darkMode 
                    ? (language === 'hi' ? 'डार्क थीम चालू है (Night Theme Active)' : 'Dark theme is active') 
                    : (language === 'hi' ? 'रात में आँखों के आराम के लिए' : 'Comfortable viewing at night')}
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                background: darkMode ? '#22c55e' : '#e2e8f0',
                color: darkMode ? '#ffffff' : '#334155',
                border: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {darkMode ? (
                <>
                  <Check size={14} />
                  <span>ON</span>
                </>
              ) : (
                <span>OFF</span>
              )}
            </button>
          </div>

          {/* 2. Dedicated Privacy Policy & Terms Button */}
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => {
                setShowSettingsModal(false);
                setShowPrivacyModal(true);
              }}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: darkMode ? '#1e293b' : '#ffffff',
                border: darkMode ? '1.5px solid #334155' : '1.5px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.92rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                    {language === 'hi' ? 'गोपनीयता नीति एवं नियम (Privacy Policy)' : 'Privacy Policy & Terms'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
                    {language === 'hi' ? 'डेटा सुरक्षा, अधिकार व नियम देखें' : 'View data safety & platform terms'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--primary-emerald)" />
            </button>
          </div>

          {/* 3. Dedicated Our Mission & Story Button */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => {
                setShowSettingsModal(false);
                setShowAboutModal(true);
              }}
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: darkMode ? '#1e293b' : '#ffffff',
                border: darkMode ? '1.5px solid #334155' : '1.5px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#fef3c7', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.92rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                    {language === 'hi' ? 'हमारा मिशन एवं कहानी (Our Mission)' : language === 'pa' ? 'ਸਾਡਾ ਮਿਸ਼ਨ ਅਤੇ ਕਹਾਣੀ (Our Mission)' : 'Our Mission & Story'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
                    {language === 'hi' ? 'विपनदीप (AIT Pune) व जशन • शुद्धता की कहानी' : 'Vipandeep (AIT Pune) & Jashan • Startup Story'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--accent-gold)" />
            </button>
          </div>

          {/* 3. Language Selector Inside Settings */}
          <div 
            style={{ 
              background: darkMode ? '#1e293b' : 'var(--bg-subtle)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.85rem',
              marginBottom: '1rem',
              border: darkMode ? '1px solid #334155' : '1px solid var(--card-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', fontWeight: '800', fontSize: '0.82rem', color: darkMode ? '#f8fafc' : 'var(--primary-forest)' }}>
              <Globe size={15} />
              <span>{t('step1Title')}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button
                onClick={() => switchLanguage('en')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: language === 'en' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'en' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-secondary)'),
                  border: '1px solid var(--card-border)'
                }}
              >
                English
              </button>
              <button
                onClick={() => switchLanguage('hi')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: language === 'hi' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'hi' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-secondary)'),
                  border: '1px solid var(--card-border)'
                }}
              >
                हिंदी
              </button>
              <button
                onClick={() => switchLanguage('pa')}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: language === 'pa' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'pa' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-secondary)'),
                  border: '1px solid var(--card-border)'
                }}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>

          {/* 4. Support Helpline Link */}
          <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: darkMode ? '1px solid #334155' : '1px solid var(--card-border)', fontSize: '0.8rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
            <div>Fresh Fetch v1.0.0 (PWA)</div>
            <div style={{ marginTop: '0.2rem' }}>
              WhatsApp Helpline: <a href="https://wa.me/918107008156" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800' }}>+91 8107008156</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
