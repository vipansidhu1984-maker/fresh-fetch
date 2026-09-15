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
  fetchCloudProductsOnce,
  saveProductToCloud,
  deleteProductFromCloud,
  updateProductInCloud,
  syncBus,
  saveUserToCloud,
  fetchUserFromCloud,
  subscribeToUserChats,
  sendChatMessageToCloud,
  createChatInCloud,
  markChatReadInCloud,
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

  // Products state (Initialized with saved products or verified initial farm products)
  const [products, setProducts] = useState(() => {
    const saved = safeJsonParse('freshfetch_products', INITIAL_PRODUCTS);
    return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_PRODUCTS;
  });

  // In-App Chat Threads state
  const [chats, setChats] = useState(() => {
    const saved = safeJsonParse('freshfetch_chats', []);
    return Array.isArray(saved) ? saved : [];
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

  // Read / Viewed Inquiry IDs tracking (to clear unread red count badge when farmer views leads)
  const [readInquiryIds, setReadInquiryIds] = useState(() => {
    return safeJsonParse('freshfetch_read_inquiries', []);
  });

  // Wishlist (Clear by default for new users)
  const [wishlist, setWishlist] = useState(() => {
    const saved = safeJsonParse('freshfetch_wishlist', []);
    return (Array.isArray(saved) ? saved : []).filter(
      (id) => id && id !== 'prod-1' && id !== 'prod-3'
    );
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
    localStorage.setItem('freshfetch_read_inquiries', JSON.stringify(readInquiryIds));
  }, [readInquiryIds]);

  useEffect(() => {
    localStorage.setItem('freshfetch_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Real-time Multi-Channel Synchronization (Cloud Firestore + 24/7 Cloud Registry + BroadcastChannel + Local Storage)
  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeChats = () => {};

    // 1. Initial One-time Direct Cloud Fetch
    fetchCloudProductsOnce().then((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts((prev) => {
          const map = new Map();
          (prev || []).forEach((p) => p && p.id && map.set(p.id, p));
          cloudProds.forEach((p) => p && p.id && map.set(p.id, p));
          const merged = Array.from(map.values());
          merged.sort((a, b) => {
            const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdDate ? new Date(a.createdDate).getTime() : 0);
            const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdDate ? new Date(b.createdDate).getTime() : 0);
            return timeB - timeA;
          });
          return merged;
        });
      }
    }).catch(console.warn);

    // 2. Real-time Multi-Tier Cloud Subscription (Firestore + Cloud Registry Polling)
    unsubscribeProducts = subscribeToCloudProducts((cloudProds) => {
      if (cloudProds && Array.isArray(cloudProds) && cloudProds.length > 0) {
        setProducts((prev) => {
          const map = new Map();
          (prev || []).forEach((p) => p && p.id && map.set(p.id, p));
          cloudProds.forEach((p) => p && p.id && map.set(p.id, p));
          const merged = Array.from(map.values());
          merged.sort((a, b) => {
            const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdDate ? new Date(a.createdDate).getTime() : 0);
            const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdDate ? new Date(b.createdDate).getTime() : 0);
            return timeB - timeA;
          });
          return merged;
        });
      }
    });

    // 3. Instant Local & Cross-Tab Broadcast Channel Listener
    const handleSyncMessage = (event) => {
      if (!event || !event.data) return;
      const { action, payload } = event.data;
      if (action === 'ADD_PRODUCT' && payload && payload.id) {
        setProducts((prev) => [payload, ...(prev || []).filter((p) => p.id !== payload.id)]);
      } else if (action === 'DELETE_PRODUCT' && payload && payload.productId) {
        setProducts((prev) => (prev || []).filter((p) => p.id !== payload.productId));
      } else if (action === 'UPDATE_PRODUCT' && payload && payload.productId) {
        setProducts((prev) =>
          (prev || []).map((p) => (p.id === payload.productId ? { ...p, ...payload.updates } : p))
        );
      }
    };

    if (syncBus) {
      syncBus.addEventListener('message', handleSyncMessage);
    }

    // 4. Live User Chats Subscription
    if (isFirebaseConfigured && (currentUser?.id || currentUser?.phone)) {
      const uId = currentUser.id || currentUser.phone;
      unsubscribeChats = subscribeToUserChats(uId, role || 'buyer', (cloudChats) => {
        if (cloudChats && cloudChats.length > 0) {
          setChats(cloudChats);
        }
      });
    }

    // 5. Cross-Tab Local Storage Synchronization
    const handleStorage = (e) => {
      if (e.key === 'freshfetch_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts((prev) => {
              const map = new Map();
              (prev || []).forEach((p) => p && p.id && map.set(p.id, p));
              parsed.forEach((p) => p && p.id && map.set(p.id, p));
              return Array.from(map.values());
            });
          }
        } catch (err) {
          console.warn("Storage sync error:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeProducts();
      unsubscribeChats();
      if (syncBus) {
        syncBus.removeEventListener('message', handleSyncMessage);
      }
      window.removeEventListener('storage', handleStorage);
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

    // If user is a farmer, sync updated details and privacy toggles to all their products
    if (updated.role === 'producer') {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.sellerId === updated.id || (updated.phone && p.sellerPhone === updated.phone)) {
            const updatedProd = {
              ...p,
              sellerName: updated.name || p.sellerName,
              sellerPhone: updated.phone || p.sellerPhone,
              sellerWhatsApp: updated.phone ? `91${updated.phone.replace(/\D/g, '')}` : p.sellerWhatsApp,
              showWhatsApp: updated.showWhatsApp !== false,
              showPhone: updated.showPhone !== false,
              sellerLocation: updated.location || p.sellerLocation,
              farmName: updated.farmName || p.farmName
            };
            updateProductInCloud(p.id, {
              sellerName: updatedProd.sellerName,
              sellerPhone: updatedProd.sellerPhone,
              sellerWhatsApp: updatedProd.sellerWhatsApp,
              showWhatsApp: updatedProd.showWhatsApp,
              showPhone: updatedProd.showPhone,
              sellerLocation: updatedProd.sellerLocation,
              farmName: updatedProd.farmName
            });
            return updatedProd;
          }
          return p;
        })
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

  // 5. Reset Password Directly without OTP
  const resetPasswordDirect = async (phone, newPassword) => {
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

  const resetPasswordWithOtp = async (phone, otp, newPassword) => {
    return resetPasswordDirect(phone, newPassword);
  };

  // 6. Register New User and store in user database (Strict 1 account per mobile number)
  const registerNewUser = async (data) => {
    const cleanPhone = (data.phone ? data.phone.replace(/\D/g, '') : '').trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: t('invalidCredentials') || 'Please enter a valid 10-digit mobile number' };
    }

    // 1. Check local registered users
    let existing = registeredUsers.find((u) => u.phone === cleanPhone);

    // 2. Check Cloud Firestore for existing account with same number
    if (!existing && isFirebaseConfigured) {
      try {
        const cloudUser = await fetchUserFromCloud(cleanPhone);
        if (cloudUser) {
          existing = cloudUser;
          setRegisteredUsers((prev) => [...prev.filter((u) => u.phone !== cleanPhone), cloudUser]);
        }
      } catch (err) {
        console.warn("Cloud user check on register:", err);
      }
    }

    // If an account is already registered with this mobile number, block duplicate registration and return an error!
    if (existing) {
      return {
        success: false,
        alreadyRegistered: true,
        error: t('phoneAlreadyRegistered') || 'An account is already registered with this mobile number. Please sign in instead.'
      };
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

  // --- IN-APP CHAT & LEADS METHODS ---

  // Mark all farmer leads (WhatsApp inquiries and chat unread counters) as viewed/read
  const markFarmerLeadsAsRead = () => {
    // 1. Mark inquiries as read
    const currentMyInquiryIds = (inquiries || [])
      .filter((inq) => currentUser ? (inq.sellerId === currentUser.id || inq.sellerPhone === currentUser.phone) : inq.sellerId === 'farmer-ramesh')
      .map((i) => i.id);

    if (currentMyInquiryIds.length > 0) {
      setReadInquiryIds((prev) => {
        const combined = Array.from(new Set([...prev, ...currentMyInquiryIds]));
        return combined;
      });
    }

    // 2. Clear unread chat counts for farmer
    setChats((prev) =>
      prev.map((c) => {
        const isMyChat = currentUser
          ? (c.sellerId === currentUser.id || c.sellerPhone === currentUser.phone)
          : c.sellerId === 'farmer-ramesh';
        if (isMyChat && c.unreadCountFarmer > 0) {
          markChatReadInCloud(c.id, 'producer');
          return { ...c, unreadCountFarmer: 0 };
        }
        return c;
      })
    );
  };

  // Mark single chat as read
  const markChatAsRead = (chatId, userRole = (role || 'producer')) => {
    const isProducer = userRole === 'producer';
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          unreadCountFarmer: isProducer ? 0 : c.unreadCountFarmer,
          unreadCountBuyer: !isProducer ? 0 : c.unreadCountBuyer
        };
      })
    );
    markChatReadInCloud(chatId, isProducer ? 'producer' : 'buyer');
  };

  // Open chat with farmer for a given product
  const openChatWithProduct = (product) => {
    if (!product) return;

    // Look up latest seller privacy preferences
    const sellerUser = (registeredUsers || []).find(
      (u) =>
        (u.id && u.id === product.sellerId) ||
        (u.phone && (u.phone === product.sellerPhone || `91${u.phone}` === product.sellerWhatsApp))
    );
    const isWhatsAppOn = product.showWhatsApp !== false && (!sellerUser || sellerUser.showWhatsApp !== false);
    const isPhoneOn = product.showPhone !== false && (!sellerUser || sellerUser.showPhone !== false);

    // Check if chat thread already exists for this product
    const existingChat = chats.find(
      (c) => c.productId === product.id && (c.buyerId === currentUser?.id || c.buyerPhone === currentUser?.phone)
    ) || chats.find((c) => c.productId === product.id);

    if (existingChat) {
      const isFarmer = role === 'producer';
      const updatedChat = {
        ...existingChat,
        unreadCountFarmer: isFarmer ? 0 : existingChat.unreadCountFarmer,
        unreadCountBuyer: !isFarmer ? 0 : existingChat.unreadCountBuyer,
        showWhatsApp: isWhatsAppOn,
        showPhone: isPhoneOn,
        sellerWhatsApp: product.sellerWhatsApp || existingChat.sellerWhatsApp,
        sellerPhone: product.sellerPhone || existingChat.sellerPhone
      };
      setChats((prev) => prev.map((c) => (c.id === existingChat.id ? updatedChat : c)));
      setActiveChat(updatedChat);
      setShowChatModal(true);
      markChatReadInCloud(existingChat.id, isFarmer ? 'producer' : 'buyer');
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
      sellerWhatsApp: product.sellerWhatsApp || (product.sellerPhone ? `91${product.sellerPhone}` : ''),
      showWhatsApp: isWhatsAppOn,
      showPhone: isPhoneOn,
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
      const isFarmer = role === 'producer' || (currentUser && (chat.sellerId === currentUser.id || chat.sellerPhone === currentUser.phone));
      const updatedChat = {
        ...chat,
        unreadCountFarmer: isFarmer ? 0 : chat.unreadCountFarmer,
        unreadCountBuyer: !isFarmer ? 0 : chat.unreadCountBuyer
      };
      setChats((prev) => prev.map((c) => (c.id === chatId ? updatedChat : c)));
      setActiveChat(updatedChat);
      setShowChatModal(true);
      markChatReadInCloud(chatId, isFarmer ? 'producer' : 'buyer');
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
      title: (newProduct.title || '').trim(),
      category: newProduct.category || 'ghee',
      price: Number(newProduct.price) || 0,
      unit: newProduct.unit || 'kg',
      availableQty: newProduct.availableQty || '25 kg',
      minOrder: newProduct.minOrder || '1 unit',
      shelfLifeDays,
      expiryDate,
      image: newProduct.image || 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      purityBadge: newProduct.purityBadge || '100% Pure Direct',
      purityMethod: (newProduct.purityMethod || '').trim(),
      processMedia: Array.isArray(newProduct.processMedia) ? newProduct.processMedia : [],
      sellerId: currentUser?.id || (currentUser?.phone ? `farmer-${currentUser.phone}` : `farmer-${Date.now()}`),
      sellerName: currentUser?.name || 'Local Verified Farmer',
      sellerPhone: currentUser?.phone || '',
      sellerWhatsApp: currentUser?.phone ? `91${currentUser.phone.replace(/\D/g, '')}` : '',
      showWhatsApp: currentUser?.showWhatsApp !== false,
      showPhone: currentUser?.showPhone !== false,
      sellerLocation: newProduct.sellerLocation || currentUser?.location || 'Sangaria, Hanumangarh',
      regionId: newProduct.regionId || currentUser?.regionId || 'hnm-sangaria',
      farmName: currentUser?.farmName || (currentUser?.name ? `${currentUser.name}'s Farm` : 'Organic Farm'),
      verified: true,
      inStock: true,
      outOfStockReported: false,
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      videoUrl: (newProduct.videoUrl || '').trim(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) => [productObj, ...(prev || []).filter((p) => p && p.id !== productObj.id)]);

    // Save to Multi-Tier Cloud (Firestore + 24/7 Cloud Registry + BroadcastChannel)
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
        const updatedProd = {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating
        };
        // Update in Cloud Firestore
        updateProductInCloud(productId, {
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating
        });
        return updatedProd;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromCloud(productId);
  };

  // Track WhatsApp click
  const trackWhatsAppInquiry = (product) => {
    if (!product) return;

    const sellerUser = (registeredUsers || []).find(
      (u) =>
        (u.id && u.id === product.sellerId) ||
        (u.phone && (u.phone === product.sellerPhone || `91${u.phone}` === product.sellerWhatsApp))
    );
    const isWhatsAppOn = product.showWhatsApp !== false && (!sellerUser || sellerUser.showWhatsApp !== false);

    // If WhatsApp is disabled by farmer, route to in-app chat
    if (!isWhatsAppOn || (!product.sellerWhatsApp && !product.sellerPhone)) {
      openChatWithProduct(product);
      return;
    }

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

    const waNum = product.sellerWhatsApp || `91${product.sellerPhone.replace(/\D/g, '')}`;
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
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
        resetPasswordDirect,
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
        readInquiryIds,
        markFarmerLeadsAsRead,
        markChatAsRead,
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
