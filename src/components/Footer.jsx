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

        {/* Col 2: Service Locations */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-forest)', marginBottom: '0.75rem' }}>
            📍 {language === 'hi' ? 'सेवारत क्षेत्र' : language === 'pa' ? 'ਸੇਵਾ ਖੇਤਰ' : 'Service Locations'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            <strong>Hanumangarh</strong> & <strong>Sri Ganganagar</strong>, Rajasthan
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {language === 'hi' 
              ? 'स्थानीय किसानों और उपभोक्ताओं के लिए 100% शुद्ध और सत्यापित कृषि उत्पाद।' 
              : 'Direct-to-consumer platform for verified pure farmer produce.'}
          </p>
        </div>

        {/* Col 3: WhatsApp Helpline (Dual Numbers) */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-forest)', marginBottom: '0.75rem' }}>
            💬 {language === 'hi' ? 'व्हाट्सएप सहायता हेल्पलाइन' : 'WhatsApp Helpline & Support'}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {language === 'hi' 
              ? 'किसान लिस्टिंग या ग्राहक सहायता के लिए हमारे हेल्पलाइन नंबरों पर संपर्क करें।' 
              : 'For farmer listings, orders, or inquiries, reach out to our support team directly.'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a 
              href="https://wa.me/918107008156?text=Namaste%20Fresh%20Fetch%20Team!%20I%20need%20assistance/support." 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                padding: '0.5rem 0.75rem', 
                background: '#ecfdf5', 
                border: '1.5px solid #a7f3d0', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', 
                fontWeight: '800', 
                color: 'var(--whatsapp-dark)',
                textDecoration: 'none'
              }}
              title="Click to message Vipandeep on WhatsApp"
            >
              <MessageCircle size={15} color="var(--whatsapp-dark)" />
              <span>+91 8107008156</span>
            </a>

            <a 
              href="https://wa.me/919511544399?text=Namaste%20Fresh%20Fetch%20Team!%20I%20need%20assistance/support." 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                padding: '0.5rem 0.75rem', 
                background: '#ecfdf5', 
                border: '1.5px solid #a7f3d0', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', 
                fontWeight: '800', 
                color: 'var(--whatsapp-dark)',
                textDecoration: 'none'
              }}
              title="Click to message Support on WhatsApp"
            >
              <MessageCircle size={15} color="var(--whatsapp-dark)" />
              <span>+91 9511544399</span>
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
