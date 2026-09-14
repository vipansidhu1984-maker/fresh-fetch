import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Heart, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { language, switchLanguage, setShowAboutModal, setShowPrivacyModal, t } = useApp();

  return (
    <footer 
      className="app-footer"
      style={{ 
        background: 'var(--card-bg)', 
        borderTop: '1px solid var(--card-border)', 
        padding: '3rem 1rem 2rem',
        marginTop: 'auto'
      }}
    >
      <div 
        style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'linear-gradient(135deg, var(--primary-forest), var(--primary-emerald))', 
                borderRadius: 'var(--radius-md)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Sprout size={20} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-forest)' }}>
              Fresh Fetch
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
            {t('tagline')}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>Made with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>by <strong>Vipandeep</strong> (AIT Pune) & <strong>Jashan</strong></span>
          </div>
        </div>

        {/* Col 2: Phase 1 Regions */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-forest)', marginBottom: '0.75rem' }}>
            📍 {language === 'hi' ? 'कवर किए गए क्षेत्र (Phase 1)' : 'Locations (Phase 1)'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>• <strong>Hanumangarh:</strong> Town, Junction, Sangaria, Nohar, Bhadra, Pilibanga, Rawatsar, Tibbi</li>
            <li>• <strong>Sri Ganganagar:</strong> City, Suratgarh, Padampur, Raisinghnagar, Anupgarh, Sadulshahar</li>
          </ul>
        </div>

        {/* Col 3: WhatsApp Helpline (No button, clear helpline display) */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-forest)', marginBottom: '0.75rem' }}>
            💬 {language === 'hi' ? 'सीधा संपर्क एवं हेल्पलाइन' : 'WhatsApp Helpline & Support'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {language === 'hi' 
              ? 'यदि आप एक किसान हैं और अपने उत्पाद जोड़ना चाहते हैं, या किसी सहायता की आवश्यकता है, तो हमारे हेल्पलाइन नंबर पर संपर्क करें।' 
              : 'Are you a farmer wanting to list your pure items or need buyer assistance? Contact our helpline directly.'}
          </p>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.6rem 0.95rem', 
              background: '#ecfdf5', 
              border: '1.5px solid #a7f3d0', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem', 
              fontWeight: '800', 
              color: 'var(--whatsapp-dark)' 
            }}
          >
            <MessageCircle size={18} color="var(--whatsapp-dark)" />
            <span>WhatsApp: </span>
            <a 
              href="https://wa.me/918107008156?text=Namaste%20Fresh%20Fetch%20Team!%20I%20need%20assistance/support." 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'underline', color: 'var(--whatsapp-dark)' }}
              title="Click to message on WhatsApp"
            >
              +91 8107008156
            </a>
          </div>
        </div>
      </div>

      <div 
        style={{ 
          maxWidth: '1280px', 
          margin: '2rem auto 0', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--card-border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div>
          © {new Date().getFullYear()} Fresh Fetch Technologies. All rights reserved. Hanumangarh & Sri Ganganagar, Rajasthan.
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => switchLanguage('en')} style={{ fontWeight: language === 'en' ? '700' : '500' }}>English</button>
          <button onClick={() => switchLanguage('hi')} style={{ fontWeight: language === 'hi' ? '700' : '500' }}>हिंदी</button>
          <button onClick={() => switchLanguage('pa')} style={{ fontWeight: language === 'pa' ? '700' : '500' }}>ਪੰਜਾਬੀ</button>
          <button onClick={() => setShowPrivacyModal(true)} style={{ color: 'var(--primary-emerald)', fontWeight: '700', textDecoration: 'underline' }}>
            {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
          </button>
          <button onClick={() => setShowAboutModal(true)} style={{ color: 'var(--primary-forest)', fontWeight: '700' }}>About Us</button>
        </div>
      </div>
    </footer>
  );
}
