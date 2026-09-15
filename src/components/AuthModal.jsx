import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGIONS } from '../data/mockData';
import { 
  X, 
  Phone, 
  Lock, 
  User, 
  Calendar, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  Tractor,
  ShoppingBag
} from 'lucide-react';

export function AuthModal() {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginWithPassword,
    resetPasswordDirect,
    registerNewUser,
    role,
    t, 
    language 
  } = useApp();

  // Mode: 'login' | 'register' | 'forgot_password'
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot Password Fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Register Fields
  const [regData, setRegData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    location: 'Hanumangarh Town',
    regionId: 'hnm-town',
    password: '',
    role: role || 'buyer'
  });

  if (!showAuthModal) return null;

  const resetState = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const switchMode = (mode) => {
    resetState();
    setAuthMode(mode);
  };

  // 1. Handle Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!password) {
      setErrorMessage(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter your password');
      return;
    }

    setLoading(true);
    const res = await loginWithPassword(phone, password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      setShowAuthModal(false);
    }
  };

  // 2. Handle Forgot Password Reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your registered 10-digit phone number');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'Password must be at least 4 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    const res = await resetPasswordDirect(phone, newPassword);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to reset password');
    } else {
      setShowAuthModal(false);
    }
  };

  // 3. Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regData.fullName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!regData.phone || regData.phone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!regData.password || regData.password.length < 4) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का बनाएं' : 'Please create a password of at least 4 characters');
      return;
    }

    setLoading(true);
    const res = await registerNewUser(regData);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || (language === 'hi' ? 'खाता बनाने में विफल' : 'Failed to register account'));
      if (res.alreadyRegistered) {
        setPhone(regData.phone);
      }
    } else {
      setShowAuthModal(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
      <div 
        className="modal-card auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem' }}>🔐</span>
            <h3 className="modal-title">
              {authMode === 'register' ? t('step3TitleRegister') :
               authMode === 'forgot_password' ? t('resetPassword') :
               t('step3TitleLogin')}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* Top Mode Switcher Tabs */}
          {authMode !== 'forgot_password' && (
            <div className="auth-tab-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => switchMode('login')}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'login' ? '#ffffff' : 'transparent',
                  color: authMode === 'login' ? 'var(--primary-forest)' : 'var(--text-muted)',
                  boxShadow: authMode === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                🔑 {language === 'hi' ? 'लॉगिन' : 'Login'}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => switchMode('register')}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'register' ? '#ffffff' : 'transparent',
                  color: authMode === 'register' ? 'var(--primary-forest)' : 'var(--text-muted)',
                  boxShadow: authMode === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                ✨ {language === 'hi' ? 'नया खाता बनाएं' : 'Sign Up'}
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: '600', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: (errorMessage.includes('sign in') || errorMessage.includes('लॉगिन') || errorMessage.includes('ਲਾਗਇਨ')) ? '0.5rem' : 0 }}>
                <span>⚠️</span>
                <span style={{ lineHeight: '1.4' }}>{errorMessage}</span>
              </div>
              {(errorMessage.includes('sign in') || errorMessage.includes('लॉगिन') || errorMessage.includes('ਲਾਗਇਨ')) && (
                <button
                  type="button"
                  onClick={() => {
                    setPhone(regData.phone || phone);
                    setErrorMessage('');
                    switchMode('login');
                  }}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    background: 'var(--primary-forest)',
                    border: 'none',
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span>{language === 'hi' ? 'यहाँ लॉगिन करें' : language === 'pa' ? 'ਇੱਥੇ ਲਾਗਇਨ ਕਰੋ' : 'Switch to Login'}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
              ✅ {successMessage}
            </div>
          )}

          {/* =========================================================
              VIEW 1: PASSWORD LOGIN
             ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handlePasswordLogin}>
              <div className="form-group">
                <label className="form-label">{t('phoneLabel')} *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="phone-prefix-badge">+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    maxLength={10}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">{t('loginPasswordLabel')} *</label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    style={{ fontSize: '0.78rem', color: 'var(--primary-forest)', fontWeight: '700', textDecoration: 'underline' }}
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={17} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }} disabled={loading}>
                <span>{loading ? (language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...') : (language === 'hi' ? 'लॉगिन करें' : 'Login')}</span>
                <ArrowRight size={17} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  {t('dontHaveAccount')}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              VIEW 2: DIRECT FORGOT PASSWORD RESET
             ========================================================= */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleResetPasswordSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {t('resetPassword')}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {language === 'hi' ? 'अपना मोबाइल नंबर दर्ज करें और नया पासवर्ड सेट करें।' : 'Enter your mobile number and set a new password.'}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">{t('phoneLabel')} *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="phone-prefix-badge">+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    maxLength={10}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('newPasswordLabel')} *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('confirmPasswordLabel')} *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }} disabled={loading}>
                <CheckCircle2 size={17} />
                <span>{loading ? (language === 'hi' ? 'पासवर्ड बदल रहा है...' : 'Resetting...') : t('resetPassword')}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  ← {t('alreadyHaveAccount')}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              VIEW 3: CREATE NEW ACCOUNT (DIRECT)
             ========================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">{t('fullNameLabel')} *</label>
                <div className="input-with-icon">
                  <User size={17} className="field-icon" />
                  <input
                    type="text"
                    className="form-input field-input"
                    placeholder={t('fullNamePlaceholder')}
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">{language === 'hi' ? 'आप क्या हैं?' : 'Account Type'} *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setRegData({ ...regData, role: 'buyer' })}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      border: regData.role === 'buyer' ? '2px solid var(--accent-gold)' : '1px solid var(--card-border)',
                      background: regData.role === 'buyer' ? '#fef3c7' : 'var(--bg-subtle)',
                      color: regData.role === 'buyer' ? '#92400e' : 'var(--text-muted)'
                    }}
                  >
                    <ShoppingBag size={15} />
                    <span>{t('buyerBadge')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegData({ ...regData, role: 'producer' })}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      border: regData.role === 'producer' ? '2px solid var(--primary-forest)' : '1px solid var(--card-border)',
                      background: regData.role === 'producer' ? '#dcfce7' : 'var(--bg-subtle)',
                      color: regData.role === 'producer' ? 'var(--primary-forest)' : 'var(--text-muted)'
                    }}
                  >
                    <Tractor size={15} />
                    <span>{t('producerBadge')}</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('dobLabel')} *</label>
                  <div className="input-with-icon">
                    <Calendar size={17} className="field-icon" />
                    <input
                      type="date"
                      className="form-input field-input"
                      value={regData.dob}
                      onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('locationLabel')}</label>
                  <div className="input-with-icon">
                    <MapPin size={17} className="field-icon" />
                    <select
                      className="form-select field-input"
                      value={regData.regionId}
                      onChange={(e) => {
                        const reg = REGIONS.find((r) => r.id === e.target.value);
                        setRegData({
                          ...regData,
                          regionId: e.target.value,
                          location: reg ? reg.name : regData.location
                        });
                      }}
                    >
                      {REGIONS.filter((r) => r.id !== 'all').map((r) => (
                        <option key={r.id} value={r.id}>
                          {language === 'hi' ? r.nameHi : language === 'pa' ? r.namePa : r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('phoneLabel')} *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="phone-prefix-badge">+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder={t('phonePlaceholder')}
                    value={regData.phone}
                    maxLength={10}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('passwordLabel')} *</label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={17} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input field-input"
                    placeholder={t('passwordPlaceholder')}
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }} disabled={loading}>
                <CheckCircle2 size={17} />
                <span>{loading ? (language === 'hi' ? 'खाता बन रहा है...' : 'Creating Account...') : t('step3TitleRegister')}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  {t('alreadyHaveAccount')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
