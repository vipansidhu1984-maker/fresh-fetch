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
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export function OnboardingFlow() {
  const {
    language,
    onboardingStep,
    setOnboardingStep,
    selectLanguageAndNext,
    selectRoleAndNext,
    loginWithPassword,
    verifyUserIdentityForReset,
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

  // 2-Step Forgot Password States
  const [forgotStep, setForgotStep] = useState(1);
  const [verifyFullName, setVerifyFullName] = useState('');
  const [verifyDob, setVerifyDob] = useState('');
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [newResetPass, setNewResetPass] = useState('');
  const [confirmResetPass, setConfirmResetPass] = useState('');

  // 1. Direct Registration Form Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!formData.fullName.trim()) {
      setAuthError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!formData.dob) {
      setAuthError(language === 'hi' ? 'कृपया अपनी जन्म तिथि चुनें' : 'Please select your date of birth');
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

  // 3. Step 1: Verify Identity (Name + DOB) before password reset
  const handleVerifyIdentitySubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!loginPhone || loginPhone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया 10 अंकों का पंजीकृत मोबाइल नंबर दर्ज करें' : 'Please enter your registered 10-digit mobile number');
      return;
    }
    if (!verifyFullName.trim()) {
      setAuthError(language === 'hi' ? 'कृपया अपना पंजीकृत पूरा नाम दर्ज करें' : 'Please enter your registered full name');
      return;
    }
    if (!verifyDob) {
      setAuthError(language === 'hi' ? 'कृपया अपनी पंजीकृत जन्म तिथि दर्ज करें' : 'Please select your registered date of birth');
      return;
    }

    setLoading(true);
    const res = await verifyUserIdentityForReset(loginPhone, verifyFullName, verifyDob);
    setLoading(false);

    if (!res.success) {
      setAuthError(res.error);
    } else {
      setVerifiedAccount(res.user);
      setAuthSuccess(res.message);
      setForgotStep(2);
    }
  };

  // 4. Step 2: Update Password after Identity Verification
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!newResetPass || newResetPass.length < 4) {
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

  const resetForgotState = () => {
    setAuthError('');
    setAuthSuccess('');
    setForgotStep(1);
    setVerifyFullName('');
    setVerifyDob('');
    setVerifiedAccount(null);
    setNewResetPass('');
    setConfirmResetPass('');
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
          <div className="onboarding-step-body animate-fadeIn">
            <div className="step-header">
              <h2 className="step-title">{t('step1Title')}</h2>
              <p className="step-sub-title">{t('step1Sub')}</p>
            </div>

            <div className="lang-select-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', marginTop: '1.5rem' }}>
              <button
                className={`lang-card-btn ${language === 'hi' ? 'selected' : ''}`}
                onClick={() => selectLanguageAndNext('hi')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🇮🇳</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>हिंदी (Hindi)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>हनुमानगढ़ और गंगानगर के लिए अनुशंसित</div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--primary-forest)" />
              </button>

              <button
                className={`lang-card-btn ${language === 'pa' ? 'selected' : ''}`}
                onClick={() => selectLanguageAndNext('pa')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🌾</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>ਪੰਜਾਬੀ (Punjabi)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ਪੰਜਾਬੀ ਵਿੱਚ ਸ਼ੁੱਧ ਖਰੀਦਦਾਰੀ ਕਰੋ</div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--primary-forest)" />
              </button>

              <button
                className={`lang-card-btn ${language === 'en' ? 'selected' : ''}`}
                onClick={() => selectLanguageAndNext('en')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🇬🇧</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>English</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Universal language</div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--primary-forest)" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 2: ONLY ROLE SELECTION (दूसरा चरण: खरीदार या किसान)
           ========================================================= */}
        {onboardingStep === 2 && (
          <div className="onboarding-step-body animate-fadeIn">
            <div className="step-header">
              <h2 className="step-title">{t('step2Title')}</h2>
              <p className="step-sub-title">{t('step2Sub')}</p>
            </div>

            <div className="role-select-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1.25rem' }}>
              {/* Buyer Choice */}
              <div 
                className="role-card"
                onClick={() => selectRoleAndNext('buyer')}
                style={{ cursor: 'pointer' }}
              >
                <div className="role-card-icon-wrap" style={{ background: '#fef3c7', color: 'var(--accent-gold)' }}>
                  <ShoppingBag size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="role-card-title">{t('buyerRoleTitle')}</h3>
                  <p className="role-card-desc">{t('buyerRoleDesc')}</p>
                </div>
                <ChevronRight size={20} color="var(--accent-gold)" />
              </div>

              {/* Farmer Choice */}
              <div 
                className="role-card"
                onClick={() => selectRoleAndNext('producer')}
                style={{ cursor: 'pointer' }}
              >
                <div className="role-card-icon-wrap" style={{ background: '#dcfce7', color: 'var(--primary-forest)' }}>
                  <Tractor size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="role-card-title">{t('farmerRoleTitle')}</h3>
                  <p className="role-card-desc">{t('farmerRoleDesc')}</p>
                </div>
                <ChevronRight size={20} color="var(--primary-emerald)" />
              </div>
            </div>

            <button 
              className="btn-back-link" 
              onClick={() => setOnboardingStep(1)}
              style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', width: '100%' }}
            >
              <ArrowLeft size={16} />
              <span>{t('stepBack')} (Change Language)</span>
            </button>
          </div>
        )}

        {/* =========================================================
            STEP 3: DIRECT SIGN UP OR LOGIN WITH PASSWORD
           ========================================================= */}
        {onboardingStep === 3 && (
          <div className="onboarding-step-body animate-fadeIn">
            {/* Top Switcher Tabs */}
            {step3Mode !== 'forgot_password' && (
              <div className="auth-tab-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  className={`auth-tab-btn ${step3Mode === 'register' ? 'active' : ''}`}
                  onClick={() => { setAuthError(''); setStep3Mode('register'); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: step3Mode === 'register' ? '#ffffff' : 'transparent',
                    color: step3Mode === 'register' ? 'var(--primary-forest)' : 'var(--text-muted)',
                    boxShadow: step3Mode === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  ✨ {language === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${step3Mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setAuthError(''); setStep3Mode('login'); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: step3Mode === 'login' ? '#ffffff' : 'transparent',
                    color: step3Mode === 'login' ? 'var(--primary-forest)' : 'var(--text-muted)',
                    boxShadow: step3Mode === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  🔑 {language === 'hi' ? 'लॉगिन करें' : 'Sign In'}
                </button>
              </div>
            )}

            <div className="step-header">
              <h2 className="step-title">
                {step3Mode === 'register' ? t('step3TitleRegister') :
                 step3Mode === 'forgot_password' ? (forgotStep === 1 ? t('identityVerificationTitle') : t('resetPassword')) :
                 t('step3TitleLogin')}
              </h2>
              <p className="step-sub-title">
                {step3Mode === 'register' ? t('step3SubRegister') :
                 step3Mode === 'forgot_password' ? (forgotStep === 1 ? t('identityVerificationSub') : (language === 'hi' ? 'नया सुरक्षित पासवर्ड सेट करें' : 'Set a new secure password')) :
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

                {/* Create Password */}
                <div className="form-group">
                  <label className="form-label">{t('createPasswordLabel')} *</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={18} className="field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input field-input"
                      placeholder="••••••••"
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
                  <span>{loading ? (language === 'hi' ? 'खाता बन रहा है...' : 'Creating Account...') : (language === 'hi' ? 'खाता बनाएं' : 'Create Account')}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* 2. Direct Password Login Form */}
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
                      onClick={() => { resetForgotState(); setStep3Mode('forgot_password'); }}
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

            {/* 3. Secure Forgot Password (2-Step Identity Verification) */}
            {step3Mode === 'forgot_password' && (
              <div>
                {/* STEP 1: IDENTITY VERIFICATION (Name + DOB) */}
                {forgotStep === 1 && (
                  <form onSubmit={handleVerifyIdentitySubmit}>
                    {/* Registered Phone */}
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
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Registered Full Name */}
                    <div className="form-group">
                      <label className="form-label">{t('fullNameLabel')} ({language === 'hi' ? 'पंजीकृत नाम' : 'Registered'}) *</label>
                      <div className="input-with-icon">
                        <User size={18} className="field-icon" />
                        <input
                          type="text"
                          className="form-input field-input"
                          placeholder={t('fullNamePlaceholder')}
                          value={verifyFullName}
                          onChange={(e) => setVerifyFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Registered Date of Birth */}
                    <div className="form-group">
                      <label className="form-label">{t('dobLabel')} ({language === 'hi' ? 'पंजीकृत जन्म तिथि' : 'Registered'}) *</label>
                      <div className="input-with-icon">
                        <Calendar size={18} className="field-icon" />
                        <input
                          type="date"
                          className="form-input field-input"
                          value={verifyDob}
                          onChange={(e) => setVerifyDob(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }} disabled={loading}>
                      <ShieldCheck size={18} />
                      <span>{loading ? (language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...') : t('verifyIdentityBtn')}</span>
                    </button>
                  </form>
                )}

                {/* STEP 2: SET NEW PASSWORD */}
                {forgotStep === 2 && (
                  <form onSubmit={handleResetPasswordSubmit}>
                    {verifiedAccount && (
                      <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={20} color="#16a34a" />
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#065f46' }}>
                            {verifiedAccount.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                            ✓ {t('verifiedAccountLabel')} • +91 {verifiedAccount.phone}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">{t('newPasswordLabel')} *</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={newResetPass}
                        onChange={(e) => setNewResetPass(e.target.value)}
                        required
                        autoFocus
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
                      <KeyRound size={18} />
                      <span>{loading ? (language === 'hi' ? 'पासवर्ड बदल रहा है...' : 'Updating...') : t('resetPassword')}</span>
                    </button>
                  </form>
                )}
              </div>
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
