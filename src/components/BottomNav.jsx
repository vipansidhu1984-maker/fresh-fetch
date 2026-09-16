import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Tractor, 
  PlusCircle, 
  Package, 
  MessageCircle, 
  MessageSquare,
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
    chats,
    readInquiryIds,
    currentUser,
    logout,
    t, 
    language 
  } = useApp();

  const currentSellerPhone = currentUser?.phone ? String(currentUser.phone).replace(/\D/g, '') : '';
  const currentSellerPhone10 = currentSellerPhone.length >= 10 ? currentSellerPhone.slice(-10) : currentSellerPhone;

  const myInquiries = (inquiries || []).filter((inq) => {
    if (!currentUser) return inq.sellerId === 'farmer-ramesh';
    if (inq.sellerId && inq.sellerId === currentUser.id) return true;
    if (currentSellerPhone10) {
      const inqPhone = inq.sellerPhone ? String(inq.sellerPhone).replace(/\D/g, '') : '';
      const inqPhone10 = inqPhone.length >= 10 ? inqPhone.slice(-10) : inqPhone;
      if (inqPhone10 && inqPhone10 === currentSellerPhone10) return true;
    }
    return false;
  });

  const myChats = (chats || []).filter((c) => {
    if (!currentUser) return c.sellerId === 'farmer-ramesh';
    if (c.sellerId && c.sellerId === currentUser.id) return true;
    if (currentSellerPhone10) {
      const cPhone = c.sellerPhone ? String(c.sellerPhone).replace(/\D/g, '') : '';
      const cPhone10 = cPhone.length >= 10 ? cPhone.slice(-10) : cPhone;
      if (cPhone10 && cPhone10 === currentSellerPhone10) return true;
    }
    return false;
  });

  // Count unread WhatsApp inquiries and unread chat messages for farmer
  const unreadInquiries = myInquiries.filter((inq) => !(readInquiryIds || []).includes(inq.id));
  const unreadChatsCount = myChats.reduce((sum, c) => sum + (c.unreadCountFarmer || 0), 0);
  const totalUnreadLeads = unreadInquiries.length + unreadChatsCount;

  // Buyer chats and unread count
  const currentBuyerPhone = currentUser?.phone ? String(currentUser.phone).replace(/\D/g, '') : '';
  const currentBuyerPhone10 = currentBuyerPhone.length >= 10 ? currentBuyerPhone.slice(-10) : currentBuyerPhone;

  const buyerChats = (chats || []).filter((c) => {
    if (!c) return false;
    if (currentUser?.id && c.buyerId === currentUser.id) return true;
    if (currentBuyerPhone10) {
      const bPhone = c.buyerPhone ? String(c.buyerPhone).replace(/\D/g, '') : '';
      const bPhone10 = bPhone.length >= 10 ? bPhone.slice(-10) : bPhone;
      if (bPhone10 && bPhone10 === currentBuyerPhone10) return true;
    }
    if (!currentUser && (c.buyerId?.startsWith('guest-') || c.buyerRole === 'buyer' || !c.sellerId)) return true;
    return false;
  });

  const unreadBuyerMessages = buyerChats.reduce((sum, c) => sum + (Number(c.unreadCountBuyer) || 0), 0);

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
            {totalUnreadLeads > 0 && (
              <span className="nav-badge-count">{totalUnreadLeads}</span>
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
        /* Buyer / Consumer Bottom Tabs (Marketplace, Chats, Wishlist, Profile) */
        <div className="bottom-nav-inner">
          <button
            className={`nav-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <ShoppingBag size={20} />
            <span>{t('navMarketplace')}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
            style={{ position: 'relative' }}
          >
            <MessageSquare size={20} />
            {unreadBuyerMessages > 0 && (
              <span className="nav-badge-count" style={{ background: '#22c55e' }}>{unreadBuyerMessages}</span>
            )}
            <span>{t('navChats')}</span>
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
