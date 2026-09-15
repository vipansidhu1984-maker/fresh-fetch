import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, REGIONS, formatDriveVideoUrl, isProductFresh, getDaysRemaining } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  MessageCircle, 
  MessageSquare,
  Phone, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Heart, 
  Video, 
  Check, 
  X, 
  Play, 
  AlertTriangle, 
  Send, 
  ExternalLink,
  Clock,
  Calendar,
  ShoppingBag,
  ArrowRight,
  PlusCircle,
  Tractor
} from 'lucide-react';

export function BuyerMarketplace() {
  const { 
    products, 
    selectedRegion, 
    setSelectedRegion, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    openChatWithProduct,
    trackWhatsAppInquiry, 
    wishlist, 
    toggleWishlist, 
    selectedProductDetail, 
    setSelectedProductDetail,
    showMakingMediaModal,
    setShowMakingMediaModal,
    addReview,
    activeTab,
    setActiveTab,
    role,
    setShowAddProductModal,
    registeredUsers,
    t, 
    language 
  } = useApp();

  const isWishlistView = activeTab === 'wishlist';

  // Helper to check if WhatsApp is enabled by the farmer for a product
  const isWhatsAppEnabled = (prod) => {
    if (!prod) return false;
    if (prod.showWhatsApp === false) return false;
    const sellerUser = (registeredUsers || []).find(
      (u) =>
        (u.id && u.id === prod.sellerId) ||
        (u.phone && (u.phone === prod.sellerPhone || `91${u.phone}` === prod.sellerWhatsApp))
    );
    if (sellerUser && sellerUser.showWhatsApp === false) return false;
    return Boolean(prod.sellerWhatsApp || prod.sellerPhone);
  };

  // Helper to check if direct phone contact is enabled by the farmer for a product
  const isPhoneEnabled = (prod) => {
    if (!prod) return false;
    if (prod.showPhone === false || !prod.sellerPhone) return false;
    const sellerUser = (registeredUsers || []).find(
      (u) =>
        (u.id && u.id === prod.sellerId) ||
        (u.phone && u.phone === prod.sellerPhone)
    );
    if (sellerUser && sellerUser.showPhone === false) return false;
    return true;
  };

  // Review Form State inside modal
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Filter products by region, category, search, freshness, and WISHLIST if in saved view
  const filteredProducts = (products || []).filter((prod) => {
    if (!prod || !prod.id) return false;

    // 1. If in Saved / Wishlist tab, must be in user's saved wishlist
    if (isWishlistView && !(wishlist || []).includes(prod.id)) {
      return false;
    }

    // 2. Auto-remove if shelf-life freshness period has expired
    if (!isProductFresh(prod)) {
      return false;
    }

    const matchCategory = 
      selectedCategory === 'all' || 
      !prod.category || 
      (prod.category && prod.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchRegion = 
      selectedRegion === 'all' || 
      !prod.regionId || 
      prod.regionId === selectedRegion ||
      prod.regionId === 'all';

    const query = (searchQuery || '').toLowerCase().trim();
    const matchSearch =
      !query ||
      (prod.title && prod.title.toLowerCase().includes(query)) ||
      (prod.purityBadge && prod.purityBadge.toLowerCase().includes(query)) ||
      (prod.sellerName && prod.sellerName.toLowerCase().includes(query)) ||
      (prod.sellerLocation && prod.sellerLocation.toLowerCase().includes(query)) ||
      (prod.category && prod.category.toLowerCase().includes(query));

    return matchCategory && matchRegion && matchSearch;
  });

  const handleReviewSubmit = (e, productId) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      alert(language === 'hi' ? 'कृपया अपनी समीक्षा लिखें' : 'Please write your review comment');
      return;
    }
    addReview(productId, {
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewComment('');
    setShowReviewForm(false);
    alert(t('reviewSubmitted'));
  };

  return (
    <div>
      {/* Clean Simplified Hero Banner */}
      {isWishlistView ? (
        /* Saved / Wishlist View Banner */
        <section className="clean-hero-card" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderColor: '#fecdd3' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="hero-mini-tag" style={{ background: '#ffe4e6', color: '#e11d48' }}>
                <Heart size={14} fill="#e11d48" />
                <span>{language === 'hi' ? 'आपकी पसंदीदा सूची' : language === 'pa' ? 'ਤੁਹਾਡੀ ਪਸੰਦੀਦਾ ਸੂਚੀ' : 'Your Saved Items'}</span>
              </div>
              <h1 className="hero-title-clean" style={{ color: '#9f1239' }}>
                {language === 'hi' ? (
                  <>सहेजे गए <span>पसंदीदा उत्पाद ({wishlist.length})</span></>
                ) : language === 'pa' ? (
                  <>ਸੇਵ ਕੀਤੇ <span>ਉਤਪਾਦ ({wishlist.length})</span></>
                ) : (
                  <>Saved <span>Produce ({wishlist.length})</span></>
                )}
              </h1>
              <p className="hero-sub-clean" style={{ color: '#881337' }}>
                {language === 'hi' 
                  ? 'व्हाट्सएप पर तुरंत आर्डर करने के लिए आपके द्वारा सहेजे गए शुद्ध उत्पाद' 
                  : language === 'pa'
                  ? 'ਵਟਸਐਪ ਤੇ ਤੁਰੰਤ ਆਰਡਰ ਕਰਨ ਲਈ ਤੁਹਾਡੇ ਦੁਆਰਾ ਸੇਵ ਕੀਤੇ ਗਏ ਉਤਪਾਦ'
                  : 'Pure farm items you have bookmarked for quick WhatsApp ordering'}
              </p>
            </div>

            <button 
              className="btn-secondary" 
              onClick={() => setActiveTab('marketplace')}
              style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', background: '#ffffff' }}
            >
              <ShoppingBag size={15} />
              <span>{language === 'hi' ? 'पूरा बाज़ार देखें' : 'Browse All Market'}</span>
            </button>
          </div>
        </section>
      ) : (
        /* Full Marketplace View Banner */
        <section className="clean-hero-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="hero-mini-tag">
                <Sparkles size={14} />
                <span>{language === 'hi' ? '100% शुद्ध व ताज़ा देसी उत्पाद' : '100% Fresh & Pure Produce'}</span>
              </div>
              <h1 className="hero-title-clean">
                {language === 'hi' ? (
                  <>100% शुद्ध <span>देसी उत्पाद बाज़ार</span></>
                ) : language === 'pa' ? (
                  <>100% ਸ਼ੁੱਧ <span>ਦੇਸੀ ਉਤਪਾਦ ਮਾਰਕੀਟ</span></>
                ) : (
                  <>100% Pure <span>Farm Produce Market</span></>
                )}
              </h1>
              <p className="hero-sub-clean">
                {language === 'hi' 
                  ? 'किसानों से सीधा संपर्क कर शुद्ध देसी घी, मसाले व फल ऑर्डर करें' 
                  : language === 'pa'
                  ? 'ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧਾ ਸ਼ੁੱਧ ਦੇਸੀ ਘਿਓ, ਮਸਾਲੇ ਅਤੇ ਫਲ ਮੰਗਵਾਓ'
                  : 'Order pure A2 ghee, stone-ground spices & fruits directly on WhatsApp'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div className="trust-pill">
                <ShieldCheck size={16} color="var(--primary-emerald)" />
                <span>0% Middlemen</span>
              </div>
              <div className="trust-pill">
                <Clock size={16} color="#fbbf24" />
                <span>Auto Freshness Check</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills Bar */}
      <div className="category-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{t(cat.key)}</span>
          </button>
        ))}
      </div>

      {/* Search & Location Bar */}
      <div className="filter-search-container">
        <div className="search-input-wrap">
          <Search size={18} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={isWishlistView ? (language === 'hi' ? 'सहेजे गए उत्पादों में खोजें...' : 'Search in saved items...') : t('searchPlaceholder')}
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

        {/* Location Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={16} color="var(--accent-gold)" />
          <select
            className="location-dropdown"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {language === 'hi' ? region.nameHi : language === 'pa' ? region.namePa : region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state-box">
          {isWishlistView ? (
            <div>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Heart size={26} fill="#ef4444" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'कोई पसंदीदा उत्पाद सहेजा नहीं गया' : language === 'pa' ? 'ਕੋਈ ਪਸੰਦੀਦਾ ਉਤਪਾਦ ਸੇਵ ਨਹੀਂ ਹੈ' : 'No saved items yet'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '360px', margin: '0 auto 1rem' }}>
                {language === 'hi' 
                  ? 'बाज़ार में किसी भी उत्पाद पर दिल (❤️) के निशान पर टैप करें ताकि वह यहां दिखे।' 
                  : language === 'pa'
                  ? 'ਮਾਰਕੀਟ ਵਿੱਚ ਕਿਸੇ ਵੀ ਉਤਪਾਦ ਤੇ ਦਿਲ (❤️) ਤੇ ਕਲਿੱਕ ਕਰੋ।'
                  : 'Tap the heart icon (❤️) on any item in the marketplace to save it here.'}
              </p>
              <button
                className="btn-primary"
                style={{ width: 'auto', margin: '0 auto' }}
                onClick={() => setActiveTab('marketplace')}
              >
                <ShoppingBag size={16} />
                <span>{language === 'hi' ? 'बाज़ार देखें' : 'Browse Marketplace'}</span>
              </button>
            </div>
          ) : products.length === 0 ? (
            <div>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Tractor size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                {language === 'hi' ? 'बाज़ार में अभी कोई सक्रिय लिस्टिंग नहीं है' : language === 'pa' ? 'ਮਾਰਕੀਟ ਵਿੱਚ ਅਜੇ ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਹੈ' : 'No Listings on Marketplace Yet'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '380px', margin: '0 auto 1rem' }}>
                {language === 'hi' 
                  ? 'जैसे ही क्षेत्र के किसान अपने शुद्ध उत्पाद (देसी घी, कच्ची घाणी तेल, मसाले) जोड़ेंगे, वे यहाँ सीधे दिखाई देंगे।' 
                  : language === 'pa'
                  ? 'ਜਿਵੇਂ ਹੀ ਖੇਤਰ ਦੇ ਕਿਸਾਨ ਆਪਣੇ ਸ਼ੁੱਧ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰਨਗੇ, ਉਹ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।'
                  : 'Real produce listings posted directly by verified local farmers will appear here live.'}
              </p>
              {role === 'producer' && (
                <button
                  className="btn-primary"
                  style={{ width: 'auto', margin: '0.5rem auto 0', gap: '0.4rem' }}
                  onClick={() => setShowAddProductModal(true)}
                >
                  <PlusCircle size={16} />
                  <span>{language === 'hi' ? '🚜 किसान: नया उत्पाद जोड़ें' : language === 'pa' ? '🚜 ਕਿਸਾਨ: ਨਵਾਂ ਉਤਪਾਦ ਜੋੜੋ' : '🚜 Farmers: Add Produce Listing'}</span>
                </button>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>{t('noProductsFound')}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {language === 'hi' ? 'चयनित फ़िल्टर के अनुसार कोई उत्पाद नहीं मिला।' : 'No products matched your selected filters.'}
              </p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRegion('all');
                  setSearchQuery('');
                }}
              >
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const daysRemaining = getDaysRemaining(product.expiryDate);

            return (
              <div key={product.id} className="product-card">
                {/* Product Image & Video Trigger */}
                <div className="product-card-img-wrap" onClick={() => setSelectedProductDetail(product)} style={{ cursor: 'pointer' }}>
                  <img src={product.image} alt={product.title} className="product-card-img" />
                  
                  {/* Purity Badge */}
                  <div className="purity-badge-pill">
                    <ShieldCheck size={12} />
                    <span>{product.purityBadge}</span>
                  </div>

                  {/* Stock Status */}
                  <div className={`stock-status-pill ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? t('inStock') : t('outOfStock')}
                  </div>

                  {/* Making Process Video Quick Button - ONLY IF VIDEO UPLOADED */}
                  {Boolean(product.videoUrl && product.videoUrl.trim() && !product.videoUrl.includes('sample_drive_video')) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMakingMediaModal(product);
                      }}
                      className="video-floating-badge"
                      title={t('watchMakingVideo')}
                    >
                      <Play size={13} fill="#fff" />
                      <span>{language === 'hi' ? 'ड्राइव वीडियो' : 'Drive Video'}</span>
                    </button>
                  )}

                  {/* Wishlist Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="wishlist-float-btn"
                    title="Save"
                  >
                    <Heart size={15} fill={wishlist.includes(product.id) ? '#ef4444' : 'none'} color={wishlist.includes(product.id) ? '#ef4444' : '#57534e'} />
                  </button>
                </div>

                {/* Product Body */}
                <div className="product-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span className="product-category-tag">{product.category}</span>
                    
                    {/* Real Rating Stars or 'New Listing' Tag (No default fake 5.0) */}
                    {product.reviews && product.reviews.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: '800', color: '#b45309' }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>{product.rating}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({product.reviews.length})</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary-forest)', background: '#ecfdf5', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                        ✨ {language === 'hi' ? 'नई लिस्टिंग' : language === 'pa' ? 'ਨਵੀਂ ਲਿਸਟਿੰਗ' : 'New Listing'}
                      </span>
                    )}
                  </div>
                  
                  <h3 
                    className="product-title" 
                    onClick={() => setSelectedProductDetail(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.title}
                  </h3>

                  <div className="product-price-wrap">
                    <span className="product-price">₹{product.price}</span>
                    <span className="product-unit">/ {product.unit}</span>
                    
                    {/* Stock Available Badge */}
                    {product.availableQty && (
                      <span className="stock-qty-badge">
                        📦 {product.availableQty}
                      </span>
                    )}
                  </div>

                  {/* Freshness Countdown Badge */}
                  {daysRemaining !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', color: daysRemaining <= 3 ? '#ea580c' : '#15803d', background: daysRemaining <= 3 ? '#ffedd5' : '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', marginBottom: '0.4rem', fontWeight: '700' }}>
                      <Clock size={12} />
                      <span>{daysRemaining > 0 ? `🌿 ${daysRemaining} ${t('daysLeft')}` : '⚠️ Last Day Today'}</span>
                    </div>
                  )}

                  {/* Producer Strip */}
                  <div className="producer-info-strip">
                    <div className="producer-avatar">
                      {(product.sellerName || 'F').charAt(0)}
                    </div>
                    <div className="producer-meta">
                      <div className="producer-name">
                        <span>{(product.sellerName || 'Farmer').split('(')[0]}</span>
                        {product.verified && <ShieldCheck size={13} color="var(--primary-emerald)" />}
                      </div>
                      <div className="producer-location">
                        📍 {product.sellerLocation}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Primary In-App Chat + Secondary WhatsApp & Call (Honoring Farmer Privacy Toggles) */}
                  <div className="product-card-actions">
                    <button
                      className="btn-chat-primary"
                      onClick={() => openChatWithProduct(product)}
                      title={t('chatWithFarmer')}
                    >
                      <MessageSquare size={16} />
                      <span>{t('chatWithFarmer')}</span>
                    </button>

                    {(isWhatsAppEnabled(product) || isPhoneEnabled(product)) && (
                      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        {isWhatsAppEnabled(product) && (
                          <button
                            className="btn-whatsapp-compact"
                            onClick={() => trackWhatsAppInquiry(product)}
                            title={t('secondaryWhatsApp')}
                          >
                            <MessageCircle size={17} />
                          </button>
                        )}

                        {isPhoneEnabled(product) && (
                          <a
                            href={`tel:${product.sellerPhone}`}
                            className="btn-call-compact"
                            title={t('callProducerAction')}
                          >
                            <Phone size={15} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Auxiliary Links: Details & Optional Drive Video */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem', paddingTop: '0.4rem', borderTop: '1px solid var(--card-border)', fontSize: '0.75rem' }}>
                    <button
                      onClick={() => setSelectedProductDetail(product)}
                      style={{ color: 'var(--primary-forest)', fontWeight: '700' }}
                    >
                      {t('viewDetails')}
                    </button>

                    {Boolean(product.videoUrl && product.videoUrl.trim() && !product.videoUrl.includes('sample_drive_video')) && (
                      <button
                        onClick={() => setShowMakingMediaModal(product)}
                        style={{ color: 'var(--primary-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Video size={13} />
                        <span>{language === 'hi' ? 'ड्राइव वीडियो' : 'Watch Video'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          PRODUCT DETAIL & REVIEWS MODAL
         ========================================================= */}
      {selectedProductDetail && (
        <div className="modal-overlay" onClick={() => setSelectedProductDetail(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={20} color="var(--primary-emerald)" />
                <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
                  {(selectedProductDetail.title || 'Product').split('(')[0]}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedProductDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Image & Video Button */}
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', marginBottom: '1rem' }}>
                <img 
                  src={selectedProductDetail.image} 
                  alt={selectedProductDetail.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {Boolean(selectedProductDetail.videoUrl && selectedProductDetail.videoUrl.trim() && !selectedProductDetail.videoUrl.includes('sample_drive_video')) && (
                  <button
                    onClick={() => setShowMakingMediaModal(selectedProductDetail)}
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Play size={14} fill="#fff" />
                    <span>{language === 'hi' ? 'ड्राइव वीडियो देखें' : 'Watch Drive Video'}</span>
                  </button>
                )}
              </div>

              {/* Price & Rating Header */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
                    ₹{selectedProductDetail.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / {selectedProductDetail.unit}</span>
                  {selectedProductDetail.availableQty && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', background: '#ecfdf5', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                      Stock: {selectedProductDetail.availableQty}
                    </span>
                  )}
                </div>

                {/* Real Reviews Average Rating or 'New' */}
                {selectedProductDetail.reviews && selectedProductDetail.reviews.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '800', color: '#b45309' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span>{selectedProductDetail.rating} / 5</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '500' }}>({selectedProductDetail.reviews.length})</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-forest)', background: '#ecfdf5', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                    ✨ {language === 'hi' ? 'नई लिस्टिंग' : language === 'pa' ? 'ਨਵੀਂ ਲਿਸਟਿੰਗ' : 'New Listing'}
                  </span>
                )}
              </div>

              {/* Freshness Expiry Info Box */}
              {selectedProductDetail.expiryDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.55rem 0.85rem', marginBottom: '0.85rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={15} color="var(--primary-forest)" />
                  <span>
                    <strong>{t('expiresOn')}:</strong> {selectedProductDetail.expiryDate} ({getDaysRemaining(selectedProductDetail.expiryDate)} {t('daysLeft')})
                  </span>
                </div>
              )}

              {/* Purity Method */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  ✨ {t('purityMethod')} ({selectedProductDetail.purityBadge})
                </div>
                <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.45' }}>
                  {selectedProductDetail.purityMethod}
                </p>
              </div>

              {/* Farmer Info */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="producer-avatar">{(selectedProductDetail.sellerName || 'F').charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{selectedProductDetail.sellerName || 'Farmer'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {selectedProductDetail.sellerLocation} • {selectedProductDetail.farmName}</div>
                  </div>
                </div>
              </div>

              {/* Primary In-App Chat + Secondary WhatsApp & Call Buttons (Honoring Farmer Privacy Toggles) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                <button
                  className="btn-chat-primary"
                  style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', justifyContent: 'center' }}
                  onClick={() => {
                    openChatWithProduct(selectedProductDetail);
                    setSelectedProductDetail(null);
                  }}
                >
                  <MessageSquare size={19} />
                  <span>{t('chatWithFarmer')}</span>
                </button>

                {(isWhatsAppEnabled(selectedProductDetail) || isPhoneEnabled(selectedProductDetail)) && (
                  <div style={{ display: 'grid', gridTemplateColumns: (isWhatsAppEnabled(selectedProductDetail) && isPhoneEnabled(selectedProductDetail)) ? '1fr 1fr' : '1fr', gap: '0.6rem' }}>
                    {isWhatsAppEnabled(selectedProductDetail) && (
                      <button
                        className="btn-whatsapp"
                        style={{ justifyContent: 'center', padding: '0.65rem 0.75rem', fontSize: '0.82rem' }}
                        onClick={() => trackWhatsAppInquiry(selectedProductDetail)}
                      >
                        <MessageCircle size={16} />
                        <span>{t('secondaryWhatsApp')}</span>
                      </button>
                    )}
                    {isPhoneEnabled(selectedProductDetail) && (
                      <a
                        href={`tel:${selectedProductDetail.sellerPhone}`}
                        className="btn-call"
                        style={{ justifyContent: 'center', padding: '0.65rem 0.75rem', fontSize: '0.82rem' }}
                      >
                        <Phone size={15} />
                        <span>{t('callProducer')}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Reviews Section */}
              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
                    {t('customerReviews')} ({selectedProductDetail.reviews?.length || 0})
                  </h4>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-forest)', textDecoration: 'underline' }}
                  >
                    {showReviewForm ? t('cancelBtn') : `+ ${t('writeReviewBtn')}`}
                  </button>
                </div>

                {/* Write Review Form */}
                {showReviewForm && (
                  <form 
                    onSubmit={(e) => handleReviewSubmit(e, selectedProductDetail.id)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>{t('ratingLabel')}</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            style={{ padding: '0.2rem' }}
                          >
                            <Star 
                              size={22} 
                              fill={star <= reviewRating ? '#f59e0b' : 'none'} 
                              color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        placeholder={t('reviewCommentPlaceholder')}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.88rem' }}>
                      <Send size={15} />
                      <span>{t('submitReviewBtn')}</span>
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(!selectedProductDetail.reviews || selectedProductDetail.reviews.length === 0) ? (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                      No reviews yet. Be the first to review!
                    </div>
                  ) : (
                    (selectedProductDetail.reviews || []).map((rev) => (
                      <div key={rev.id} style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{rev.reviewerName}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < Math.round(rev.rating) ? '#f59e0b' : '#e2e8f0'}
                                color={i < Math.round(rev.rating) ? '#f59e0b' : '#e2e8f0'}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {rev.comment}
                        </p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          📅 {rev.date}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MAKING PROCESS PHOTOS & GOOGLE DRIVE VIDEOS MODAL
         ========================================================= */}
      {showMakingMediaModal && (
        <div className="modal-overlay" onClick={() => setShowMakingMediaModal(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Video size={20} color="var(--primary-forest)" />
                <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
                  {t('makingProcessTitle')}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowMakingMediaModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {t('makingProcessSub')}: <strong>{(showMakingMediaModal?.title || 'Product').split('(')[0]}</strong>
              </p>

              {/* Google Drive Video Player or HTML5 Video */}
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                {showMakingMediaModal.fallbackDirectVideo ? (
                  <video 
                    controls 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                    src={showMakingMediaModal.fallbackDirectVideo}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : showMakingMediaModal.videoUrl ? (
                  <iframe 
                    src={formatDriveVideoUrl(showMakingMediaModal.videoUrl)} 
                    width="100%" 
                    height="240" 
                    allow="autoplay; fullscreen"
                    style={{ border: 'none' }}
                    title="Google Drive Video Player"
                  />
                ) : null}
              </div>

              {/* Open in Google Drive Link */}
              {showMakingMediaModal.videoUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <a
                    href={showMakingMediaModal.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      fontSize: '0.82rem', 
                      fontWeight: '700', 
                      color: '#2563eb',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <span>{language === 'hi' ? 'गूगल ड्राइव में वीडियो खोलें' : 'Open in Google Drive'}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Photo Gallery */}
              {showMakingMediaModal.processMedia && (
                <div>
                  <h4 style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-forest)' }}>
                    📸 {language === 'hi' ? 'तैयारी की तस्वीरें' : 'Process Photos'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    {(showMakingMediaModal.processMedia || []).map((media, idx) => (
                      <div key={idx} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                        <img src={media.url} alt={media.caption} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                        <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontWeight: '700', background: 'var(--bg-subtle)' }}>
                          {media.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isWhatsAppEnabled(showMakingMediaModal) ? (
                <button
                  className="btn-whatsapp"
                  style={{ marginTop: '1.25rem', width: '100%' }}
                  onClick={() => {
                    trackWhatsAppInquiry(showMakingMediaModal);
                    setShowMakingMediaModal(null);
                  }}
                >
                  <MessageCircle size={18} />
                  <span>{t('contactViaWhatsApp')}</span>
                </button>
              ) : (
                <button
                  className="btn-chat-primary"
                  style={{ marginTop: '1.25rem', width: '100%', padding: '0.75rem 1rem' }}
                  onClick={() => {
                    openChatWithProduct(showMakingMediaModal);
                    setShowMakingMediaModal(null);
                  }}
                >
                  <MessageSquare size={18} />
                  <span>{t('chatWithFarmer')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
