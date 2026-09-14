import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sprout, Heart, Target, MapPin, Users, Award, ShieldCheck } from 'lucide-react';

export function AboutModal() {
  const { showAboutModal, setShowAboutModal, t, language } = useApp();

  if (!showAboutModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: 'var(--radius-md)', 
                background: 'linear-gradient(135deg, var(--primary-forest), var(--primary-emerald))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sprout size={20} />
            </div>
            <h3 className="modal-title">{t('aboutTitle')}</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAboutModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '0.95rem', lineHeight: '1.65', color: 'var(--text-primary)' }}>
          {/* Founders Highlight Banner */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', 
              border: '1.5px solid #a7f3d0', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-forest)', fontWeight: '800', marginBottom: '0.5rem' }}>
              <Users size={18} />
              <span>{language === 'hi' ? 'संस्थापक एवं प्रेरणा' : 'Founders & Vision'}</span>
            </div>
            <p style={{ color: '#166534', fontSize: '0.92rem' }}>
              {language === 'hi' ? (
                <>
                  <strong>विपनदीप सिंह</strong> (हनुमानगढ़ निवासी, BTech 1st Year, AIT पुणे) और उनके भाई <strong>जशन</strong> (श्रीगंगानगर, राजस्थान) द्वारा शुरू किया गया एक अभिनव स्टार्टअप।
                </>
              ) : language === 'pa' ? (
                <>
                  <strong>ਵਿਪਨਦੀਪ ਸਿੰਘ</strong> (ਹਨੂਮਾਨਗੜ੍ਹ ਨਿਵਾਸੀ, BTech 1st Year, AIT ਪੁਣੇ) ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਭਰਾ <strong>ਜਸ਼ਨ</strong> (ਸ੍ਰੀ ਗੰਗਾਨਗਰ, ਰਾਜਸਥਾਨ) ਵੱਲੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ ਵਿਸ਼ੇਸ਼ ਸਟਾਰਟਅੱਪ।
                </>
              ) : (
                <>
                  Founded by <strong>Vipandeep Singh</strong> (Hanumangarh native, 1st year BTech student at AIT Pune) and his brother <strong>Jashan</strong> (Sri Ganganagar, Rajasthan).
                </>
              )}
            </p>
          </div>

          {/* The Problem & Solution */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={16} color="var(--accent-gold)" />
              <span>{language === 'hi' ? 'हमारा उद्देश्य (Our Mission)' : 'Our Mission'}</span>
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('aboutStory')}
            </p>
          </div>

          {/* Key Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.25rem 0' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                🤝 0% Middlemen
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'कोई बिचौलिया नहीं, सारा मुनाफा सीधे किसान के पास।' : '100% direct profit to hardworking farmers.'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--accent-gold)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                🍯 100% Pure & Desi
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'पारंपरिक बिलोना घी, हाथ की पिसी हल्दी और कच्ची घाणी तेल।' : 'Vedic Bilona Ghee & cold-pressed oils.'}
              </div>
            </div>
          </div>

          {/* Region Coverage */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            📍 <strong>Phase 1 Launch:</strong> Hanumangarh (Town, Junction, Sangaria, Nohar, Bhadra, Pilibanga, Tibbi) & Sri Ganganagar (Suratgarh, Padampur, Raisinghnagar, Anupgarh, Sadulshahar).
          </div>

          <button 
            className="btn-primary" 
            style={{ marginTop: '1.5rem' }} 
            onClick={() => setShowAboutModal(false)}
          >
            {language === 'hi' ? 'बाज़ार देखें (Explore Marketplace)' : 'Explore Fresh Fetch Marketplace'}
          </button>
        </div>
      </div>
    </div>
  );
}
