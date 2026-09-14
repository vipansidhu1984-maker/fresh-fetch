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
  ArrowRight
} from 'lucide-react';

export function ChatModal() {
  const {
    showChatModal,
    setShowChatModal,
    activeChat,
    sendMessage,
    role,
    currentUser,
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

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeChat.id, inputText.trim(), role || 'buyer');
    setInputText('');
  };

  const handleChipClick = (questionText) => {
    sendMessage(activeChat.id, questionText, role || 'buyer');
  };

  const quickQuestions = [
    t('chipDelivery'),
    t('chipPurity'),
    t('chipDiscount'),
    t('chipSample')
  ];

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
            <div className="chat-farmer-avatar">
              {activeChat.sellerName?.charAt(0) || 'F'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="chat-farmer-name">
                  {activeChat.sellerName?.split('(')[0]?.trim()}
                </span>
                <ShieldCheck size={15} color="var(--primary-emerald)" />
              </div>
              <div className="chat-farmer-location">
                <MapPin size={11} />
                <span>{activeChat.sellerLocation}</span>
                <span style={{ margin: '0 3px' }}>•</span>
                <span style={{ color: '#16a34a', fontWeight: '700' }}>Active Now</span>
              </div>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {/* Secondary WhatsApp Button */}
            <a
              href={`https://wa.me/${activeChat.sellerWhatsApp}?text=${encodeURIComponent(`Namaste ${activeChat.sellerName}! Inquiry for ${activeChat.productTitle} on Fresh Fetch.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-header-action-btn wa"
              title={t('secondaryWhatsApp')}
            >
              <MessageCircle size={16} />
              <span className="action-btn-label">WhatsApp</span>
            </a>

            {/* Phone Call Button */}
            {activeChat.sellerPhone && (
              <a
                href={`tel:${activeChat.sellerPhone}`}
                className="chat-header-action-btn call"
                title={t('callProducerAction')}
              >
                <Phone size={15} />
              </a>
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
            <span>🔒 Direct Farmer to Buyer conversation. Safe & authentic.</span>
          </div>

          {activeChat.messages?.map((msg) => {
            const isMe = (role === 'producer' && msg.senderRole === 'producer') || 
                         (role !== 'producer' && msg.senderRole === 'buyer');

            return (
              <div 
                key={msg.id} 
                className={`chat-message-row ${isMe ? 'my-message' : 'other-message'}`}
              >
                {!isMe && (
                  <div className="chat-msg-avatar">
                    {msg.senderName?.charAt(0) || 'F'}
                  </div>
                )}
                
                <div className={`chat-bubble ${isMe ? 'bubble-mine' : 'bubble-theirs'}`}>
                  {!isMe && (
                    <div className="chat-msg-sender-name">
                      {msg.senderName}
                    </div>
                  )}
                  <p className="chat-msg-text">{msg.text}</p>
                  <div className="chat-msg-footer">
                    <span className="chat-msg-time">{msg.time}</span>
                    {isMe && (
                      <span className="chat-msg-status">
                        {msg.status === 'read' ? (
                          <CheckCheck size={14} color="#38bdf8" />
                        ) : (
                          <Check size={13} color="rgba(255,255,255,0.7)" />
                        )}
                      </span>
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
            placeholder={t('typeMessagePlaceholder')}
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
