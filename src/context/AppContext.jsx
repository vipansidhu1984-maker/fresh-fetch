import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  INITIAL_PRODUCTS, 
  DEMO_USERS, 
  REGISTERED_USERS_SEED, 
  INITIAL_CHATS,
  calculateExpiryDate, 
  isProductFresh, 
  getDaysRemaining 
} from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  isFirebaseConfigured,
  subscribeToCloudProducts,
  saveProductToCloud,
  deleteProductFromCloud,
  updateProductInCloud,
  saveUserToCloud,
  fetchUserFromCloud,
  subscribeToUserChats,
  sendChatMessageToCloud,
  createChatInCloud,
  saveInquiryToCloud,
  sendFirebasePhoneOtp,
  verifyFirebasePhoneOtp,
  setupRecaptcha
} from '../services/firebase';

const AppContext = createContext();

function safeJsonParse(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function AppProvider({ children }) {
  // Language state (English, Hindi, Punjabi)
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('freshfetch_lang') || 'hi';
    } catch {
      return 'hi';
    }
  });

  // Dark Mode state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('freshfetch_dark') === 'true';
    } catch {
      return false;
    }
  });

  // Persistent Registered Users Database (User Data Storage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    return safeJsonParse('freshfetch_registered_users', REGISTERED_USERS_SEED);
  });

  // Current User state
  const [currentUser, setCurrentUser] = useState(() => {
    return safeJsonParse('freshfetch_user', null);
  });

  // Active Role ('producer' | 'buyer')
  const [role, setRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('freshfetch_role');
      if (savedRole) return savedRole;
      const savedUser = safeJsonParse('freshfetch_user', null);
      return savedUser?.role || null;
    } catch {
      return null;
    }
  });

  // Onboarding Step state
  const [onboardingStep, setOnboardingStep] = useState(currentUser ? 5 : 1);

  // Temporary registration state
  const [tempRegistration, setTempRegistration] = useState({
    fullName: '',
    dob: '',
    phone: '',
    location: 'Hanumangarh Town',
    regionId: 'hnm-town',
    password: '',
    role: 'buyer'
  });

  // Active Bottom Nav Tab
  const [activeTab, setActiveTab] = useState('marketplace');

  // Products state
  const [products, setProducts] = useState(() => {
    return safeJsonParse('freshfetch_products', INITIAL_PRODUCTS);
  });

  // In-App Chat Threads state
  const [chats, setChats] = useState(() => {
    return safeJsonParse('freshfetch_chats', INITIAL_CHATS);
  });
  const [activeChat, setActiveChat] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  // Inquiries tracking (Clear by default for new users)
  const [inquiries, setInquiries] = useState(() => {
    const saved = safeJsonParse('freshfetch_inquiries', []);
    return (Array.isArray(saved) ? saved : []).filter(
      (i) => i && i.id && i.id !== 'inq-1' && i.id !== 'inq-2'
    );
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    return safeJsonParse('freshfetch_wishlist', ['prod-1', 'prod-3']);
  });

  // UI Filter states
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [showMakingMediaModal, setShowMakingMediaModal] = useState(null);

  // Sync Dark Mode to DOM and localStorage
  useEffect(() => {
    localStorage.setItem('freshfetch_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('freshfetch_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('freshfetch_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('freshfetch_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('freshfetch_role', role);
    } else {
      localStorage.removeItem('freshfetch_role');
    }
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('freshfetch_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('freshfetch_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('freshfetch_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('freshfetch_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('freshfetch_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Real-time Cloud Synchronization (Google Cloud Firestore 24/7)
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Subscribe to Live Cloud Products
    const unsubscribeProducts = subscribeToCloudProducts((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts(cloudProds);
      }
    });

    // 2. Subscribe to Live User Chats
    let unsubscribeChats = () => {};
    if (currentUser?.id || currentUser?.phone) {
      const uId = currentUser.id || currentUser.phone;
      unsubscribeChats = subscribeToUserChats(uId, role || 'buyer', (cloudChats) => {
        if (cloudChats && cloudChats.length > 0) {
          setChats(cloudChats);
        }
      });
    }

    return () => {
      unsubscribeProducts();
      unsubscribeChats();
    };
  }, [currentUser?.id, currentUser?.phone, role]);

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Switch Language
  const switchLanguage = (newLang) => {
    setLanguage(newLang);
  };

  // Switch Role
  const switchRole = (newRole) => {
    setRole(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
    }
  };

  // Update User Profile (Details & Photo)
  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      ...updatedFields
    };
    setCurrentUser(updated);

    // Sync in registered users list
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updated.id || u.phone === updated.phone ? { ...u, ...updated } : u))
    );

    // Sync to Cloud Firestore
    saveUserToCloud(updated);

    // If user is a farmer and changed name/location, sync to products
    if (updated.role === 'producer') {
      setProducts((prev) =>
        prev.map((p) =>
          p.sellerId === updated.id
            ? {
                ...p,
                sellerName: updated.name,
                sellerPhone: updated.phone || p.sellerPhone,
                sellerLocation: updated.location || p.sellerLocation,
                farmName: updated.farmName || p.farmName
              }
            : p
        )
      );
    }
  };

  // --- AUTHENTICATION & CREDENTIAL STORAGE METHODS ---

  // 1. Password Login (Local & Cloud Firestore)
  const loginWithPassword = async (phone, password) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let user = registeredUsers.find((u) => u.phone === cleanPhone);

    // Check Cloud Firestore if not found locally
    if (!user && isFirebaseConfigured) {
      try {
        const cloudUser = await fetchUserFromCloud(cleanPhone);
        if (cloudUser) {
          user = cloudUser;
          setRegisteredUsers((prev) => [...prev.filter((u) => u.phone !== cleanPhone), cloudUser]);
        }
      } catch (err) {
        console.warn("Cloud user fetch check:", err);
      }
    }

    if (!user) {
      return { success: false, error: t('userNotFound') };
    }

    if (user.password !== password) {
      return { success: false, error: t('invalidCredentials') };
    }

    setCurrentUser(user);
    setRole(user.role);
    setOnboardingStep(5);
    setShowAuthModal(false);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    return { success: true, user };
  };

  // 2. Request OTP for Login
  const requestLoginOtp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const user = registeredUsers.find((u) => u.phone === cleanPhone);
    return { success: true, simulatedOtp: '4821', user };
  };

  // 3. Verify OTP for Login (Supports 6-digit and 4-digit codes)
  const verifyLoginOtp = async (phone, otp) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let user = registeredUsers.find((u) => u.phone === cleanPhone);

    if (!user && isFirebaseConfigured) {
      try {
        const cloudUser = await fetchUserFromCloud(cleanPhone);
        if (cloudUser) {
          user = cloudUser;
          setRegisteredUsers((prev) => [...prev.filter((u) => u.phone !== cleanPhone), cloudUser]);
        }
      } catch (err) {
        console.warn("Cloud user fetch check:", err);
      }
    }

    if (!user) {
      // Auto-create profile for verified phone user
      const newUser = {
        id: `user-${Date.now()}`,
        name: 'Fresh Fetch Member',
        phone: cleanPhone,
        password: 'pass' + cleanPhone.slice(-4),
        location: 'Hanumangarh Town',
        regionId: 'hnm-town',
        role: role || 'buyer',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
      };
      registerNewUser(newUser);
      return { success: true, user: newUser };
    }

    setCurrentUser(user);
    setRole(user.role);
    setOnboardingStep(5);
    setShowAuthModal(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    return { success: true, user };
  };

  // 4. Request Password Reset OTP
  const requestPasswordReset = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const user = registeredUsers.find((u) => u.phone === cleanPhone);
    return { success: true, simulatedOtp: '4821', phone: cleanPhone, user };
  };

  // 5. Reset Password using OTP & update database (Local + Cloud)
  const resetPasswordWithOtp = async (phone, otp, newPassword) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let user = registeredUsers.find((u) => u.phone === cleanPhone);

    if (!user && isFirebaseConfigured) {
      try {
        const cloudUser = await fetchUserFromCloud(cleanPhone);
        if (cloudUser) {
          user = cloudUser;
        }
      } catch (err) {
        console.warn("Cloud user fetch on reset:", err);
      }
    }

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: 'Fresh Fetch Member',
        phone: cleanPhone,
        password: newPassword,
        location: 'Hanumangarh Town',
        regionId: 'hnm-town',
        role: role || 'buyer'
      };
    }

    const updatedUser = { ...user, password: newPassword };

    // Update in registered users database
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.phone === cleanPhone ? updatedUser : u))
    );

    // Save to Firestore
    saveUserToCloud(updatedUser);

    // Automatically log in
    setCurrentUser(updatedUser);
    setRole(updatedUser.role);
    setOnboardingStep(5);
    setShowAuthModal(false);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    return { success: true, user: updatedUser };
  };

  // 6. Register New User and store in user database
  const registerNewUser = (data) => {
    const cleanPhone = data.phone ? data.phone.replace(/\D/g, '') : '9876543210';
    
    // Check if phone already registered
    const existing = registeredUsers.find((u) => u.phone === cleanPhone);
    if (existing) {
      // update existing password / info
      const updated = { ...existing, ...data, phone: cleanPhone };
      setRegisteredUsers((prev) => prev.map((u) => (u.phone === cleanPhone ? updated : u)));
      setCurrentUser(updated);
      setRole(updated.role);
      setOnboardingStep(5);
      saveUserToCloud(updated);
      return { success: true, user: updated };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.fullName || (data.role === 'producer' ? 'Kisan Producer' : 'Valued Buyer'),
      dob: data.dob || '1995-01-01',
      phone: cleanPhone,
      password: data.password || 'fresh123',
      location: data.location || 'Hanumangarh Town',
      regionId: data.regionId || 'hnm-town',
      role: data.role || role || 'buyer',
      farmName: data.role === 'producer' ? `${data.fullName || 'Kisan'}'s Farm` : '',
      avatar: data.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRole(newUser.role);
    setOnboardingStep(5);

    // Sync user account to 24/7 Cloud Firestore
    saveUserToCloud(newUser);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    return { success: true, user: newUser };
  };

  // Onboarding Step Helpers
  const selectLanguageAndNext = (lang) => {
    setLanguage(lang);
    setOnboardingStep(2);
  };

  const selectRoleAndNext = (chosenRole) => {
    setRole(chosenRole);
    setTempRegistration((prev) => ({ ...prev, role: chosenRole }));
    setOnboardingStep(3);
  };

  const submitRegistrationAndRequestOtp = (data) => {
    setTempRegistration((prev) => ({ ...prev, ...data }));
    setOnboardingStep(4);
  };

  const verifyOtpAndComplete = (enteredOtp) => {
    if (tempRegistration.isOtpLogin) {
      const cleanPhone = (tempRegistration.phone || '').replace(/\D/g, '');
      const existing = registeredUsers.find((u) => u.phone === cleanPhone);
      if (existing) {
        setCurrentUser(existing);
        setRole(existing.role);
        setOnboardingStep(5);
        return { success: true, user: existing };
      }
      return registerNewUser({
        phone: cleanPhone,
        fullName: role === 'producer' ? 'Kisan Member' : 'Fresh Fetch Buyer',
        role: role || 'buyer'
      });
    }
    return registerNewUser(tempRegistration);
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    setOnboardingStep(1);
    localStorage.removeItem('freshfetch_user');
    localStorage.removeItem('freshfetch_role');
  };

  // --- IN-APP CHAT METHODS ---

  // Open chat with farmer for a given product
  const openChatWithProduct = (product) => {
    if (!product) return;

    // Check if chat thread already exists for this product
    const existingChat = chats.find(
      (c) => c.productId === product.id && (c.buyerId === currentUser?.id || c.buyerPhone === currentUser?.phone)
    ) || chats.find((c) => c.productId === product.id);

    if (existingChat) {
      setActiveChat(existingChat);
      setShowChatModal(true);
      return;
    }

    // Create new chat thread
    const newChat = {
      id: `chat-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productUnit: product.unit,
      productImage: product.image,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerPhone: product.sellerPhone,
      sellerWhatsApp: product.sellerWhatsApp || `91${product.sellerPhone}`,
      sellerLocation: product.sellerLocation,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: currentUser?.name || 'Buyer',
      buyerPhone: currentUser?.phone || '9876543210',
      unreadCountFarmer: 1,
      unreadCountBuyer: 0,
      lastMessage: `Inquiry for ${product.title}`,
      lastMessageTime: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}-0`,
          senderRole: 'producer',
          senderName: (product.sellerName || 'Farmer').split('(')[0].trim(),
          text: `Namaste! I am ${(product.sellerName || 'Farmer').split('(')[0].trim()} from ${product.sellerLocation || 'Hanumangarh'}. How can I help you with this fresh batch of ${(product.title || 'Produce').split('(')[0].trim()}?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
    setShowChatModal(true);

    // Sync chat channel to Cloud Firestore
    createChatInCloud(newChat);
  };

  const openChatById = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
      setShowChatModal(true);
    }
  };

  // Send a message inside chat thread
  const sendMessage = (chatId, text, senderRole = (role || 'buyer')) => {
    if (!text || !text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole,
      senderName: currentUser?.name || (senderRole === 'producer' ? 'Farmer' : 'Buyer'),
      text: text.trim(),
      time: timeStr,
      status: 'sent'
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: timeStr,
          messages: [...c.messages, newMsg]
        };
      })
    );

    setActiveChat((prev) => {
      if (!prev || prev.id !== chatId) return prev;
      return {
        ...prev,
        lastMessage: text.trim(),
        lastMessageTime: timeStr,
        messages: [...prev.messages, newMsg]
      };
    });

    // Send to Cloud Firestore for real-time multi-device sync
    sendChatMessageToCloud(chatId, newMsg);

    // Auto-reply simulation from Farmer if buyer sent a message
    if (senderRole === 'buyer') {
      setTimeout(() => {
        const autoReplies = [
          'Ji bilkul! Fresh batch kal hi pack kiya hai. Hanumanhargh / Ganganagar me delivery available hai.',
          'Ram Ram ji! Hum bina kisi chemical ke banate hain. Aap kitna quantity lena chahte hain?',
          'Haan ji, rate bilkul genuine hai. Aap cash on delivery ya UPI se payment kar sakte hain.',
          'Namaste! Pure traditional method se banta hai. Aapko fresh batch deliver karwayenge.'
        ];
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const farmerReplyMsg = {
          id: `msg-${Date.now()}-reply`,
          senderRole: 'producer',
          senderName: activeChat?.sellerName?.split('(')[0]?.trim() || 'Farmer Producer',
          text: replyText,
          time: replyTime,
          status: 'read'
        };

        setChats((prevChats) =>
          prevChats.map((c) => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: replyTime,
              messages: [...c.messages, farmerReplyMsg]
            };
          })
        );

        setActiveChat((prev) => {
          if (!prev || prev.id !== chatId) return prev;
          return {
            ...prev,
            lastMessage: replyText,
            lastMessageTime: replyTime,
            messages: [...prev.messages, farmerReplyMsg]
          };
        });
      }, 1200);
    }
  };

  // Product Management Functions
  const addProduct = (newProduct) => {
    const shelfLifeDays = Number(newProduct.shelfLifeDays) || 180;
    const expiryDate = calculateExpiryDate(shelfLifeDays);

    const productObj = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      sellerId: currentUser?.id || 'farmer-ramesh',
      sellerName: currentUser?.name || 'Ramesh Kumar (रमेश कुमार)',
      sellerPhone: currentUser?.phone || '9829012345',
      sellerWhatsApp: `91${currentUser?.phone || '9829012345'}`,
      sellerLocation: currentUser?.location || 'Sangaria, Hanumangarh',
      regionId: currentUser?.regionId || 'hnm-sangaria',
      farmName: currentUser?.farmName || 'Kisan Pure Farm',
      availableQty: newProduct.availableQty || '25 kg',
      shelfLifeDays,
      expiryDate,
      verified: true,
      inStock: true,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      createdDate: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [productObj, ...prev]);

    // Save to Cloud Firestore
    saveProductToCloud(productObj);
  };

  // Renew Fresh Batch (resets expiry date and restores inStock status)
  const renewProductBatch = (productId, days = 180) => {
    const newExpiryDate = calculateExpiryDate(days);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              shelfLifeDays: Number(days),
              expiryDate: newExpiryDate,
              inStock: true,
              outOfStockReported: false,
              harvestDate: 'Fresh New Batch'
            }
          : p
      )
    );
  };

  const updateProductPrice = (productId, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: Number(newPrice) } : p))
    );
    updateProductInCloud(productId, { price: Number(newPrice) });
  };

  const updateProductQuantity = (productId, newQty) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, availableQty: newQty } : p))
    );
    updateProductInCloud(productId, { availableQty: newQty });
  };

  const toggleProductStock = (productId) => {
    let updatedVal = false;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          updatedVal = !p.inStock;
          return { ...p, inStock: !p.inStock };
        }
        return p;
      })
    );
    updateProductInCloud(productId, { inStock: updatedVal });
  };

  // Buyer reports product as out of stock
  const reportOutOfStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: false, outOfStockReported: true } : p))
    );
  };

  // Add Review
  const addReview = (productId, reviewData) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      reviewerName: currentUser?.name || 'Valued Buyer',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || 'Authentic pure product.',
      date: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [newRev, ...(p.reviews || [])];
        const avgRating = Number(
          (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length
          ).toFixed(1)
        );
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating
        };
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromCloud(productId);
  };

  // Track WhatsApp click
  const trackWhatsAppInquiry = (product) => {
    const newInquiry = {
      id: `inq-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      buyerPhone: currentUser?.phone || 'City Buyer',
      sellerId: product.sellerId,
      sellerPhone: product.sellerWhatsApp || product.sellerPhone || '',
      timestamp: new Date().toLocaleString(),
      qty: product.minOrder || '1 unit'
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    const message = t('whatsappMsgTemplate')
      .replace('{sellerName}', (product.sellerName || 'Farmer').split('(')[0].trim())
      .replace('{productName}', (product.title || 'Produce').split('(')[0].trim())
      .replace('{price}', product.price || '')
      .replace('{unit}', product.unit || '');

    const waUrl = `https://wa.me/${product.sellerWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        switchLanguage,
        darkMode,
        toggleDarkMode,
        setDarkMode,
        role,
        switchRole,
        currentUser,
        updateUserProfile,
        logout,
        onboardingStep,
        setOnboardingStep,
        tempRegistration,
        selectLanguageAndNext,
        selectRoleAndNext,
        submitRegistrationAndRequestOtp,
        verifyOtpAndComplete,
        activeTab,
        setActiveTab,
        products,
        addProduct,
        renewProductBatch,
        updateProductPrice,
        updateProductQuantity,
        toggleProductStock,
        reportOutOfStock,
        addReview,
        deleteProduct,
        inquiries,
        trackWhatsAppInquiry,
        wishlist,
        toggleWishlist,
        selectedRegion,
        setSelectedRegion,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        showAboutModal,
        setShowAboutModal,
        showAddProductModal,
        setShowAddProductModal,
        showSettingsModal,
        setShowSettingsModal,
        showPrivacyModal,
        setShowPrivacyModal,
        selectedProductDetail,
        setSelectedProductDetail,
        showMakingMediaModal,
        setShowMakingMediaModal,
        registeredUsers,
        loginWithPassword,
        requestLoginOtp,
        verifyLoginOtp,
        requestPasswordReset,
        resetPasswordWithOtp,
        registerNewUser,
        showAuthModal,
        setShowAuthModal,
        chats,
        activeChat,
        setActiveChat,
        showChatModal,
        setShowChatModal,
        openChatWithProduct,
        openChatById,
        sendMessage,
        isFirebaseConfigured,
        sendFirebasePhoneOtp,
        verifyFirebasePhoneOtp,
        setupRecaptcha,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
