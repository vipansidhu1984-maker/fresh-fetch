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
  Smartphone, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function AuthModal() {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginWithPassword,
    requestLoginOtp,
    verifyLoginOtp,
    requestPasswordReset,
    resetPasswordWithOtp,
    registerNewUser,
    isFirebaseConfigured,
    sendFirebasePhoneOtp,
    verifyFirebasePhoneOtp,
    role,
    t, 
    language 
  } = useApp();

  // Mode: 'password_login' | 'otp_login' | 'forgot_password' | 'register'
  const [authMode, setAuthMode] = useState('password_login');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP Fields
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
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
    setOtpSent(false);
    setEnteredOtp('');
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
    }
  };

  // 2. Handle OTP Login - Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setEnteredOtp('');
    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(phone);
      setLoading(false);
      setOtpSent(true);
      if (res.success) {
        setSuccessMessage(language === 'hi' ? 'आपके मोबाइल पर SMS OTP भेजा गया है' : 'SMS OTP sent to your phone');
      } else {
        setErrorMessage(res.error || 'SMS failed. You can use Test Code 4821 below.');
      }
    } else {
      setLoading(false);
      const res = requestLoginOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setEnteredOtp('4821');
        setSuccessMessage(language === 'hi' ? 'OTP भेजा गया: 4821' : 'OTP Sent: 4821');
      } else {
        setErrorMessage(res.error);
      }
    }
  };

  // Handle OTP Login - Step 2: Verify OTP
  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!enteredOtp || enteredOtp.length < 4) {
      setErrorMessage(language === 'hi' ? 'कृपया पूरा OTP कोड दर्ज करें' : 'Please enter the complete OTP code');
      return;
    }
    setLoading(true);

    if (isFirebaseConfigured && window.confirmationResult) {
      const res = await verifyFirebasePhoneOtp(enteredOtp);
      setLoading(false);
      if (res.success) {
        await verifyLoginOtp(phone, enteredOtp);
      } else {
        setErrorMessage(res.error || 'Invalid OTP code');
      }
    } else {
      setLoading(false);
      const res = await verifyLoginOtp(phone, enteredOtp || '4821');
      if (!res.success) {
        setErrorMessage(res.error);
      }
    }
  };

  // 3. Handle Forgot Password - Step 1: Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phone || phone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your registered 10-digit phone number');
      return;
    }

    setLoading(true);
    setEnteredOtp('');
    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(phone);
      setLoading(false);
      setOtpSent(true);
      if (res.success) {
        setSuccessMessage(language === 'hi' ? 'सत्यापन SMS भेजा गया' : 'Verification SMS sent');
      } else {
        setErrorMessage(res.error || 'SMS failed. You can use Test Code 4821.');
      }
    } else {
      setLoading(false);
      const res = requestPasswordReset(phone);
      if (res.success) {
        setOtpSent(true);
        setEnteredOtp('4821');
        setSuccessMessage(language === 'hi' ? 'सत्यापन OTP भेजा गया: 4821' : 'Verification OTP Sent: 4821');
      } else {
        setErrorMessage(res.error);
      }
    }
  };

  // Handle Forgot Password - Step 2: Set New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (newPassword.length < 4) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'Password must be at least 4 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    if (isFirebaseConfigured && window.confirmationResult) {
      const res = await verifyFirebasePhoneOtp(enteredOtp);
      setLoading(false);
      if (res.success) {
        await resetPasswordWithOtp(phone, enteredOtp, newPassword);
      } else {
        setErrorMessage(res.error || 'Invalid OTP code');
      }
    } else {
      setLoading(false);
      const res = await resetPasswordWithOtp(phone, enteredOtp || '4821', newPassword);
      if (!res.success) {
        setErrorMessage(res.error);
      }
    }
  };

  // 4. Handle Registration Submit
  const handleRegisterSubmit = (e) => {
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

    registerNewUser(regData);
    setShowAuthModal(false);
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
          {/* Top Mode Switcher Tabs for Login */}
          {authMode !== 'register' && authMode !== 'forgot_password' && (
            <div className="auth-tab-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'password_login' ? 'active' : ''}`}
                onClick={() => switchMode('password_login')}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'password_login' ? '#ffffff' : 'transparent',
                  color: authMode === 'password_login' ? 'var(--primary-forest)' : 'var(--text-muted)',
                  boxShadow: authMode === 'password_login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                🔑 {t('loginWithPassword')}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'otp_login' ? 'active' : ''}`}
                onClick={() => switchMode('otp_login')}
                style={{
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'otp_login' ? '#ffffff' : 'transparent',
                  color: authMode === 'otp_login' ? 'var(--primary-forest)' : 'var(--text-muted)',
                  boxShadow: authMode === 'otp_login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                📱 {t('loginWithOtp')}
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
              ⚠️ {errorMessage}
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
          {authMode === 'password_login' && (
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

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
                <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
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
              VIEW 2: OTP LOGIN
             ========================================================= */}
          {authMode === 'otp_login' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleRequestOtp}>
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

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
                    <Smartphone size={17} />
                    <span>{t('sendOtp')}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpLogin}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {t('otpSentTo')} <strong>+91 {phone}</strong>
                  </p>

                  {/* Simulated SMS helper banner */}
                  <div 
                    className="sms-simulation-box"
                    onClick={() => setEnteredOtp('4821')}
                    style={{ marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', fontSize: '0.8rem', color: '#166534' }}>
                      <Sparkles size={13} />
                      <span>{t('simulatedSms')} <strong>4821</strong></span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary-forest)' }}>
                      👉 {t('clickToAutofill')}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{language === 'hi' ? 'OTP सत्यापन कोड (4-6 अंक) *' : 'OTP Verification Code (4-6 digits) *'}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.25rem', fontWeight: '800' }}
                      maxLength={6}
                      placeholder="••••••"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }} disabled={loading}>
                    <CheckCircle2 size={17} />
                    <span>{loading ? (language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...') : t('verifyAndProceed')}</span>
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                    >
                      ← {language === 'hi' ? 'नंबर बदलें' : 'Change Phone'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={loading}
                      style={{ fontSize: '0.8rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                    >
                      {t('resendOtp')}
                    </button>
                  </div>
                </form>
              )}

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  {t('dontHaveAccount')}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: FORGOT PASSWORD & OTP RESET
             ========================================================= */}
          {authMode === 'forgot_password' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {t('resetPassword')}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {language === 'hi' ? 'अपना पंजीकृत मोबाइल नंबर दर्ज करें और OTP से नया पासवर्ड बनाएं।' : 'Enter registered phone to verify via OTP and create a new password.'}
                </p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleForgotSendOtp}>
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

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }} disabled={loading}>
                    <KeyRound size={16} />
                    <span>{loading ? (language === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending...') : t('sendOtp')}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit}>
                  {/* Simulated SMS helper banner */}
                  <div 
                    className="sms-simulation-box"
                    onClick={() => setEnteredOtp('4821')}
                    style={{ marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', fontSize: '0.8rem', color: '#166534' }}>
                      <Sparkles size={13} />
                      <span>{t('simulatedSms')} <strong>4821</strong></span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary-forest)' }}>
                      👉 {t('clickToAutofill')}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{language === 'hi' ? 'OTP कोड (4-6 अंक) *' : 'Reset OTP Code (4-6 digits) *'}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.25rem', fontWeight: '800' }}
                      maxLength={6}
                      placeholder="••••••"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
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

                  <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
                    <CheckCircle2 size={17} />
                    <span>{t('resetPassword')}</span>
                  </button>
                </form>
              )}

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('password_login')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  ← {t('alreadyHaveAccount')}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 4: CREATE NEW ACCOUNT
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

              <button type="submit" className="btn-primary" style={{ marginTop: '0.85rem' }}>
                <CheckCircle2 size={17} />
                <span>{t('step3TitleRegister')}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="button"
                  onClick={() => switchMode('password_login')}
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
