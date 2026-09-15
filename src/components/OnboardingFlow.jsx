import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGIONS } from '../data/mockData';
import { 
  Sprout, 
  Tractor, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  KeyRound
} from 'lucide-react';

export function OnboardingFlow() {
  const {
    language,
    onboardingStep,
    setOnboardingStep,
    selectLanguageAndNext,
    selectRoleAndNext,
    loginWithPassword,
    resetPasswordDirect,
    registerNewUser,
    role,
    t
  } = useApp();

  const [loading, setLoading] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    location: 'Hanumangarh Town',
    regionId: 'hnm-town',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  
  // Auth Mode in Step 3: 'register' | 'login' | 'forgot_password'
  const [step3Mode, setStep3Mode] = useState('register');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [newResetPass, setNewResetPass] = useState('');
  const [confirmResetPass, setConfirmResetPass] = useState('');

  // 1. Direct Registration Form Submit (No OTP needed)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!formData.fullName.trim()) {
      setAuthError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setAuthError(language === 'hi' ? 'कृपया कम से कम 4 अक्षरों का पासवर्ड बनाएं' : 'Please enter a password with at least 4 characters');
      return;
    }

    setLoading(true);
    const res = await registerNewUser({
      ...formData,
      role: role || 'buyer'
    });
    setLoading(false);
    if (!res.success) {
      setAuthError(res.error || (language === 'hi' ? 'खाता बनाने में विफल' : 'Failed to create account'));
      if (res.alreadyRegistered) {
        setLoginPhone(formData.phone);
      }
    }
  };

  // 2. Direct Password Login Submit
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!loginPhone || loginPhone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your 10-digit mobile number');
      return;
    }
    if (!loginPassword) {
      setAuthError(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter your password');
      return;
    }

    setLoading(true);
    const res = await loginWithPassword(loginPhone, loginPassword);
    setLoading(false);
    if (!res.success) {
      setAuthError(res.error);
    }
  };

  // 3. Direct Password Reset Submit
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!loginPhone || loginPhone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your 10-digit mobile number');
      return;
    }
    if (newResetPass.length < 4) {
      setAuthError(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'Password must be at least 4 characters');
      return;
    }
    if (newResetPass !== confirmResetPass) {
      setAuthError(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    const res = await resetPasswordDirect(loginPhone, newResetPass);
    setLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to reset password');
    }
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-card">
        {/* Brand Banner */}
        <div className="onboarding-brand-header">
          <div className="logo-badge" style={{ margin: '0 auto 0.6rem', width: '52px', height: '52px', fontSize: '1.75rem' }}>
            <Sprout size={30} strokeWidth={2.4} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-forest)', lineHeight: '1.2' }}>
            Fresh Fetch
          </h1>
          <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
            {language === 'hi' ? 'खेत से सीधा आपकी रसोई तक' : language === 'pa' ? 'ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਤੁਹਾਡੀ ਰਸੋਈ ਤੱਕ' : 'Direct Farm to Kitchen Marketplace'}
          </p>

          {/* Step Progress Bar (when step > 1) */}
          {onboardingStep > 1 && (
            <div className="step-progress-container">
              <div className="step-progress-bar">
                <div 
                  className="step-progress-fill" 
                  style={{ width: `${((onboardingStep - 1) / 2) * 100}%` }}
                />
              </div>
              <div className="step-progress-labels">
                <span>{language === 'hi' ? `चरण ${onboardingStep - 1} / 2` : `Step ${onboardingStep - 1} of 2`}</span>
                <span>
                  {onboardingStep === 2 && (language === 'hi' ? 'भूमिका चयन' : 'Choose Role')}
                  {onboardingStep === 3 && (language === 'hi' ? 'खाता विवरण' : 'Account Details')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            STEP 1: ONLY LANGUAGE SELECTION (पहला चरण: केवल भाषा)
           ========================================================= */}
        {onboardingStep === 1 && (
          <div className="onboarding-step-content">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.4rem' }}>🌐</span>
              <h2 className="step-main-title">{t('step1Title')}</h2>
              <p className="step-sub-title">{t('step1Sub')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Hindi Option */}
              <button
                className="language-select-btn"
                onClick={() => selectLanguageAndNext('hi')}
              >
                <div className="lang-icon-circle">हिं</div>
                <div className="lang-text-wrap">
                  <div className="lang-name">हिंदी (Hindi)</div>
                  <div className="lang-sub">नमस्ते! ऐप का उपयोग हिंदी में करें</div>
                </div>
                <ChevronRight size={20} color="var(--primary-emerald)" />
              </button>

              {/* Punjabi Option */}
              <button
                className="language-select-btn"
                onClick={() => selectLanguageAndNext('pa')}
              >
                <div className="lang-icon-circle" style={{ background: '#fef3c7', color: 'var(--accent-gold)' }}>ਪੰ</div>
                <div className="lang-text-wrap">
                  <div className="lang-name">ਪੰਜਾਬੀ (Punjabi)</div>
                  <div className="lang-sub">ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਐਪ ਦੀ ਵਰਤੋਂ ਪੰਜਾਬੀ ਵਿੱਚ ਕਰੋ</div>
                </div>
                <ChevronRight size={20} color="var(--accent-gold)" />
              </button>

              {/* English Option */}
              <button
                className="language-select-btn"
                onClick={() => selectLanguageAndNext('en')}
              >
                <div className="lang-icon-circle" style={{ background: '#eff6ff', color: '#2563eb' }}>EN</div>
                <div className="lang-text-wrap">
                  <div className="lang-name">English</div>
                  <div className="lang-sub">Continue using app in English</div>
                </div>
                <ChevronRight size={20} color="#2563eb" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 2: CHOOSE ROLE (FARMER / PRODUCER VS BUYER)
           ========================================================= */}
        {onboardingStep === 2 && (
          <div className="onboarding-step-content">
            <button className="back-step-btn" onClick={() => setOnboardingStep(1)}>
              <ArrowLeft size={16} />
              <span>{t('stepBack')}</span>
            </button>

            <div style={{ textAlign: 'center', margin: '0.75rem 0 1.5rem' }}>
              <h2 className="step-main-title">{t('step2Title')}</h2>
              <p className="step-sub-title">{t('step2Sub')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Farmer Option */}
              <button
                className="role-selection-card seller-card"
                onClick={() => selectRoleAndNext('producer')}
              >
                <div className="role-icon-box" style={{ background: '#dcfce7', color: 'var(--primary-forest)' }}>
                  <Tractor size={32} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="role-card-header-line">
                    <span className="role-title-text">{t('roleProducer')}</span>
                    <span className="role-tag-badge seller">0% Middlemen</span>
                  </div>
                  <p className="role-desc-text">{t('roleProducerSub')}</p>
                </div>
                <ChevronRight size={20} color="var(--primary-emerald)" />
              </button>

              {/* Buyer Option */}
              <button
                className="role-selection-card buyer-card"
                onClick={() => selectRoleAndNext('buyer')}
              >
                <div className="role-icon-box" style={{ background: '#fef3c7', color: 'var(--accent-gold)' }}>
                  <ShoppingBag size={32} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="role-card-header-line">
                    <span className="role-title-text">{t('roleBuyer')}</span>
                    <span className="role-tag-badge buyer">100% Pure</span>
                  </div>
                  <p className="role-desc-text">{t('roleBuyerSub')}</p>
                </div>
                <ChevronRight size={20} color="var(--accent-gold)" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 3: REGISTRATION & SECURE LOGIN (NO OTP)
           ========================================================= */}
        {onboardingStep === 3 && (
          <div className="onboarding-step-content">
            <button className="back-step-btn" onClick={() => setOnboardingStep(2)}>
              <ArrowLeft size={16} />
              <span>{t('stepBack')}</span>
            </button>

            <div style={{ margin: '0.75rem 0 1.25rem' }}>
              <h2 className="step-main-title">
                {step3Mode === 'register' ? t('step3TitleRegister') :
                 step3Mode === 'forgot_password' ? t('resetPassword') :
                 t('step3TitleLogin')}
              </h2>
              <p className="step-sub-title">
                {step3Mode === 'register' ? t('step3SubRegister') :
                 step3Mode === 'forgot_password' ? (language === 'hi' ? 'अपना मोबाइल नंबर दर्ज कर नया पासवर्ड बनाएं' : 'Enter phone & create a new password') :
                 t('step3SubLogin')}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: '600', marginBottom: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: (authError.includes('sign in') || authError.includes('लॉगिन') || authError.includes('ਲਾਗਇਨ')) ? '0.6rem' : 0 }}>
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  <span style={{ lineHeight: '1.4' }}>{authError}</span>
                </div>
                {(authError.includes('sign in') || authError.includes('लॉगिन') || authError.includes('ਲਾਗਇਨ')) && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone(formData.phone || loginPhone);
                      setAuthError('');
                      setStep3Mode('login');
                    }}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      color: '#ffffff',
                      background: 'var(--primary-forest)',
                      border: 'none',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <span>{language === 'hi' ? 'यहाँ लॉगिन करें' : language === 'pa' ? 'ਇੱਥੇ ਲਾਗਇਨ ਕਰੋ' : 'Click here to Sign In'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}

            {authSuccess && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                ✅ {authSuccess}
              </div>
            )}

            {/* 1. Registration Form */}
            {step3Mode === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">{t('fullNameLabel')} *</label>
                  <div className="input-with-icon">
                    <User size={18} className="field-icon" />
                    <input
                      type="text"
                      className="form-input field-input"
                      placeholder={t('fullNamePlaceholder')}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth & Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('dobLabel')} *</label>
                    <div className="input-with-icon">
                      <Calendar size={18} className="field-icon" />
                      <input
                        type="date"
                        className="form-input field-input"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('locationLabel')}</label>
                    <div className="input-with-icon">
                      <MapPin size={18} className="field-icon" />
                      <select
                        className="form-select field-input"
                        value={formData.regionId}
                        onChange={(e) => {
                          const reg = REGIONS.find(r => r.id === e.target.value);
                          setFormData({
                            ...formData,
                            regionId: e.target.value,
                            location: reg ? reg.name : formData.location
                          });
                        }}
                      >
                        {REGIONS.filter(r => r.id !== 'all').map((r) => (
                          <option key={r.id} value={r.id}>
                            {language === 'hi' ? r.nameHi : language === 'pa' ? r.namePa : r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                  <label className="form-label">{t('phoneLabel')} *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="phone-prefix-badge">+91</span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder={t('phonePlaceholder')}
                      value={formData.phone}
                      maxLength={10}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                  </div>
                </div>

                {/* Set Password */}
                <div className="form-group">
                  <label className="form-label">{t('passwordLabel')} *</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={18} className="field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input field-input"
                      placeholder={t('passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }} disabled={loading}>
                  <CheckCircle2 size={18} />
                  <span>{loading ? (language === 'hi' ? 'खाता बन रहा है...' : 'Creating Account...') : (language === 'hi' ? 'खाता बनाएं और ऐप खोलें' : 'Create Account & Enter App')}</span>
                </button>
              </form>
            )}

            {/* 2. Password Login Form */}
            {step3Mode === 'login' && (
              <form onSubmit={handlePasswordLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">{t('phoneLabel')} *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="phone-prefix-badge">+91</span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder={t('phonePlaceholder')}
                      value={loginPhone}
                      maxLength={10}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">{t('loginPasswordLabel')} *</label>
                    <button
                      type="button"
                      onClick={() => { setAuthError(''); setStep3Mode('forgot_password'); }}
                      style={{ fontSize: '0.78rem', color: 'var(--primary-forest)', fontWeight: '700', textDecoration: 'underline' }}
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={18} className="field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input field-input"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }} disabled={loading}>
                  <span>{loading ? (language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...') : (language === 'hi' ? 'लॉगिन करें' : 'Login')}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* 3. Direct Forgot Password Form */}
            {step3Mode === 'forgot_password' && (
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">{t('phoneLabel')} *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="phone-prefix-badge">+91</span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder={t('phonePlaceholder')}
                      value={loginPhone}
                      maxLength={10}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
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
                    value={newResetPass}
                    onChange={(e) => setNewResetPass(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('confirmPasswordLabel')} *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmResetPass}
                    onChange={(e) => setConfirmResetPass(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }} disabled={loading}>
                  <CheckCircle2 size={17} />
                  <span>{loading ? (language === 'hi' ? 'पासवर्ड बदल रहा है...' : 'Resetting...') : t('resetPassword')}</span>
                </button>
              </form>
            )}

            {/* Bottom Toggle Between Register and Login */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
              {step3Mode === 'register' ? (
                <button
                  type="button"
                  onClick={() => { setAuthError(''); setStep3Mode('login'); }}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  {t('alreadyHaveAccount')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAuthError(''); setStep3Mode('register'); }}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-forest)', fontWeight: '700' }}
                >
                  ← {t('dontHaveAccount')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
