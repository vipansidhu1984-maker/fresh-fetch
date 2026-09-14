import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Tractor, 
  PlusCircle, 
  Package, 
  MessageCircle, 
  Heart, 
  User, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export function BottomNav() {
  const { 
    role, 
    switchRole,
    activeTab, 
    setActiveTab, 
    wishlist, 
    inquiries, 
    currentUser,
    logout,
    t, 
    language 
  } = useApp();

  const myInquiries = (inquiries || []).filter(
    (inq) => currentUser ? (inq.sellerId === currentUser.id || inq.sellerPhone === currentUser.phone) : inq.sellerId === 'farmer-ramesh'
  );

  return (
    <nav className="mobile-bottom-nav">
      {role === 'producer' ? (
        /* Producer / Farmer Bottom Tabs (Listings, Inquiries, Marketplace, Profile) */
        <div className="bottom-nav-inner">
          <button
            className={`nav-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <Tractor size={20} />
            <span>{t('navMyListings')}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
            style={{ position: 'relative' }}
          >
            <MessageCircle size={20} />
            {myInquiries.length > 0 && (
              <span className="nav-badge-count">{myInquiries.length}</span>
            )}
            <span>{t('navInquiries')}</span>
          </button>

          {/* Marketplace Button for Farmer to browse all listings */}
          <button
            className={`nav-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
            title={language === 'hi' ? 'बाज़ार देखें (All Listings)' : 'Browse Marketplace'}
          >
            <ShoppingBag size={20} />
            <span>{t('navMarketplace')}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              if (activeTab !== 'profile') {
                setActiveTab('profile');
              }
            }}
          >
            <User size={20} />
            <span>{t('navProfile')}</span>
          </button>
        </div>
      ) : (
        /* Buyer / Consumer Bottom Tabs (Marketplace, Wishlist, Profile) */
        <div className="bottom-nav-inner">
          <button
            className={`nav-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <ShoppingBag size={20} />
            <span>{t('navMarketplace')}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
            style={{ position: 'relative' }}
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="nav-badge-count">{wishlist.length}</span>
            )}
            <span>{t('navWishlist')}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              if (activeTab !== 'profile') {
                setActiveTab('profile');
              }
            }}
          >
            <User size={20} />
            <span>{t('navProfile')}</span>
          </button>
        </div>
      )}
    </nav>
  );
}
