import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  CheckCheck, 
  Check, 
  Sparkles, 
  ShoppingBag,
  ExternalLink,
  MapPin,
  ArrowRight,
  UserCheck,
  Trash2
} from 'lucide-react';

export function ChatModal() {
  const {
    showChatModal,
    setShowChatModal,
    activeChat,
    sendMessage,
    deleteChatMessage,
    maskPhoneNumber,
    role,
    currentUser,
    registeredUsers,
    trackWhatsAppInquiry,
    language,
    t
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showChatModal) {
      scrollToBottom();
    }
  }, [showChatModal, activeChat?.messages]);

  if (!showChatModal || !activeChat) return null;

  // Determine if the current active user is the farmer/seller or the customer
  const isFarmer = role === 'producer' || Boolean(
    currentUser && (
      (activeChat.sellerId && activeChat.sellerId === currentUser.id) ||
      (activeChat.sellerPhone && activeChat.sellerPhone === currentUser.phone)
    )
  );

  // Resolve dynamic seller privacy settings
  const sellerUser = (registeredUsers || []).find(
    (u) =>
      (u.id && u.id === activeChat.sellerId) ||
      (u.phone && (u.phone === activeChat.sellerPhone || `91${u.phone}` === activeChat.sellerWhatsApp))
  );

  const isWhatsAppActive =
    activeChat.showWhatsApp !== false &&
    (!sellerUser || sellerUser.showWhatsApp !== false) &&
    Boolean(activeChat.sellerWhatsApp || activeChat.sellerPhone);

  const isPhoneActive =
    activeChat.showPhone !== false &&
    (!sellerUser || sellerUser.showPhone !== false) &&
    Boolean(activeChat.sellerPhone);

  const counterpartName = isFarmer
    ? (activeChat.buyerName || 'Customer')
    : (activeChat.sellerName?.split('(')[0]?.trim() || 'Farmer');

  const counterpartSubtitle = isFarmer
    ? (activeChat.buyerPhone ? `Customer • ${maskPhoneNumber(activeChat.buyerPhone)}` : 'Verified Buyer')
    : (activeChat.sellerLocation || 'Hanumangarh');

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeChat.id, inputText.trim(), isFarmer ? 'producer' : 'buyer');
    setInputText('');
  };

  const handleChipClick = (questionText) => {
    sendMessage(activeChat.id, questionText, isFarmer ? 'producer' : 'buyer');
  };

  const quickQuestions = isFarmer
    ? [
        language === 'hi' ? 'जी, ताज़ा स्टॉक उपलब्ध है।' : (language === 'pa' ? 'ਹਾਂ ਜੀ, ਤਾਜ਼ਾ ਸਟਾਕ ਉਪਲਬਧ ਹੈ।' : 'Yes, fresh stock is available.'),
        language === 'hi' ? 'कल डिलीवरी हो जाएगी।' : (language === 'pa' ? 'ਕੱਲ ਡਿਲੀਵਰੀ ਹੋ ਜਾਵੇਗੀ।' : 'Delivery available tomorrow.'),
        language === 'hi' ? '100% शुद्ध और प्राकृतिक है।' : (language === 'pa' ? '100% ਸ਼ੁੱਧ ਅਤੇ ਕੁਦਰਤੀ ਹੈ।' : '100% pure and organic.'),
        language === 'hi' ? 'कैश ऑन डिलीवरी या UPI उपलब्ध है।' : (language === 'pa' ? 'ਕੈਸ਼ ਜਾਂ UPI ਉਪਲਬਧ ਹੈ।' : 'Cash on delivery or UPI accepted.')
      ]
    : [
        t('chipDelivery'),
        t('chipPurity'),
        t('chipDiscount'),
        t('chipSample')
      ];

  const counterpartUser = (registeredUsers || []).find(
    (u) =>
      (isFarmer ? (u.id === activeChat.buyerId || u.phone === activeChat.buyerPhone) : (u.id === activeChat.sellerId || u.phone === activeChat.sellerPhone))
  );
  const counterpartAvatar = isFarmer
    ? (activeChat.buyerAvatar || counterpartUser?.avatar)
    : (activeChat.sellerAvatar || counterpartUser?.avatar);

  return (
    <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
      <div 
        className="modal-card chat-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          height: '90vh',
          maxHeight: '720px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Chat Modal Header */}
        <div className="chat-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div 
              className="chat-farmer-avatar" 
              style={{ 
                background: isFarmer ? '#e0f2fe' : '#dcfce7', 
                color: isFarmer ? '#0284c7' : 'var(--primary-forest)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {counterpartAvatar ? (
                <img 
                  src={counterpartAvatar} 
                  alt={counterpartName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                counterpartName?.charAt(0) || (isFarmer ? 'C' : 'F')
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="chat-farmer-name">
                  {counterpartName}
                </span>
                <ShieldCheck size={15} color="var(--primary-emerald)" />
              </div>
              <div className="chat-farmer-location">
                <MapPin size={11} />
                <span>{counterpartSubtitle}</span>
                <span style={{ margin: '0 3px' }}>•</span>
                <span style={{ color: '#16a34a', fontWeight: '700' }}>Direct Live</span>
              </div>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {/* If viewed by Farmer: Action to WhatsApp/Call Buyer if phone available */}
            {isFarmer ? (
              <>
                {activeChat.buyerPhone && (
                  <a
                    href={`https://wa.me/91${activeChat.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${activeChat.buyerName || 'ji'}! In regards to your inquiry for ${activeChat.productTitle} on Fresh Fetch.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-header-action-btn wa"
                    title="WhatsApp Buyer"
                  >
                    <MessageCircle size={16} />
                    <span className="action-btn-label">WhatsApp</span>
                  </a>
                )}
                {activeChat.buyerPhone && (
                  <a
                    href={`tel:${activeChat.buyerPhone}`}
                    className="chat-header-action-btn call"
                    title="Call Buyer"
                  >
                    <Phone size={15} />
                  </a>
                )}
              </>
            ) : (
              /* If viewed by Buyer: Secondary WhatsApp & Call Producer */
              <>
                {isWhatsAppActive && (
                  <a
                    href={`https://wa.me/${activeChat.sellerWhatsApp || `91${activeChat.sellerPhone}`}?text=${encodeURIComponent(`Namaste ${activeChat.sellerName}! Inquiry for ${activeChat.productTitle} on Fresh Fetch.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-header-action-btn wa"
                    title={t('secondaryWhatsApp')}
                  >
                    <MessageCircle size={16} />
                    <span className="action-btn-label">WhatsApp</span>
                  </a>
                )}

                {isPhoneActive && (
                  <a
                    href={`tel:${activeChat.sellerPhone}`}
                    className="chat-header-action-btn call"
                    title={t('callProducerAction')}
                  >
                    <Phone size={15} />
                  </a>
                )}
              </>
            )}

            {/* Close Button */}
            <button 
              className="modal-close-btn"
              onClick={() => setShowChatModal(false)}
              style={{ width: '32px', height: '32px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Attached Product Preview Banner */}
        {activeChat.productTitle && (
          <div className="chat-product-banner">
            <img 
              src={activeChat.productImage || 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=150&q=80'} 
              alt={activeChat.productTitle} 
              className="chat-product-thumb"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                {t('inquiryFor')}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeChat.productTitle}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
                ₹{activeChat.productPrice} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ {activeChat.productUnit}</span>
              </div>
            </div>
            <div className="chat-verified-badge">
              🌿 100% Pure Direct
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="chat-messages-container">
          <div className="chat-security-notice">
            <span>🔒 Direct Farmer to Buyer conversation. Real-time & authentic.</span>
          </div>

          {(!activeChat.messages || activeChat.messages.length === 0) && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1.25rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>💬</div>
              <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {isFarmer
                  ? (language === 'hi' ? 'ग्राहक के सीधे संदेश की प्रतीक्षा है' : 'Waiting for buyer message')
                  : (language === 'hi' ? 'किसान से सीधे बातचीत शुरू करें' : 'Start direct conversation with farmer')}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, maxWidth: '360px', marginInline: 'auto' }}>
                {isFarmer
                  ? (language === 'hi' ? 'ग्राहक द्वारा भेजा गया सवाल या आर्डर विवरण यहाँ दिखेगा।' : 'When the customer sends a message or inquiry, it will appear here.')
                  : (language === 'hi' ? 'उत्पाद की शुद्धता, ताज़गी, डिलीवरी या कीमत के बारे में पूछें।' : 'Ask anything about harvest freshness, packaging, home delivery, or bulk orders.')}
              </p>
            </div>
          )}

          {activeChat.messages?.map((msg) => {
            const isMe = isFarmer
              ? msg.senderRole === 'producer'
              : msg.senderRole === 'buyer';

            return (
              <div 
                key={msg.id} 
                className={`chat-message-row ${isMe ? 'my-message' : 'other-message'}`}
              >
                {!isMe && (
                  <div 
                    className="chat-msg-avatar" 
                    style={{ 
                      background: isFarmer ? '#e0f2fe' : '#dcfce7', 
                      color: isFarmer ? '#0284c7' : 'var(--primary-forest)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {counterpartAvatar ? (
                      <img 
                        src={counterpartAvatar} 
                        alt={msg.senderName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      msg.senderName?.charAt(0) || (isFarmer ? 'B' : 'F')
                    )}
                  </div>
                )}
                
                <div className={`chat-bubble ${isMe ? 'bubble-mine' : 'bubble-theirs'}`}>
                  {!isMe && (
                    <div className="chat-msg-sender-name">
                      {msg.senderName}
                    </div>
                  )}
                  <p className="chat-msg-text">{msg.text}</p>
                  <div className="chat-msg-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <span className="chat-msg-time">{msg.time}</span>
                    {isMe && (
                      <>
                        <span className="chat-msg-status">
                          {msg.status === 'read' ? (
                            <CheckCheck size={14} color="#38bdf8" />
                          ) : (
                            <Check size={13} color="rgba(255,255,255,0.7)" />
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(language === 'hi' ? 'क्या आप इस संदेश को हमेशा के लिए हटाना चाहते हैं?' : (language === 'pa' ? 'ਕੀ ਤੁਸੀਂ ਇਹ ਸੁਨੇਹਾ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?' : 'Delete this message for everyone?'))) {
                              deleteChatMessage(activeChat.id, msg.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '0.1rem 0.2rem',
                            color: 'rgba(255,255,255,0.75)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          title="Delete message"
                          aria-label="Delete message"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Suggestion Chips */}
        <div className="chat-quick-chips-wrap">
          <div className="chips-scroll-bar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="chat-quick-chip"
                onClick={() => handleChipClick(q)}
              >
                <Sparkles size={12} color="var(--accent-gold)" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-container">
          <input
            type="text"
            className="chat-input-field"
            placeholder={isFarmer 
              ? (language === 'hi' ? 'ग्राहक को जवाब लिखें...' : 'Type reply to customer...') 
              : t('typeMessagePlaceholder')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoFocus
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
