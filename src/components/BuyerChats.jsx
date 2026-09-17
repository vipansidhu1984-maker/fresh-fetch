import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  MessageCircle, 
  Phone, 
  Search, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Clock, 
  X,
  ExternalLink
} from 'lucide-react';

export function BuyerChats() {
  const { 
    currentUser, 
    chats, 
    openChatById, 
    markChatAsRead,
    setActiveTab, 
    registeredUsers, 
    t, 
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const currentBuyerPhone = currentUser?.phone ? String(currentUser.phone).replace(/\D/g, '') : '';
  const currentBuyerPhone10 = currentBuyerPhone.length >= 10 ? currentBuyerPhone.slice(-10) : currentBuyerPhone;

  // Filter chats belonging to the active consumer / buyer
  const buyerChats = (chats || []).filter((c) => {
    if (!c) return false;
    if (currentUser?.id && c.buyerId === currentUser.id) return true;
    if (currentBuyerPhone10) {
      const bPhone = c.buyerPhone ? String(c.buyerPhone).replace(/\D/g, '') : '';
      const bPhone10 = bPhone.length >= 10 ? bPhone.slice(-10) : bPhone;
      if (bPhone10 && bPhone10 === currentBuyerPhone10) return true;
    }
    // If guest or no specific user logged in, match guest chats
    if (!currentUser && (c.buyerId?.startsWith('guest-') || c.buyerRole === 'buyer' || !c.sellerId)) return true;
    return false;
  });

  // Calculate unread messages count for the consumer
  const totalUnreadBuyerMessages = buyerChats.reduce((sum, c) => sum + (Number(c.unreadCountBuyer) || 0), 0);

  // Filter chats by search query
  const filteredChats = buyerChats.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const farmerName = (c.sellerName || '').toLowerCase();
    const productTitle = (c.productTitle || '').toLowerCase();
    const lastMsg = (c.lastMessage || '').toLowerCase();
    const location = (c.sellerLocation || '').toLowerCase();
    return (
      farmerName.includes(query) ||
      productTitle.includes(query) ||
      lastMsg.includes(query) ||
      location.includes(query)
    );
  });

  // Helper to check farmer privacy preferences for WhatsApp and Call
  const getSellerPrivacy = (c) => {
    const sellerUser = (registeredUsers || []).find(
      (u) =>
        (u.id && u.id === c.sellerId) ||
        (u.phone && (u.phone === c.sellerPhone || `91${u.phone}` === c.sellerWhatsApp))
    );
    const isWhatsAppActive =
      c.showWhatsApp !== false &&
      (!sellerUser || sellerUser.showWhatsApp !== false) &&
      Boolean(c.sellerWhatsApp || c.sellerPhone);

    const isPhoneActive =
      c.showPhone !== false &&
      (!sellerUser || sellerUser.showPhone !== false) &&
      Boolean(c.sellerPhone);

    return { isWhatsAppActive, isPhoneActive };
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Clean Aesthetic Hero Banner with Rich Forest Theme */}
      <section className="clean-hero-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="hero-mini-tag">
              <MessageSquare size={14} />
              <span>{language === 'hi' ? 'सीधे किसान संदेश' : language === 'pa' ? 'ਸਿੱਧੇ ਕਿਸਾਨ ਸੁਨੇਹੇ' : 'Direct Farmer Messages'}</span>
            </div>
            <h1 className="hero-title-clean">
              {language === 'hi' ? (
                <>किसान <span>चैट व बातचीत ({buyerChats.length})</span></>
              ) : language === 'pa' ? (
                <>ਕਿਸਾਨ <span>ਚੈਟ ਤੇ ਗੱਲਬਾਤ ({buyerChats.length})</span></>
              ) : (
                <>Farmer <span>Chats & Inquiries ({buyerChats.length})</span></>
              )}
            </h1>
            <p className="hero-sub-clean">
              {language === 'hi'
                ? 'क्षेत्र के किसानों से सीधे जुड़े रहें, ताज़ा स्टॉक, डिलीवरी व शुद्धता पर सीधी बातचीत'
                : language === 'pa'
                ? 'ਸਥਾਨਕ ਕਿਸਾਨਾਂ ਨਾਲ ਸਿੱਧੀ ਗੱਲਬਾਤ, ਤਾਜ਼ਾ ਸਟਾਕ ਅਤੇ ਡਿਲੀਵਰੀ ਦੇ ਸੁਨੇਹੇ'
                : 'Direct live chat history with verified local farmers across Hanumangarh & Sri Ganganagar'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div className="trust-pill">
              <ShieldCheck size={16} color="#4ade80" />
              <span style={{ color: '#ffffff', fontWeight: '700' }}>100% Direct & Private</span>
            </div>
            {totalUnreadBuyerMessages > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '800', background: '#ef4444', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)' }}>
                {totalUnreadBuyerMessages} {language === 'hi' ? 'नए संदेश' : 'New Messages'}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Search Input Bar */}
      {buyerChats.length > 0 && (
        <div className="filter-search-container" style={{ marginBottom: '1.25rem' }}>
          <div className="search-input-wrap">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={language === 'hi' ? 'किसान का नाम या उत्पाद खोजें...' : language === 'pa' ? 'ਕਿਸਾਨ ਜਾਂ ਉਤਪਾਦ ਖੋਜੋ...' : 'Search farmer or produce item...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat History List */}
      {buyerChats.length === 0 ? (
        <div className="empty-state-box" style={{ padding: '3rem 1.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--card-border)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-sm)' }}>
            <MessageSquare size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            {language === 'hi' ? 'अभी तक कोई बातचीत शुरू नहीं हुई' : language === 'pa' ? 'ਅਜੇ ਤੱਕ ਕੋਈ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਈ' : 'No Farmer Chats Yet'}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
            {language === 'hi' 
              ? 'जब भी आप बाज़ार में किसी उत्पाद पर "किसान से चैट करें" दबाएंगे, वह बातचीत और संदेश यहाँ हमेशा उपलब्ध रहेंगे।' 
              : language === 'pa'
              ? 'ਜਦੋਂ ਵੀ ਤੁਸੀਂ ਮਾਰਕੀਟ ਵਿੱਚ ਕਿਸੇ ਉਤਪਾਦ ਤੇ "ਕਿਸਾਨ ਨਾਲ ਚੈਟ ਕਰੋ" ਕਲਿੱਕ ਕਰੋਗੇ, ਉਹ ਸੁਨੇਹੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।'
              : 'Whenever you tap "Chat with Farmer" on any pure farm produce in the marketplace, your conversation history will be saved here.'}
          </p>
          <button
            className="btn-primary"
            style={{ width: 'auto', margin: '0 auto', padding: '0.7rem 1.4rem', fontSize: '0.92rem', gap: '0.4rem' }}
            onClick={() => setActiveTab('marketplace')}
          >
            <ShoppingBag size={18} />
            <span>{language === 'hi' ? 'बाज़ार में उत्पाद देखें' : language === 'pa' ? 'ਮਾਰਕੀਟ ਵਿੱਚ ਉਤਪਾਦ ਦੇਖੋ' : 'Browse Marketplace Produce'}</span>
          </button>
        </div>
      ) : filteredChats.length === 0 ? (
        <div className="empty-state-box" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            {language === 'hi' ? 'कोई चैट नहीं मिली' : 'No matching chats found'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            "{searchQuery}" {language === 'hi' ? 'से संबंधित कोई बातचीत नहीं मिली।' : 'did not match any conversations.'}
          </p>
          <button className="btn-secondary" onClick={() => setSearchQuery('')}>
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredChats.map((chat) => {
            const { isWhatsAppActive, isPhoneActive } = getSellerPrivacy(chat);
            const hasUnread = Number(chat.unreadCountBuyer || 0) > 0;
            const farmerDisplayName = (chat.sellerName || 'Farmer').split('(')[0]?.trim();
            const lastMsg = chat.lastMessage || (language === 'hi' ? 'नई बातचीत शुरू की गई' : 'Chat initiated');
            const lastMsgTime = chat.lastMessageTime || '';

            return (
              <div
                key={chat.id}
                onClick={() => openChatById(chat.id)}
                style={{
                  background: hasUnread ? '#f0fdf4' : 'var(--card-bg)',
                  borderRadius: 'var(--radius-lg)',
                  border: hasUnread ? '2px solid var(--primary-emerald)' : '1.5px solid var(--card-border)',
                  padding: '1.1rem 1.25rem',
                  boxShadow: hasUnread ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
                className="buyer-chat-card-hover"
              >
                {/* Left: Avatar + Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: '240px' }}>
                  {/* Farmer Avatar with Online/Unread Dot & Profile Photo */}
                  {(() => {
                    const sellerUser = (registeredUsers || []).find(
                      (u) =>
                        (u.id && u.id === chat.sellerId) ||
                        (u.phone && (u.phone === chat.sellerPhone || `91${u.phone}` === chat.sellerWhatsApp))
                    );
                    const farmerAvatar = chat.sellerAvatar || sellerUser?.avatar;

                    return (
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div 
                          style={{ 
                            width: '52px', 
                            height: '52px', 
                            borderRadius: 'var(--radius-full)', 
                            overflow: 'hidden',
                            background: '#dcfce7', 
                            color: 'var(--primary-forest)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: '800', 
                            fontSize: '1.25rem',
                            boxShadow: 'var(--shadow-sm)',
                            border: '2px solid #ffffff'
                          }}
                        >
                          {farmerAvatar ? (
                            <img 
                              src={farmerAvatar} 
                              alt={farmerDisplayName} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            farmerDisplayName.charAt(0) || 'F'
                          )}
                        </div>
                        {hasUnread && (
                          <span 
                            style={{ 
                              position: 'absolute', 
                              top: '-2px', 
                              right: '-2px', 
                              width: '14px', 
                              height: '14px', 
                              background: '#22c55e', 
                              borderRadius: '50%', 
                              border: '2.5px solid #ffffff' 
                            }} 
                          />
                        )}
                      </div>
                    );
                  })()}

                  {/* Farmer & Message Metadata */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {farmerDisplayName}
                        </h4>
                        <ShieldCheck size={15} color="var(--primary-emerald)" />
                      </div>
                      {lastMsgTime && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {lastMsgTime}
                        </span>
                      )}
                    </div>

                    {/* Produce Reference Tag */}
                    {chat.productTitle && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.2rem 0 0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-forest)', fontWeight: '700', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                          🏷️ {chat.productTitle.split('(')[0]?.trim()} {chat.productPrice ? `(₹${chat.productPrice}/${chat.productUnit || 'kg'})` : ''}
                        </span>
                      </div>
                    )}

                    {/* Last Message Snippet */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.84rem', color: hasUnread ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: hasUnread ? '800' : '500', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        💬 {lastMsg}
                      </p>
                      {hasUnread && (
                        <span style={{ fontSize: '0.72rem', color: '#ffffff', background: '#22c55e', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>
                          {chat.unreadCountBuyer} New
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openChatById(chat.id)}
                    className="btn-chat-primary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.35rem', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <MessageSquare size={16} />
                    <span>{language === 'hi' ? 'चैट खोलें' : language === 'pa' ? 'ਚੈਟ ਖੋਲ੍ਹੋ' : 'Open Chat'}</span>
                  </button>

                  {/* External Contact Shortcuts */}
                  {isWhatsAppActive && (
                    <a
                      href={`https://wa.me/${chat.sellerWhatsApp || `91${chat.sellerPhone}`}?text=${encodeURIComponent(`Namaste ${farmerDisplayName}! Regarding our chat for ${chat.productTitle || 'Produce'} on Fresh Fetch...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp-compact"
                      title={t('secondaryWhatsApp')}
                      style={{ padding: '0.55rem' }}
                    >
                      <MessageCircle size={18} />
                    </a>
                  )}

                  {isPhoneActive && (
                    <a
                      href={`tel:${chat.sellerPhone}`}
                      className="btn-call-compact"
                      title={t('callProducerAction')}
                      style={{ padding: '0.55rem' }}
                    >
                      <Phone size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
