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
  Info,
  Download,
  Smartphone
} from 'lucide-react';

export function SettingsModal() {
  const { 
    currentUser,
    role,
    updateUserProfile,
    showSettingsModal, 
    setShowSettingsModal, 
    setShowPrivacyModal, 
    setShowAboutModal,
    darkMode, 
    toggleDarkMode, 
    language, 
    switchLanguage,
    isAppInstalled,
    setShowInstallModal,
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
          {/* 1. Primary Language Selection Section */}
          <div 
            style={{ 
              background: darkMode ? '#1e293b' : '#f0fdf4', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.1rem',
              marginBottom: '1rem',
              border: darkMode ? '1.5px solid #334155' : '1.5px solid #bbf7d0',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '800', fontSize: '0.95rem', color: darkMode ? '#f8fafc' : 'var(--primary-forest)' }}>
                <Globe size={18} />
                <span>{language === 'hi' ? 'भाषा चुनें (Select Language)' : language === 'pa' ? 'ਭਾਸ਼ਾ ਚੁਣੋ (Select Language)' : 'Select Language / भाषा चुनें'}</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-emerald)', background: darkMode ? '#0f172a' : '#ffffff', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => switchLanguage('en')}
                style={{
                  padding: '0.65rem 0.4rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  background: language === 'en' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'en' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-primary)'),
                  border: language === 'en' ? '2px solid var(--primary-forest)' : (darkMode ? '1px solid #334155' : '1.5px solid var(--card-border)'),
                  cursor: 'pointer',
                  boxShadow: language === 'en' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>English</span>
                <span style={{ fontSize: '0.68rem', opacity: language === 'en' ? 0.9 : 0.6, fontWeight: '600' }}>English</span>
              </button>

              <button
                type="button"
                onClick={() => switchLanguage('hi')}
                style={{
                  padding: '0.65rem 0.4rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  background: language === 'hi' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'hi' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-primary)'),
                  border: language === 'hi' ? '2px solid var(--primary-forest)' : (darkMode ? '1px solid #334155' : '1.5px solid var(--card-border)'),
                  cursor: 'pointer',
                  boxShadow: language === 'hi' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>हिंदी</span>
                <span style={{ fontSize: '0.68rem', opacity: language === 'hi' ? 0.9 : 0.6, fontWeight: '600' }}>Hindi</span>
              </button>

              <button
                type="button"
                onClick={() => switchLanguage('pa')}
                style={{
                  padding: '0.65rem 0.4rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  background: language === 'pa' ? 'var(--primary-forest)' : (darkMode ? '#0f172a' : '#ffffff'),
                  color: language === 'pa' ? '#ffffff' : (darkMode ? '#cbd5e1' : 'var(--text-primary)'),
                  border: language === 'pa' ? '2px solid var(--primary-forest)' : (darkMode ? '1px solid #334155' : '1.5px solid var(--card-border)'),
                  cursor: 'pointer',
                  boxShadow: language === 'pa' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>ਪੰਜਾਬੀ</span>
                <span style={{ fontSize: '0.68rem', opacity: language === 'pa' ? 0.9 : 0.6, fontWeight: '600' }}>Punjabi</span>
              </button>
            </div>
          </div>

          {/* 2. Farmer WhatsApp & Contact Privacy Controls (For Farmers) */}
          {(role === 'producer' || currentUser?.role === 'producer') && (
            <div
              style={{
                background: darkMode ? '#1e293b' : '#ecfdf5',
                border: darkMode ? '1.5px solid #334155' : '1.5px solid #a7f3d0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '800', fontSize: '0.95rem', color: darkMode ? '#f8fafc' : 'var(--primary-forest)', marginBottom: '0.75rem' }}>
                <Phone size={18} color="var(--primary-forest)" />
                <span>
                  {language === 'hi' ? 'किसान संपर्क व व्हाट्सएप प्राइवेसी' : language === 'pa' ? 'ਕਿਸਾਨ ਸੰਪਰਕ ਅਤੇ ਵਟਸਐਪ ਪ੍ਰਾਈਵੇਸੀ' : 'Seller Contact & WhatsApp Privacy'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '0.65rem' }}>
                {/* Toggle WhatsApp */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: darkMode ? '#0f172a' : '#ffffff', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', border: darkMode ? '1px solid #334155' : '1px solid var(--card-border)' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.86rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                      {language === 'hi' ? 'व्हाट्सएप नंबर दिखाएं' : language === 'pa' ? 'ਵਟਸਐਪ ਨੰਬਰ ਦਿਖਾਓ' : 'Show WhatsApp Number'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
                      {language === 'hi' ? 'ग्राहक लिस्टिंग पर व्हाट्सएप बटन देख सकेंगे' : 'Allow buyers to message you directly on WhatsApp'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = currentUser?.showWhatsApp === false ? true : false;
                      updateUserProfile({ showWhatsApp: newVal });
                    }}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '800',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      background: currentUser?.showWhatsApp !== false ? '#22c55e' : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {currentUser?.showWhatsApp !== false ? (
                      <>
                        <Check size={13} />
                        <span>ON</span>
                      </>
                    ) : (
                      <span>OFF</span>
                    )}
                  </button>
                </div>

                {/* Toggle Phone Call */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: darkMode ? '#0f172a' : '#ffffff', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', border: darkMode ? '1px solid #334155' : '1px solid var(--card-border)' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.86rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                      {language === 'hi' ? 'फ़ोन कॉल नंबर दिखाएं' : language === 'pa' ? 'ਫੋਨ ਕਾਲ ਨੰਬਰ ਦਿਖਾਓ' : 'Show Direct Phone Number'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
                      {language === 'hi' ? 'ग्राहक लिस्टिंग पर डायरेक्ट कॉल बटन देख सकेंगे' : 'Allow buyers to call your phone number directly'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = currentUser?.showPhone === false ? true : false;
                      updateUserProfile({ showPhone: newVal });
                    }}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '800',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      background: currentUser?.showPhone !== false ? '#22c55e' : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {currentUser?.showPhone !== false ? (
                      <>
                        <Check size={13} />
                        <span>ON</span>
                      </>
                    ) : (
                      <span>OFF</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Dedicated Dark Mode Switcher */}
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

          {/* PWA Install Button in Settings */}
          {!isAppInstalled && (
            <div style={{ marginBottom: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowInstallModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  border: darkMode ? '1.5px solid #059669' : '1.5px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)' }}>
                    <Download size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: darkMode ? '#f8fafc' : 'var(--text-primary)' }}>
                      {language === 'hi' ? '📲 Fresh Fetch ऐप इंस्टॉल करें' : language === 'pa' ? '📲 Fresh Fetch ਐਪ ਇੰਸਟਾਲ ਕਰੋ' : '📲 Install Fresh Fetch App'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
                      {language === 'hi' ? "होम स्क्रीन पर 1-टैप ऐप जोड़ें" : language === 'pa' ? "ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ 1-ਟੈਪ ਐਪ ਸ਼ਾਮਲ ਕਰੋ" : "Add 1-tap app to your home screen"}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="#10b981" />
              </button>
            </div>
          )}

          {/* 3. Dedicated Privacy Policy & Terms Button */}
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

          {/* 4. Dedicated Our Mission & Story Button */}
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

          {/* 4. Support Helpline Link */}
          <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: darkMode ? '1px solid #334155' : '1px solid var(--card-border)', fontSize: '0.8rem', color: darkMode ? '#94a3b8' : 'var(--text-muted)' }}>
            <div>Fresh Fetch v1.0.0 (PWA)</div>
            <div style={{ marginTop: '0.2rem', display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span>WhatsApp:</span>
              <a href="https://wa.me/918107008156" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800' }}>+91 8107008156</a>
              <span>•</span>
              <a href="https://wa.me/919511544399" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800' }}>+91 9511544399</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
