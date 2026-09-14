import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, REGIONS } from '../data/mockData';
import { 
  PlusCircle, 
  X, 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Plus, 
  Video, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function AddProductModal() {
  const { 
    currentUser, 
    showAddProductModal, 
    setShowAddProductModal, 
    addProduct, 
    switchRole,
    setActiveTab,
    t, 
    language 
  } = useApp();

  const IMAGE_PRESETS = [
    { label: 'Desi Ghee', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1bilona_curd_churning_sample_drive_video_view/view?usp=sharing', badge: 'A2 Bilona Method', shelfLife: 180 },
    { label: 'Sarson Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1mustard_kolhu_coldpress_drive_video_view/view?usp=sharing', badge: 'Wood Pressed / Kolhu', shelfLife: 90 },
    { label: 'Pure Haldi', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1turmeric_stone_grinding_video_view/view?usp=sharing', badge: 'Stone Ground (हाथ पिसाई)', shelfLife: 365 },
    { label: 'Raw Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1honey_apiary_harvest_drive_video_view/view?usp=sharing', badge: '100% Raw Unprocessed', shelfLife: 365 },
    { label: 'Chakki Atta', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1chakki_atta_stone_grind_video/view?usp=sharing', badge: 'Slow Stone Ground', shelfLife: 30 },
    { label: 'Kinnow', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80', video: 'https://drive.google.com/file/d/1ganganagar_kinnow_orchard_harvest_video/view?usp=sharing', badge: 'Tree Ripened Pluck', shelfLife: 15 }
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: 'ghee',
    price: '',
    unit: 'kg',
    availableQty: '30 kg',
    minOrder: '1 kg',
    shelfLifeDays: 180,
    image: IMAGE_PRESETS[0].url,
    videoUrl: IMAGE_PRESETS[0].video,
    purityBadge: IMAGE_PRESETS[0].badge,
    purityMethod: '',
    processMedia: [],
    sellerLocation: currentUser?.location || 'Sangaria, Hanumangarh',
    regionId: currentUser?.regionId || 'hnm-sangaria'
  });

  if (!showAddProductModal) return null;

  // Upload handler for Main Product Photo
  const handleMainPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'hi' ? 'फ़ोटो 5MB से कम होनी चाहिए' : 'Photo size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload handler for Process / Making Photos
  const handleProcessPhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            processMedia: [
              ...(prev.processMedia || []),
              {
                type: 'image',
                url: event.target.result,
                caption: file.name.split('.')[0] || 'Making Step'
              }
            ]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProcessPhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      processMedia: (prev.processMedia || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert(language === 'hi' ? 'कृपया उत्पाद का नाम और मूल्य दर्ज करें' : 'Please provide product name and price');
      return;
    }
    if (!formData.image) {
      alert(language === 'hi' ? 'कृपया उत्पाद का फोटो अपलोड करें या चुनें' : 'Please upload or select a product photo');
      return;
    }

    addProduct({
      ...formData,
      price: Number(formData.price),
      shelfLifeDays: Number(formData.shelfLifeDays) || 180
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Ensure farmer mode and listings tab are active to view the new item
    switchRole('producer');
    setActiveTab('listings');
    setShowAddProductModal(false);

    setFormData({
      title: '',
      category: 'ghee',
      price: '',
      unit: 'kg',
      availableQty: '30 kg',
      minOrder: '1 kg',
      shelfLifeDays: 180,
      image: IMAGE_PRESETS[0].url,
      videoUrl: IMAGE_PRESETS[0].video,
      purityBadge: IMAGE_PRESETS[0].badge,
      purityMethod: '',
      processMedia: [],
      sellerLocation: currentUser?.location || 'Sangaria, Hanumangarh',
      regionId: currentUser?.regionId || 'hnm-sangaria'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🌾</span>
            <h3 className="modal-title">{t('prodFormTitle')}</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAddProductModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleAddSubmit}>
            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">{t('prodNameLabel')} *</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('prodNamePlaceholder')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">{t('prodCatLabel')}</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const matchingPreset = IMAGE_PRESETS.find(p => p.label.toLowerCase().includes(cat));
                    setFormData({ 
                      ...formData, 
                      category: cat,
                      image: matchingPreset ? matchingPreset.url : formData.image,
                      videoUrl: matchingPreset ? matchingPreset.video : formData.videoUrl,
                      purityBadge: matchingPreset ? matchingPreset.badge : formData.purityBadge,
                      shelfLifeDays: matchingPreset ? matchingPreset.shelfLife : formData.shelfLifeDays
                    });
                  }}
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {t(cat.key)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('prodLocationLabel')}</label>
                <select
                  className="form-select"
                  value={formData.regionId}
                  onChange={(e) => {
                    const selectedR = REGIONS.find(r => r.id === e.target.value);
                    setFormData({
                      ...formData,
                      regionId: e.target.value,
                      sellerLocation: selectedR ? selectedR.name : formData.sellerLocation
                    });
                  }}
                >
                  {REGIONS.filter(r => r.id !== 'all').map((r) => (
                    <option key={r.id} value={r.id}>
                      {language === 'hi' ? r.nameHi : language === 'pa' ? r.namePa : r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Unit & Available Stock Quantity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '0.65rem' }}>
              <div className="form-group">
                <label className="form-label">{t('prodPriceLabel')} *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', fontWeight: '800' }}>₹</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '1.8rem' }}
                    placeholder="1450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('prodUnitLabel')}</label>
                <select
                  className="form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="kg">{t('unitKg')}</option>
                  <option value="Litre">{t('unitLitre')}</option>
                  <option value="500g">{t('unitGram')}</option>
                  <option value="Pack">{t('unitPack')}</option>
                  <option value="Box (10kg)">{t('unitBox')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('prodQtyLabel')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 40 kg"
                  value={formData.availableQty}
                  onChange={(e) => setFormData({ ...formData, availableQty: e.target.value })}
                />
              </div>
            </div>

            {/* Freshness / Shelf-Life Period Selector */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="var(--primary-forest)" />
                <span>{t('shelfLifeLabel')} *</span>
              </label>
              <select
                className="form-select"
                value={formData.shelfLifeDays}
                onChange={(e) => setFormData({ ...formData, shelfLifeDays: Number(e.target.value) })}
              >
                <option value={3}>{t('shelfLife3Days')}</option>
                <option value={7}>{t('shelfLife7Days')}</option>
                <option value={15}>{t('shelfLife15Days')}</option>
                <option value={30}>{t('shelfLife30Days')}</option>
                <option value={90}>{t('shelfLife90Days')}</option>
                <option value={180}>{t('shelfLife180Days')}</option>
                <option value={365}>{t('shelfLife365Days')}</option>
              </select>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                🌿 {t('shelfLifeHelper')}
              </div>
            </div>

            {/* Main Product Photo Upload */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Camera size={16} color="var(--primary-forest)" />
                  <strong>{t('uploadPhotoLabel')} *</strong>
                </span>
                {formData.image && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary-emerald)', fontWeight: '700' }}>
                    ✓ Photo Ready
                  </span>
                )}
              </label>

              {/* Photo Upload Dropzone / Preview */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                {formData.image ? (
                  <div style={{ position: 'relative', width: '92px', height: '92px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--primary-emerald)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                    <img src={formData.image} alt="Selected Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.65)', color: '#fff', borderRadius: '50%', padding: '3px', display: 'flex' }}
                      title={t('removePhoto')}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : null}

                <div style={{ flex: 1 }}>
                  <label 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed var(--primary-forest)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      background: '#f0fdf4',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <UploadCloud size={22} color="var(--primary-forest)" style={{ marginBottom: '0.2rem' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--primary-forest)' }}>
                      {language === 'hi' ? 'फ़ोटो अपलोड करें या कैमरा खोलें' : 'Upload Photo / Camera'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {t('uploadPhotoHelper')}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMainPhotoUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              </div>

              {/* Quick Sample Presets Option */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  {t('orChoosePreset')}:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.35rem' }}>
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ 
                        ...formData, 
                        image: preset.url, 
                        videoUrl: preset.video, 
                        purityBadge: preset.badge,
                        shelfLifeDays: preset.shelfLife
                      })}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: formData.image === preset.url ? '2px solid var(--primary-emerald)' : '1px solid var(--card-border)',
                        position: 'relative',
                        height: '44px'
                      }}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.55rem', textAlign: 'center', padding: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Making Process / Farm Photos Upload (Optional) */}
            <div className="form-group" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ImageIcon size={15} color="var(--primary-forest)" />
                  <span>{t('uploadProcessPhotosLabel')}</span>
                </label>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--primary-forest)',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={13} />
                  <span>{t('addMorePhotos')}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleProcessPhotosUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {t('uploadProcessPhotosHelper')}
              </p>

              {/* Process Photos Gallery Preview */}
              {formData.processMedia && formData.processMedia.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                  {formData.processMedia.map((media, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                      <img src={media.url} alt="Process" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeProcessPhoto(idx)}
                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.65)', color: '#fff', borderRadius: '50%', padding: '2px', display: 'flex' }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Drive Video Link Input */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Video size={16} color="#2563eb" />
                <span>{language === 'hi' ? 'गूगल ड्राइव वीडियो लिंक (Google Drive Video Link)' : 'Google Drive Video Link'}</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://drive.google.com/file/d/1.../view?usp=sharing"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                💡 {language === 'hi' ? 'ड्राइव में वीडियो का शेयर लिंक "Anyone with the link can view" रखें' : 'Make sure the Google Drive link is set to "Anyone with the link can view"'}
              </div>
            </div>

            {/* Purity Method */}
            <div className="form-group">
              <label className="form-label">{t('prodPurityLabel')}</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder={t('prodPurityPlaceholder')}
                value={formData.purityMethod}
                onChange={(e) => setFormData({ ...formData, purityMethod: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowAddProductModal(false)}
              >
                {t('cancelBtn')}
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                <PlusCircle size={16} />
                <span>{t('saveProductBtn')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
