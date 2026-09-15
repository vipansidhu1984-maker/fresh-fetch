import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { isProductFresh, getDaysRemaining } from '../data/mockData';
import { 
  PlusCircle, 
  Package, 
  MessageCircle, 
  MessageSquare,
  Sparkles, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Tractor, 
  ShieldCheck, 
  BookOpen, 
  Check, 
  X, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink,
  Phone,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SellerDashboard() {
  const { 
    currentUser, 
    products, 
    renewProductBatch,
    updateProductPrice, 
    updateProductQuantity, 
    toggleProductStock, 
    deleteProduct, 
    inquiries, 
    chats,
    readInquiryIds,
    markFarmerLeadsAsRead,
    openChatById,
    activeTab,
    setActiveTab,
    setShowAddProductModal, 
    t, 
    language 
  } = useApp();

  // Filter products by current seller (Real farmer listings only)
  const myProducts = products.filter(
    (p) => p && !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'].includes(p.id) && (currentUser ? (p.sellerId === currentUser.id || p.sellerPhone === currentUser.phone) : false)
  );

  // Filter chats by current seller
  const myChats = (chats || []).filter(
    (c) => currentUser ? (c.sellerId === currentUser.id || c.sellerPhone === currentUser.phone) : c.sellerId === 'farmer-ramesh'
  );

  // Filter inquiries / WhatsApp leads by current seller
  const myInquiries = (inquiries || []).filter(
    (inq) => currentUser ? (inq.sellerId === currentUser.id || inq.sellerPhone === currentUser.phone) : inq.sellerId === 'farmer-ramesh'
  );

  const unreadInquiries = myInquiries.filter((inq) => !(readInquiryIds || []).includes(inq.id));
  const unreadChatsCount = myChats.reduce((sum, c) => sum + (c.unreadCountFarmer || 0), 0);
  const totalUnreadLeads = unreadInquiries.length + unreadChatsCount;

  // Price & Quantity inline editing
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPriceVal, setNewPriceVal] = useState('');
  const [editingQtyId, setEditingQtyId] = useState(null);
  const [newQtyVal, setNewQtyVal] = useState('');

  // Guide Modal State
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleSavePrice = (prodId) => {
    if (newPriceVal && Number(newPriceVal) > 0) {
      updateProductPrice(prodId, Number(newPriceVal));
    }
    setEditingPriceId(null);
    setNewPriceVal('');
  };

  const handleSaveQuantity = (prodId) => {
    if (newQtyVal.trim()) {
      updateProductQuantity(prodId, newQtyVal.trim());
    }
    setEditingQtyId(null);
    setNewQtyVal('');
  };

  const isLeadsView = activeTab === 'inquiries';

  // Automatically mark unread leads as read/viewed when farmer is in the leads section
  useEffect(() => {
    if (isLeadsView) {
      markFarmerLeadsAsRead();
    }
  }, [isLeadsView, myInquiries.length, myChats.length]);

  return (
    <div>
      {/* Clean Simplified Seller Hero */}
      <div className="dashboard-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: 'var(--radius-md)', 
              background: '#dcfce7', 
              color: 'var(--primary-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isLeadsView ? <MessageCircle size={28} /> : <Tractor size={28} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h1 className="seller-welcome-title">
                {isLeadsView ? t('whatsappLeads') : (currentUser?.name || 'Ramesh Kumar')}
              </h1>
              {!isLeadsView && (
                <span style={{ color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck size={16} />
                </span>
              )}
            </div>
            <p className="seller-welcome-sub">
              {isLeadsView ? (
                <span>💬 {myInquiries.length} {language === 'hi' ? 'खरीदारों ने व्हाट्सएप पर संपर्क किया' : 'buyer inquiries received on WhatsApp'}</span>
              ) : (
                <span>📍 {currentUser?.farmName ? `${currentUser.farmName} • ` : ''}{currentUser?.location || 'Sangaria, Hanumangarh'}</span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setShowGuideModal(true)}
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
          >
            <BookOpen size={15} />
            <span>{t('farmerGuide')}</span>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => setShowAddProductModal(true)}
            style={{ width: 'auto', padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
          >
            <PlusCircle size={16} />
            <span>{t('addNewProduct')}</span>
          </button>
        </div>
      </div>

      {/* Interactive Switchable Stats Bar */}
      <div className="stats-grid">
        <div 
          className={`stat-card ${!isLeadsView ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('listings')}
          style={{ 
            cursor: 'pointer',
            border: !isLeadsView ? '2px solid var(--primary-emerald)' : '1.5px solid var(--card-border)',
            background: !isLeadsView ? '#f0fdf4' : '#ffffff',
            boxShadow: !isLeadsView ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: 'var(--primary-forest)' }}>
            <Package size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-val">{myProducts.length}</div>
            <div className="stat-label">{t('myListings')}</div>
          </div>
          {!isLeadsView && (
            <span style={{ fontSize: '0.72rem', color: 'var(--primary-forest)', fontWeight: '700', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
              Active
            </span>
          )}
        </div>

        <div 
          className={`stat-card ${isLeadsView ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('inquiries')}
          style={{ 
            cursor: 'pointer',
            border: isLeadsView ? '2px solid var(--whatsapp-dark)' : '1.5px solid var(--card-border)',
            background: isLeadsView ? '#ecfdf5' : '#ffffff',
            boxShadow: isLeadsView ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="stat-icon-wrap" style={{ background: '#dcfce7', color: 'var(--whatsapp-dark)' }}>
            <MessageCircle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-val">{myInquiries.length}</div>
            <div className="stat-label">{t('whatsappLeads')}</div>
          </div>
          {isLeadsView ? (
            <span style={{ fontSize: '0.72rem', color: 'var(--whatsapp-dark)', fontWeight: '700', background: '#bbf7d0', padding: '2px 8px', borderRadius: '12px' }}>
              Active
            </span>
          ) : totalUnreadLeads > 0 ? (
            <span style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: '800', background: '#ef4444', padding: '2px 8px', borderRadius: '12px' }}>
              {totalUnreadLeads} New
            </span>
          ) : null}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: IN-APP CHATS & WHATSAPP LEADS (जब 'Leads / संपर्क' चुना जाए)
         ========================================================================= */}
      {isLeadsView ? (
        <div style={{ marginBottom: '2rem' }}>
          {/* Section 1: In-App Direct Buyer Chats */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="section-header-bar">
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={20} color="var(--primary-forest)" />
                  <span>{t('inAppChat')} ({myChats.length})</span>
                </h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {language === 'hi' ? 'सीधे ग्राहक संदेश' : 'Direct Buyer Chats'}
              </span>
            </div>

            <div style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--card-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {myChats.length === 0 ? (
                <div className="empty-state-box" style={{ padding: '2rem 1.5rem' }}>
                  <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    {language === 'hi' ? 'कोई सक्रिय इन-ऐप चैट नहीं है' : 'No in-app chats yet'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '380px', margin: '0 auto' }}>
                    {language === 'hi' 
                      ? 'जब भी कोई ग्राहक आपके उत्पाद पर "किसान से चैट करें" दबाएगा, वह बातचीत यहां लाइव दिखेगी।' 
                      : 'When buyers tap "Chat with Farmer" on your products, messages will appear here.'}
                  </p>
                </div>
              ) : (
                <div>
                  {myChats.map((chat, idx) => (
                    <div
                      key={chat.id || idx}
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: idx === myChats.length - 1 ? 'none' : '1px solid var(--card-border)',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        background: chat.unreadCountFarmer > 0 ? '#f0fdf4' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '220px' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem' }}>
                            {chat.buyerName?.charAt(0) || 'B'}
                          </div>
                          {chat.unreadCountFarmer > 0 && (
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid #fff' }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                              {chat.buyerName}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {chat.lastMessageTime}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--primary-forest)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🏷️ {chat.productTitle?.split('(')[0]}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            💬 {chat.lastMessage}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => openChatById(chat.id)}
                          className="btn-chat-primary"
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', gap: '0.35rem' }}
                        >
                          <MessageSquare size={15} />
                          <span>{language === 'hi' ? 'चैट खोलें' : 'Open Chat'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: WhatsApp External Orders */}
          <div>
            <div className="section-header-bar">
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageCircle size={20} color="var(--whatsapp-dark)" />
                  <span>{t('whatsappLeads')} ({myInquiries.length})</span>
                </h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {t('totalInquiries')}
              </span>
            </div>

            <div style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--card-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {myInquiries.length === 0 ? (
                <div className="empty-state-box" style={{ padding: '2rem 1.5rem' }}>
                  <MessageCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    {language === 'hi' ? 'अभी तक कोई व्हाट्सएप संपर्क नहीं मिला है' : 'No WhatsApp leads yet'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '380px', margin: '0 auto' }}>
                    {language === 'hi' 
                      ? 'जब भी कोई ग्राहक आपके उत्पाद को देखकर व्हाट्सएप पर मैसेज करेगा, वह संपर्क यहां दिखेगा।' 
                      : 'Whenever a buyer taps to order on WhatsApp, their contact details will appear here.'}
                  </p>
                </div>
              ) : (
                <div>
                  {myInquiries.map((inq, idx) => (
                    <div 
                      key={inq.id || idx}
                      style={{ 
                        padding: '1rem 1.25rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: idx === myInquiries.length - 1 ? 'none' : '1px solid var(--card-border)',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: 'var(--whatsapp-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MessageCircle size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {inq.productTitle}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                            <span>⏱ {inq.timestamp}</span>
                            <span>•</span>
                            <span>📦 Qty: <strong>{inq.qty || '1 unit'}</strong></span>
                            <span>•</span>
                            <span>📱 +91 {inq.buyerPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={`https://wa.me/91${inq.buyerPhone}?text=${encodeURIComponent(`Namaste! Regarding your inquiry for ${inq.productTitle} on Fresh Fetch...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: 'var(--whatsapp-dark)',
                            color: '#ffffff',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={15} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: MY LISTINGS ONLY (जब 'Listings / उत्पाद' चुना जाए)
            (Note: WhatsApp leads removed completely from here)
           ========================================================================= */
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-header-bar">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Package size={20} color="var(--primary-forest)" />
                <span>{t('myListings')}</span>
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {myProducts.length} {t('totalProducts')}
            </span>
          </div>

          {myProducts.length === 0 ? (
            <div className="empty-state-box">
              <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'कोई उत्पाद नहीं है' : 'No products listed yet'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {language === 'hi' ? 'अपने खेत का शुद्ध देसी घी, तेल या मसाले जोड़ने के लिए नीचे क्लिक करें।' : 'Click below to list your pure farm products.'}
              </p>
              <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => setShowAddProductModal(true)}>
                <PlusCircle size={16} />
                <span>{t('addNewProduct')}</span>
              </button>
            </div>
          ) : (
            <div className="seller-listings-grid">
              {myProducts.map((product) => (
                <div key={product.id} className="seller-item-card">
                  <div className="seller-item-head">
                    <img src={product.image} alt={product.title} className="seller-item-img" />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: '1.25', marginTop: '0.1rem' }}>
                        {product.title}
                      </h4>

                      {/* Price Edit */}
                      <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {editingPriceId === product.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹</span>
                            <input
                              type="number"
                              style={{ width: '75px', padding: '0.2rem 0.4rem', border: '1.5px solid var(--primary-emerald)', borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem' }}
                              defaultValue={product.price}
                              onChange={(e) => setNewPriceVal(e.target.value)}
                              autoFocus
                            />
                            <button onClick={() => handleSavePrice(product.id)} style={{ background: 'var(--primary-forest)', color: '#fff', padding: '0.25rem', borderRadius: '4px' }}>
                              <Check size={13} />
                            </button>
                            <button onClick={() => setEditingPriceId(null)} style={{ background: '#fee2e2', color: '#ef4444', padding: '0.25rem', borderRadius: '4px' }}>
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-forest)' }}>₹{product.price}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {product.unit}</span>
                            <button
                              onClick={() => {
                                setEditingPriceId(product.id);
                                setNewPriceVal(product.price);
                              }}
                              style={{ color: 'var(--text-muted)', padding: '0.15rem' }}
                              title={t('editPrice')}
                            >
                              <Edit3 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quantity Edit */}
                      <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                        {editingQtyId === product.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                              type="text"
                              placeholder="e.g. 50 kg"
                              style={{ width: '90px', padding: '0.2rem 0.4rem', border: '1.5px solid var(--accent-gold)', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem' }}
                              defaultValue={product.availableQty || '25 kg'}
                              onChange={(e) => setNewQtyVal(e.target.value)}
                              autoFocus
                            />
                            <button onClick={() => handleSaveQuantity(product.id)} style={{ background: 'var(--accent-gold)', color: '#fff', padding: '0.25rem', borderRadius: '4px' }}>
                              <Check size={13} />
                            </button>
                            <button onClick={() => setEditingQtyId(null)} style={{ background: '#fee2e2', color: '#ef4444', padding: '0.25rem', borderRadius: '4px' }}>
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                            <span>📦 Stock: <strong>{product.availableQty || 'Available'}</strong></span>
                            <button
                              onClick={() => {
                                setEditingQtyId(product.id);
                                setNewQtyVal(product.availableQty || '25 kg');
                              }}
                              style={{ color: 'var(--accent-gold)', padding: '0.1rem', fontWeight: '700' }}
                              title={t('editQty')}
                            >
                              <Edit3 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Freshness Status & Expiry Auto-Removal Indicator */}
                      {product.expiryDate && (
                        <div style={{ marginTop: '0.45rem' }}>
                          {!isProductFresh(product) ? (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.55rem', fontSize: '0.74rem', color: '#b91c1c' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800', marginBottom: '0.3rem' }}>
                                <AlertTriangle size={13} color="#dc2626" />
                                <span>{t('expiredStatus')}</span>
                              </div>
                              <button
                                onClick={() => {
                                  renewProductBatch(product.id, product.shelfLifeDays || 180);
                                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                                }}
                                className="btn-primary"
                                style={{ width: '100%', padding: '0.3rem 0.6rem', fontSize: '0.74rem', gap: '0.3rem' }}
                              >
                                <RefreshCw size={12} />
                                <span>{t('renewBatchBtn')}</span>
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.5rem', fontSize: '0.74rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: getDaysRemaining(product.expiryDate) <= 3 ? '#ea580c' : '#15803d', fontWeight: '700' }}>
                                <Clock size={12} />
                                <span>{t('expiresOn')}: {product.expiryDate} ({getDaysRemaining(product.expiryDate)} {t('daysLeft')})</span>
                              </div>
                              <button
                                onClick={() => {
                                  renewProductBatch(product.id, product.shelfLifeDays || 180);
                                  confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                                }}
                                style={{ color: 'var(--primary-forest)', fontWeight: '800', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.1rem 0.3rem' }}
                                title="Made a fresh batch? Reset shelf-life period"
                              >
                                <RefreshCw size={11} />
                                <span>+ Batch</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="seller-item-actions">
                    <button
                      className={`toggle-stock-btn ${product.inStock ? 'active' : 'inactive'}`}
                      onClick={() => toggleProductStock(product.id)}
                    >
                      {product.inStock ? `● ${t('inStock')}` : `○ ${t('outOfStock')}`}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(t('confirmDelete'))) {
                          deleteProduct(product.id);
                        }
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444', fontSize: '0.78rem', fontWeight: '700' }}
                    >
                      <Trash2 size={13} />
                      <span>{t('deleteListing')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Farmer Guide Modal */}
      {showGuideModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={18} color="var(--primary-forest)" />
                <h3 className="modal-title">{t('farmerGuide')}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGuideModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', marginBottom: '0.2rem' }}>
                  1. {language === 'hi' ? 'गूगल ड्राइव से वीडियो जोड़ें' : 'Add Google Drive Videos'}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {language === 'hi' 
                    ? 'अपने फोन से बिलोने या तेल निकालने का वीडियो बनाएं, गूगल ड्राइव में अपलोड करके लिंक यहां जोड़ें।' 
                    : 'Record your preparation video on your phone, upload to Google Drive, and paste the shareable link here.'}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', marginBottom: '0.2rem' }}>
                  2. {language === 'hi' ? 'स्टॉक सही रखें' : 'Keep Stock Updated'}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {language === 'hi' 
                    ? 'यदि सामान समाप्त हो जाए तो तुरंत स्टॉक बदलें ताकि ग्राहकों को असुविधा न हो।' 
                    : 'Update your available quantity or mark out of stock when sold out.'}
                </p>
              </div>

              <button className="btn-primary" onClick={() => setShowGuideModal(false)}>
                {language === 'hi' ? 'ठीक है' : 'Got It'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
