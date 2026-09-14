import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REGIONS } from '../data/mockData';
import { 
  X, 
  User, 
  Camera, 
  UploadCloud, 
  Phone, 
  Calendar, 
  MapPin, 
  Tractor, 
  Check, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, role, updateUserProfile, language, t } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    dob: currentUser?.dob || '',
    location: currentUser?.location || 'Hanumangarh Town',
    regionId: currentUser?.regionId || 'hnm-town',
    farmName: currentUser?.farmName || '',
    avatar: currentUser?.avatar || ''
  });

  if (!isOpen) return null;

  // Handle Profile Photo Upload (Camera / Gallery)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'hi' ? 'फ़ोटो 5MB से कम होनी चाहिए' : 'Photo size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }

    updateUserProfile(formData);

    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={20} color="var(--primary-forest)" />
            <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
              {language === 'hi' ? 'प्रोफ़ाइल संपादित करें (Edit Profile)' : 'Edit Profile Details'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSave}>
            {/* Profile Photo Uploader */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: '84px', height: '84px', marginBottom: '0.5rem' }}>
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '3px solid var(--primary-emerald)', boxShadow: 'var(--shadow-md)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, var(--primary-forest), var(--primary-emerald))',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: '800',
                      border: '3px solid #ffffff',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                {/* Camera upload badge */}
                <label
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    background: 'var(--primary-forest)',
                    color: '#ffffff',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    border: '2px solid #ffffff'
                  }}
                  title={language === 'hi' ? 'फ़ोटो बदलें' : 'Upload photo'}
                >
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <label
                style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: 'var(--primary-forest)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Camera size={13} />
                <span>{language === 'hi' ? 'फ़ोटो बदलें / अपलोड करें' : 'Change Profile Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">{t('fullNameLabel')} *</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('fullNamePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Mobile Phone */}
            <div className="form-group">
              <label className="form-label">{t('phoneLabel')} *</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span className="phone-prefix-badge">+91</span>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>
            </div>

            {/* Date of Birth & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">{t('dobLabel')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('locationLabel')}</label>
                <select
                  className="form-select"
                  value={formData.regionId}
                  onChange={(e) => {
                    const reg = REGIONS.find(r => r.id === e.target.value);
                    setFormData({
                      ...formData,
                      regionId: e.target.value,
                      location: reg ? reg.name : formData.location
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

            {/* Farm / Goshala Name (Only for Farmer Role) */}
            {role === 'producer' && (
              <div className="form-group">
                <label className="form-label">
                  🌾 {language === 'hi' ? 'खेत या गौशाला का नाम' : 'Farm / Goshala Name'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kisan Pure Farm / Rathi Gau Seva"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                {t('cancelBtn')}
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                <Check size={16} />
                <span>{language === 'hi' ? 'बदलाव सहेजें (Save)' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
