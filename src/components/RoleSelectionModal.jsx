import React from 'react';
import { useApp } from '../context/AppContext';
import { Tractor, ShoppingBag, CheckCircle, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export function RoleSelectionModal() {
  const { 
    showRoleModal, 
    setShowRoleModal, 
    handleSelectRole, 
    language, 
    switchLanguage, 
    t 
  } = useApp();

  if (!showRoleModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '620px' }}>
        <div style={{ textAlign: 'center', padding: '2rem 1.75rem 1rem' }}>
          {/* Language Switcher on Welcome Screen */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <div className="lang-selector-group">
              <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => switchLanguage('en')}
              >
                English
              </button>
              <button
                className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                onClick={() => switchLanguage('hi')}
              >
                हिंदी (Hindi)
              </button>
              <button
                className={`lang-btn ${language === 'pa' ? 'active' : ''}`}
                onClick={() => switchLanguage('pa')}
              >
                ਪੰਜਾਬੀ (Punjabi)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🌾</span>
            <h2 className="modal-title" style={{ fontSize: '1.75rem' }}>
              {t('welcomeTitle')}
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            {t('welcomeSub')}
          </p>
        </div>

        <div className="modal-body" style={{ paddingTop: '0.5rem' }}>
          <div className="role-choice-grid">
            {/* Farmer / Producer Option */}
            <button
              className="role-card-btn seller-type"
              onClick={() => handleSelectRole('producer')}
            >
              <div 
                className="role-card-icon-wrap" 
                style={{ background: '#dcfce7', color: 'var(--primary-forest)' }}
              >
                <Tractor size={36} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="role-card-title">{t('roleProducer')}</h3>
                <p className="role-card-sub" style={{ marginTop: '0.4rem' }}>
                  {t('roleProducerSub')}
                </p>
              </div>
              <div 
                className="role-card-tag"
                style={{ background: '#ecfdf5', color: '#15803d', border: '1px solid #bbf7d0' }}
              >
                ✨ 0% Commission • Direct WhatsApp
              </div>
            </button>

            {/* Buyer / Consumer Option */}
            <button
              className="role-card-btn buyer-type"
              onClick={() => handleSelectRole('buyer')}
            >
              <div 
                className="role-card-icon-wrap" 
                style={{ background: '#fef3c7', color: 'var(--accent-gold)' }}
              >
                <ShoppingBag size={36} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="role-card-title">{t('roleBuyer')}</h3>
                <p className="role-card-sub" style={{ marginTop: '0.4rem' }}>
                  {t('roleBuyerSub')}
                </p>
              </div>
              <div 
                className="role-card-tag"
                style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
              >
                🛡️ 100% Pure • No Middlemen
              </div>
            </button>
          </div>

          {/* Value highlights */}
          <div 
            style={{ 
              marginTop: '1.75rem', 
              background: 'var(--bg-subtle)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--primary-emerald)" />
              <span>{language === 'hi' ? '100% शुद्धता गारंटी' : 'Pure Desi Ghee & Spices'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HeartHandshake size={16} color="var(--accent-gold)" />
              <span>{language === 'hi' ? 'सीधा किसान से' : 'Direct from Farmers'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
