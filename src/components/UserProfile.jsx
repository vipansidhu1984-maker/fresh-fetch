import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditProfileModal } from './EditProfileModal';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Tractor, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  Globe, 
  Package, 
  MessageCircle, 
  Heart, 
  HelpCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Edit3,
  Camera
} from 'lucide-react';

export function UserProfile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const { 
    currentUser, 
    role, 
    switchRole, 
    logout, 
    language, 
    switchLanguage, 
    products, 
    inquiries, 
    wishlist, 
    setActiveTab, 
    setShowAboutModal, 
    setShowPrivacyModal,
    t 
  } = useApp();

  const myProducts = products.filter(
    (p) => p && !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'].includes(p.id) && (currentUser ? (p.sellerId === currentUser.id || p.sellerPhone === currentUser.phone) : false)
  );

  const myInquiries = (inquiries || []).filter(
    (inq) => currentUser ? (inq.sellerId === currentUser.id || inq.sellerPhone === currentUser.phone) : inq.sellerId === 'farmer-ramesh'
  );

  const buyerInquiries = (inquiries || []).filter(
    (inq) => currentUser ? (inq.buyerPhone === currentUser.phone) : false
  );

  const handleLogout = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप लॉग आउट करना चाहते हैं?' : language === 'pa' ? 'ਕੀ ਤੁਸੀਂ ਲਾਗ ਆਊਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?' : 'Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Profile Header Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-forest) 0%, #15803d 100%)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.5rem', 
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
          {/* Avatar with click-to-edit badge */}
          <div 
            onClick={() => setShowEditModal(true)}
            style={{ 
              position: 'relative',
              cursor: 'pointer'
            }}
            title={language === 'hi' ? 'फ़ोटो या विवरण बदलें' : 'Edit profile photo'}
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ 
                  width: '68px', 
                  height: '68px', 
                  borderRadius: 'var(--radius-full)', 
                  objectFit: 'cover',
                  border: '3px solid #ffffff',
                  boxShadow: 'var(--shadow-md)',
                  display: 'block'
                }} 
              />
            ) : (
              <div 
                style={{ 
                  width: '68px', 
                  height: '68px', 
                  borderRadius: 'var(--radius-full)', 
                  background: '#ffffff', 
                  color: 'var(--primary-forest)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.7rem',
                  fontWeight: '800',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            {/* Camera badge overlay */}
            <div 
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-amber)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid #ffffff'
              }}
            >
              <Camera size={12} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>
                {currentUser?.name || 'User Profile'}
              </h2>
              <ShieldCheck size={18} color="#86efac" />
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#bbf7d0', marginTop: '0.2rem' }}>
              {role === 'producer' ? (
                <span>🚜 {t('roleProducer')}</span>
              ) : (
                <span>🛍️ {t('roleBuyer')}</span>
              )}
            </p>

            {/* Edit Profile Button in Header Card */}
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                marginTop: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={12} />
              <span>{language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Role & Status Strip */}
        <div style={{ marginTop: '1.15rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#dcfce7' }}>
            {t('activeRole')}: <strong>{role === 'producer' ? t('producerBadge') : t('buyerBadge')}</strong>
          </span>
          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.18)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: '#ffffff', fontWeight: '700' }}>
            ✓ {language === 'hi' ? 'सत्यापित खाता' : 'Verified Member'}
          </span>
        </div>
      </div>

      {/* Profile Details Card */}
      <div 
        style={{ 
          background: 'var(--card-bg)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1.5px solid var(--card-border)', 
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
            {language === 'hi' ? 'व्यक्तिगत जानकारी' : language === 'pa' ? 'ਨਿੱਜੀ ਜਾਣਕਾਰੀ' : 'Personal Details'}
          </h3>
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--primary-emerald)',
              background: 'var(--bg-subtle)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={13} />
            <span>{language === 'hi' ? 'संपादित करें (Edit)' : 'Edit'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: '#ecfdf5', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('phoneLabel')}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>+91 {currentUser?.phone || '9876543210'}</div>
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: '#fef3c7', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('locationLabel')}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>{currentUser?.location || 'Hanumangarh'}</div>
            </div>
          </div>

          {/* Date of Birth */}
          {currentUser?.dob && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dobLabel')}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>{currentUser.dob}</div>
              </div>
            </div>
          )}

          {/* Farm Name (Only for Farmer / Producer Role) */}
          {role === 'producer' && currentUser?.farmName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Tractor size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Farm / Goshala</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>{currentUser.farmName}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary Card */}
      <div 
        style={{ 
          background: '#ffffff', 
          borderRadius: 'var(--radius-lg)', 
          border: '1.5px solid var(--card-border)', 
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-forest)', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          {language === 'hi' ? 'आपकी गतिविधि' : language === 'pa' ? 'ਤੁਹਾਡੀ ਗਤੀਵਿਧੀ' : 'Activity Summary'}
        </h3>

        {role === 'producer' ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#f0fdf4', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-forest)' }}>{myProducts.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('totalProducts')}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--whatsapp-dark)' }}>{myInquiries.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('whatsappLeads')}</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('listings')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Package size={16} />
              <span>{t('myListings')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fef2f2', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444' }}>{wishlist.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('navWishlist')}</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--whatsapp-dark)' }}>{buyerInquiries.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Orders Contacted</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('marketplace')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShoppingBag size={16} />
              <span>{language === 'hi' ? 'बाज़ार में उत्पाद देखें' : 'Browse Marketplace'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Language Preferences Card */}
      <div 
        style={{ 
          background: '#ffffff', 
          borderRadius: 'var(--radius-lg)', 
          border: '1.5px solid var(--card-border)', 
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <Globe size={18} color="var(--primary-forest)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
            {t('step1Title')}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <button
            onClick={() => switchLanguage('en')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: language === 'en' ? '2px solid var(--primary-forest)' : '1px solid var(--card-border)',
              background: language === 'en' ? '#f0fdf4' : 'var(--bg-subtle)',
              fontWeight: '800',
              fontSize: '0.85rem',
              color: language === 'en' ? 'var(--primary-forest)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            English
          </button>
          <button
            onClick={() => switchLanguage('hi')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: language === 'hi' ? '2px solid var(--primary-forest)' : '1px solid var(--card-border)',
              background: language === 'hi' ? '#f0fdf4' : 'var(--bg-subtle)',
              fontWeight: '800',
              fontSize: '0.85rem',
              color: language === 'hi' ? 'var(--primary-forest)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            हिंदी
          </button>
          <button
            onClick={() => switchLanguage('pa')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: language === 'pa' ? '2px solid var(--primary-forest)' : '1px solid var(--card-border)',
              background: language === 'pa' ? '#f0fdf4' : 'var(--bg-subtle)',
              fontWeight: '800',
              fontSize: '0.85rem',
              color: language === 'pa' ? 'var(--primary-forest)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            ਪੰਜਾਬੀ
          </button>
        </div>
      </div>

      {/* Aesthetic Compact Service Area Tag */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.45rem', 
          padding: '0.6rem 1rem', 
          background: 'var(--bg-subtle)', 
          borderRadius: 'var(--radius-full)', 
          border: '1px solid var(--card-border)', 
          fontSize: '0.8rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}
      >
        <MapPin size={14} color="var(--primary-emerald)" />
        <span>
          <strong style={{ color: 'var(--primary-forest)' }}>Hanumangarh & Sri Ganganagar</strong>, Rajasthan
        </span>
      </div>

      {/* Actions: Support Helpline (Dual Numbers), About Founders & Log Out */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--whatsapp-dark)', fontWeight: '800', fontSize: '0.86rem', marginBottom: '0.6rem' }}>
            <MessageCircle size={17} />
            <span>{language === 'hi' ? 'व्हाट्सएप सहायता हेल्पलाइन' : language === 'pa' ? 'ਵਟਸਐਪ ਸਹਾਇਤਾ ਹੈਲਪਲਾਈਨ' : 'WhatsApp Support & Helpline'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <a
              href="https://wa.me/918107008156?text=Namaste%20Fresh%20Fetch%20Team!%20I%20need%20help/support."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                background: '#ffffff',
                border: '1px solid #6ee7b7',
                color: 'var(--whatsapp-dark)',
                fontWeight: '800',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>+91 8107008156</span>
            </a>
            <a
              href="https://wa.me/919511544399?text=Namaste%20Fresh%20Fetch%20Team!%20I%20need%20help/support."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                background: '#ffffff',
                border: '1px solid #6ee7b7',
                color: 'var(--whatsapp-dark)',
                fontWeight: '800',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>+91 9511544399</span>
            </a>
          </div>
        </div>

        <button
          onClick={() => setShowPrivacyModal(true)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: 'var(--primary-forest)',
            fontWeight: '800',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={17} color="var(--primary-emerald)" />
          <span>{language === 'hi' ? 'गोपनीयता नीति एवं नियम (Privacy Policy)' : 'Privacy Policy & Terms'}</span>
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-amber-light)',
            border: '1px solid #fde68a',
            color: 'var(--accent-gold)',
            fontWeight: '800',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <HelpCircle size={17} />
          <span>{language === 'hi' ? 'फाउंडर्स व Fresh Fetch की कहानी' : 'About Founders & Startup Mission'}</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#ef4444',
            fontWeight: '800',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <LogOut size={17} />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
    </div>
  );
}
