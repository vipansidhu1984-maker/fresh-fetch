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
  Smartphone,
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
    submitRegistrationAndRequestOtp,
    verifyOtpAndComplete,
    loginWithPassword,
    requestLoginOtp,
    requestPasswordReset,
    resetPasswordWithOtp,
    isFirebaseConfigured,
    sendFirebasePhoneOtp,
    verifyFirebasePhoneOtp,
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
  
  // Auth Mode in Step 3: 'register' | 'login_password' | 'login_otp' | 'forgot_password'
  const [step3Mode, setStep3Mode] = useState('register');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // OTP State (6 Digits for Firebase SMS & 4 Digits for Test Codes)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = React.useRef([]);
  const [newResetPass, setNewResetPass] = useState('');
  const [confirmResetPass, setConfirmResetPass] = useState('');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState('');

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Handle paste of full code
      const pastedChars = clean.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedChars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedChars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);

    // Auto move to next input if filled
    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      const focusIdx = Math.min(pasteData.length, 5);
      otpInputRefs.current[focusIdx]?.focus();
    }
  };

  const autofillTestOtp = () => {
    setOtpDigits(['4', '8', '2', '1', '', '']);
    setAuthError('');
  };

  // 1. Submit Registration Form -> Go to Step 4 (OTP)
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
    setOtpDigits(['', '', '', '', '', '']);

    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(formData.phone);
      setLoading(false);
      if (res.success) {
        submitRegistrationAndRequestOtp(formData);
      } else {
        // Even if SMS fails (e.g. rate limit), allow proceeding with test code
        submitRegistrationAndRequestOtp(formData);
        setAuthError(res.error || 'SMS OTP failed. You can use Test OTP 4821 below.');
      }
    } else {
      setLoading(false);
      submitRegistrationAndRequestOtp(formData);
    }
  };

  // 2. Submit Password Login
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

  // 3. Submit OTP Login Request
  const handleOtpLoginRequest = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!loginPhone || loginPhone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your 10-digit mobile number');
      return;
    }

    setLoading(true);
    setOtpDigits(['', '', '', '', '', '']);

    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(loginPhone);
      setLoading(false);
      if (res.success) {
        submitRegistrationAndRequestOtp({
          phone: loginPhone,
          isOtpLogin: true
        });
      } else {
        submitRegistrationAndRequestOtp({
          phone: loginPhone,
          isOtpLogin: true
        });
        setAuthError(res.error || 'SMS failed. You can use Test OTP 4821 below.');
      }
    } else {
      setLoading(false);
      const res = requestLoginOtp(loginPhone);
      if (res.success) {
        submitRegistrationAndRequestOtp({
          phone: loginPhone,
          isOtpLogin: true
        });
      } else {
        setAuthError(res.error);
      }
    }
  };

  // 4. Submit Forgot Password OTP Request
  const handleForgotOtpRequest = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!loginPhone || loginPhone.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your 10-digit mobile number');
      return;
    }

    setLoading(true);
    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(loginPhone);
      setLoading(false);
      setResetOtpSent(true);
      if (res.success) {
        setAuthSuccess(language === 'hi' ? 'सत्यापन SMS भेजा गया' : 'Verification SMS Sent');
      } else {
        setAuthError(res.error || 'SMS failed. You can use Test OTP 4821.');
      }
    } else {
      setLoading(false);
      const res = requestPasswordReset(loginPhone);
      if (res.success) {
        setResetOtpSent(true);
        setResetOtpCode('4821');
        setAuthSuccess(language === 'hi' ? 'OTP भेजा गया: 4821' : 'Reset OTP Sent: 4821');
      } else {
        setAuthError(res.error);
      }
    }
  };

  // Submit Password Reset
  const handleResetPasswordFinal = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (newResetPass.length < 4) {
      setAuthError(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : 'Password must be at least 4 characters');
      return;
    }
    if (newResetPass !== confirmResetPass) {
      setAuthError(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    if (isFirebaseConfigured && window.confirmationResult) {
      const res = await verifyFirebasePhoneOtp(resetOtpCode);
      setLoading(false);
      if (res.success) {
        resetPasswordWithOtp(loginPhone, resetOtpCode || '4821', newResetPass);
      } else {
        setAuthError(res.error || 'Invalid OTP code');
      }
    } else {
      setLoading(false);
      const res = await resetPasswordWithOtp(loginPhone, resetOtpCode || '4821', newResetPass);
      if (!res.success) {
        setAuthError(res.error);
      }
    }
  };

  // Step 4 OTP verify
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const code = otpDigits.join('').trim();

    if (!code || code.length < 4) {
      setAuthError(language === 'hi' ? 'कृपया पूरा OTP कोड दर्ज करें (4 से 6 अंक)' : 'Please enter the complete OTP code (4-6 digits)');
      return;
    }

    setLoading(true);
    if (isFirebaseConfigured && window.confirmationResult) {
      const res = await verifyFirebasePhoneOtp(code);
      setLoading(false);
      if (res.success) {
        verifyOtpAndComplete(code);
      } else {
        setAuthError(res.error || 'Invalid OTP code. Please check your SMS or use Test Code 4821.');
      }
    } else {
      setLoading(false);
      verifyOtpAndComplete(code);
    }
  };

  // Resend OTP in Step 4
  const handleResendOtp = async () => {
    setAuthError('');
    setAuthSuccess('');
    const phoneToUse = formData.phone || loginPhone;
    if (!phoneToUse) return;

    setLoading(true);
    if (isFirebaseConfigured) {
      const res = await sendFirebasePhoneOtp(phoneToUse);
      setLoading(false);
      if (res.success) {
        setAuthSuccess(language === 'hi' ? 'नया SMS OTP भेजा गया है' : 'New SMS OTP Sent!');
      } else {
        setAuthError(res.error || 'Could not resend SMS. You can use Test OTP 4821.');
      }
    } else {
      setLoading(false);
      setAuthSuccess(language === 'hi' ? 'नया टेस्ट OTP: 4821' : 'New Test OTP: 4821');
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
                  style={{ width: `${((onboardingStep - 1) / 3) * 100}%` }}
                />
              </div>
              <div className="step-progress-labels">
                <span>{language === 'hi' ? `चरण ${onboardingStep - 1} / 3` : `Step ${onboardingStep - 1} of 3`}</span>
                <span>
                  {onboardingStep === 2 && (language === 'hi' ? 'भूमिका चयन' : 'Choose Role')}
                  {onboardingStep === 3 && (language === 'hi' ? 'खाता विवरण' : 'Account Details')}
                  {onboardingStep === 4 && (language === 'hi' ? 'OTP सत्यापन' : 'OTP Verify')}
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
            STEP 3: REGISTRATION & SECURE LOGIN
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
                 step3Mode === 'forgot_password' ? (language === 'hi' ? 'अपना मोबाइल नंबर दर्ज कर नया पासवर्ड बनाएं' : 'Reset password with OTP') :
                 t('step3SubLogin')}
              </p>
            </div>

            {/* Sub-Tabs for Login / Password / OTP */}
            {step3Mode !== 'register' && step3Mode !== 'forgot_password' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setAuthError(''); setStep3Mode('login_password'); }}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: step3Mode === 'login_password' ? '#ffffff' : 'transparent',
                    color: step3Mode === 'login_password' ? 'var(--primary-forest)' : 'var(--text-muted)',
                    boxShadow: step3Mode === 'login_password' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  🔑 {t('loginWithPassword')}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthError(''); setStep3Mode('login_otp'); }}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: step3Mode === 'login_otp' ? '#ffffff' : 'transparent',
                    color: step3Mode === 'login_otp' ? 'var(--primary-forest)' : 'var(--text-muted)',
                    boxShadow: step3Mode === 'login_otp' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  📱 {t('loginWithOtp')}
                </button>
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                ⚠️ {authError}
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

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                  <span>{t('stepNext')}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* 2. Password Login Form */}
            {step3Mode === 'login_password' && (
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

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                  <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* 3. OTP Login Form */}
            {step3Mode === 'login_otp' && (
              <form onSubmit={handleOtpLoginRequest}>
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

                <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                  <Smartphone size={17} />
                  <span>{t('sendOtp')}</span>
                </button>
              </form>
            )}

            {/* 4. Forgot Password Flow */}
            {step3Mode === 'forgot_password' && (
              <div>
                {!resetOtpSent ? (
                  <form onSubmit={handleForgotOtpRequest}>
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

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                      <KeyRound size={17} />
                      <span>{t('sendOtp')}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordFinal}>
                    {/* Simulated SMS notification */}
                    <div 
                      className="sms-simulation-box"
                      onClick={() => setResetOtpCode('4821')}
                      style={{ marginBottom: '0.85rem', cursor: 'pointer' }}
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
                        style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.2rem', fontWeight: '800' }}
                        maxLength={6}
                        placeholder="4821"
                        value={resetOtpCode}
                        onChange={(e) => setResetOtpCode(e.target.value.replace(/\D/g, ''))}
                        required
                      />
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

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                      <CheckCircle2 size={17} />
                      <span>{t('resetPassword')}</span>
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
                  onClick={() => { setAuthError(''); setStep3Mode('login_password'); }}
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

        {/* =========================================================
            STEP 4: OTP VERIFICATION SCREEN (चौथा चरण: OTP)
           ========================================================= */}
        {onboardingStep === 4 && (
          <div className="onboarding-step-content">
            <button className="back-step-btn" onClick={() => setOnboardingStep(3)}>
              <ArrowLeft size={16} />
              <span>{t('stepBack')}</span>
            </button>

            <div style={{ textAlign: 'center', margin: '0.75rem 0 1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Smartphone size={28} />
              </div>
              <h2 className="step-main-title">{t('step4Title')}</h2>
              <p className="step-sub-title">
                {t('otpSentTo')} <strong>+91 {formData.phone || loginPhone || '9876543210'}</strong>
              </p>
            </div>

            {/* Error Message Display inside Step 4 */}
            {authError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                ⚠️ {authError}
              </div>
            )}

            {authSuccess && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                ✅ {authSuccess}
              </div>
            )}

            {/* Simulated SMS Notification Banner */}
            <div 
              className="sms-simulation-box"
              onClick={autofillTestOtp}
              style={{ cursor: 'pointer', marginBottom: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', fontSize: '0.82rem', color: '#166534' }}>
                  <Sparkles size={14} />
                  <span>{language === 'hi' ? 'टेस्ट OTP कोड:' : 'Instant Test Code:'} <strong>4821</strong></span>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary-forest)', fontWeight: '700', textDecoration: 'underline' }}>
                  👉 {language === 'hi' ? 'ऑटो-भरें' : 'Click to Autofill'}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {language === 'hi' 
                  ? 'यदि मोबाइल पर SMS नहीं आया या दर सीमा (Rate Limit) है, तो 4821 से तुरंत आगे बढ़ें।' 
                  : 'If SMS quota is exhausted or delayed, click above to test instantly.'}
              </div>
            </div>

            <form onSubmit={handleOtpSubmit}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1.25rem 0 1.5rem', flexWrap: 'nowrap' }}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className={`otp-digit-input ${digit ? 'has-value' : ''}`}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    placeholder="•"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.9rem' }} disabled={loading}>
                <CheckCircle2 size={18} />
                <span>{loading ? (language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...') : t('verifyAndProceed')}</span>
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
              <button
                type="button"
                onClick={() => setOnboardingStep(3)}
                style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}
              >
                ← {language === 'hi' ? 'नंबर बदलें' : 'Change Phone'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                style={{ fontSize: '0.82rem', color: 'var(--primary-forest)', fontWeight: '700' }}
              >
                🔄 {t('resendOtp')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
