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
  subscribeToCloudDeletedProducts,
  fetchCloudDeletedProductsOnce,
  saveProductToCloud,
  deleteProductFromCloud,
  updateProductInCloud,
  updateProductsBulkInCloud,
  syncBus,
  saveUserToCloud,
  fetchUserFromCloud,
  subscribeToCloudUsers,
  subscribeToUserChats,
  sendChatMessageToCloud,
  createChatInCloud,
  markChatReadInCloud,
  deleteChatMessageFromCloud,
  saveInquiryToCloud,
  sendFirebasePhoneOtp,
  verifyFirebasePhoneOtp,
  setupRecaptcha
} from '../services/firebase';
import { maskPhoneNumber } from '../utils/maskUtils';

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

  const FAKE_PRODUCT_IDS = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'];

  // Deleted Product IDs tracking (to permanently prevent deleted listings from returning)
  const [deletedProductIds, setDeletedProductIds] = useState(() => {
    return safeJsonParse('freshfetch_deleted_products', []);
  });

  const isRealProduct = (p) => {
    if (!p || !p.id) return false;
    const strId = String(p.id);
    if (FAKE_PRODUCT_IDS.includes(strId)) return false;
    if (p.isDeleted === true || p.status === 'deleted') return false;
    if ((deletedProductIds || []).map(String).includes(strId)) return false;
    try {
      const localDel = safeJsonParse('freshfetch_deleted_products', []);
      if (Array.isArray(localDel) && localDel.map(String).includes(strId)) return false;
    } catch {
      // Ignore
    }
    return true;
  };

  // Products state (Strictly Real farmer listings only - Zero fake/dummy listings)
  const [products, setProducts] = useState(() => {
    const saved = safeJsonParse('freshfetch_products', []);
    const deletedIds = safeJsonParse('freshfetch_deleted_products', []);
    const strDeleted = (deletedIds || []).map(String);
    return (Array.isArray(saved) ? saved : []).filter(
      (p) => p && p.id && !FAKE_PRODUCT_IDS.includes(String(p.id)) && !strDeleted.includes(String(p.id)) && !p.isDeleted && p.status !== 'deleted'
    );
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

  // PWA Installation & Promotion state
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                             window.navigator.standalone === true ||
                             document.referrer.includes('android-app://') ||
                             localStorage.getItem('freshfetch_pwa_installed') === 'true';
        return !!isStandalone;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [showInstallModal, setShowInstallModal] = useState(false);

  // PWA Install Prompt Listener
  useEffect(() => {
    // Check display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsAppInstalled(true);
        setShowInstallModal(false);
      }
    };
    try {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    } catch {
      // Ignore older browser compatibility
    }

    // Capture beforeinstallprompt event (Chrome, Edge, Samsung Internet, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      const dismissed = sessionStorage.getItem('freshfetch_pwa_dismissed');
      if (!isStandalone && !dismissed) {
        setTimeout(() => {
          setShowInstallModal(true);
        }, 1200);
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallModal(false);
      setDeferredInstallPrompt(null);
      localStorage.setItem('freshfetch_pwa_installed', 'true');
      console.log('🌱 Fresh Fetch PWA Installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // If on iOS or mobile browser where beforeinstallprompt might not fire, also auto-show modal once per session
    const isStandalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
    const dismissed = sessionStorage.getItem('freshfetch_pwa_dismissed');
    if (!isStandalone && !dismissed) {
      const timer = setTimeout(() => {
        setShowInstallModal(true);
      }, 1800);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        try {
          mediaQuery.removeEventListener('change', handleDisplayModeChange);
        } catch {}
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      try {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      } catch {}
    };
  }, []);

  const installPWA = async () => {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          setShowInstallModal(false);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
        setDeferredInstallPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else {
      // For iOS or browsers without native prompt, guide remains visible in modal
      console.log('No deferred prompt available, showing instructions');
    }
  };


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
    localStorage.setItem('freshfetch_deleted_products', JSON.stringify(deletedProductIds));
  }, [deletedProductIds]);

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
    const cleanProds = (products || []).filter(isRealProduct);
    localStorage.setItem('freshfetch_products', JSON.stringify(cleanProds));
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

  // Real-time Multi-Channel Synchronization (Cloud Firestore + BroadcastChannel + Local Storage)
  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeDeleted = () => {};
    let unsubscribeChats = () => {};
    let unsubscribeUsers = () => {};

    // 1. Initial One-time Direct Cloud Fetch
    fetchCloudDeletedProductsOnce().then((cloudDeletedIds) => {
      if (cloudDeletedIds && Array.isArray(cloudDeletedIds) && cloudDeletedIds.length > 0) {
        setDeletedProductIds((prev) => {
          const merged = Array.from(new Set([...(prev || []).map(String), ...cloudDeletedIds.map(String)]));
          localStorage.setItem('freshfetch_deleted_products', JSON.stringify(merged));
          return merged;
        });
      }
    }).catch(console.warn);

    fetchCloudProductsOnce().then((cloudProds) => {
      if (cloudProds && Array.isArray(cloudProds)) {
        const localDeleted = safeJsonParse('freshfetch_deleted_products', []);
        const strDeleted = (localDeleted || []).map(String);
        const validCloud = cloudProds.filter(
          (p) => p && p.id && !FAKE_PRODUCT_IDS.includes(String(p.id)) && !strDeleted.includes(String(p.id)) && !p.isDeleted && p.status !== 'deleted'
        );
        if (cloudProds.length > 0 || (isFirebaseConfigured && Array.isArray(cloudProds))) {
          setProducts(validCloud);
        } else {
          setProducts((prev) =>
            (prev || []).filter(
              (p) => p && p.id && !FAKE_PRODUCT_IDS.includes(String(p.id)) && !strDeleted.includes(String(p.id)) && !p.isDeleted && p.status !== 'deleted'
            )
          );
        }
      }
    }).catch(console.warn);

    // 2. Real-time Multi-Tier Cloud Subscription for Products
    unsubscribeProducts = subscribeToCloudProducts((cloudProds) => {
      if (cloudProds && Array.isArray(cloudProds)) {
        const localDeleted = safeJsonParse('freshfetch_deleted_products', []);
        const strDeleted = (localDeleted || []).map(String);
        const validCloud = cloudProds.filter(
          (p) => p && p.id && !FAKE_PRODUCT_IDS.includes(String(p.id)) && !strDeleted.includes(String(p.id)) && !p.isDeleted && p.status !== 'deleted'
        );
        setProducts(validCloud);
      }
    });

    // 3. Real-time Multi-Tier Cloud Subscription for Deleted Products
    unsubscribeDeleted = subscribeToCloudDeletedProducts((cloudDeletedIds) => {
      if (cloudDeletedIds && Array.isArray(cloudDeletedIds) && cloudDeletedIds.length > 0) {
        const strDeleted = cloudDeletedIds.map(String);
        setDeletedProductIds((prev) => {
          const merged = Array.from(new Set([...(prev || []).map(String), ...strDeleted]));
          localStorage.setItem('freshfetch_deleted_products', JSON.stringify(merged));
          return merged;
        });
        setProducts((prev) => (prev || []).filter((p) => p && !strDeleted.includes(String(p.id))));
        setWishlist((prev) => (prev || []).filter((id) => !strDeleted.includes(String(id))));
      }
    });

    // 4. Real-time User Profiles & Privacy Live Sync (Firestore)
    if (isFirebaseConfigured) {
      unsubscribeUsers = subscribeToCloudUsers((cloudUsers) => {
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          setRegisteredUsers((prev) => {
            const map = new Map();
            (prev || []).forEach((u) => map.set(u.id || u.phone, u));
            cloudUsers.forEach((u) => map.set(u.id || u.phone, { ...map.get(u.id || u.phone), ...u }));
            return Array.from(map.values());
          });
        }
      });
    }

    // 5. Instant Local & Cross-Tab Broadcast Channel Listener
    const handleSyncMessage = (event) => {
      if (!event || !event.data) return;
      const { action, payload } = event.data;
      if (action === 'ADD_PRODUCT' && isRealProduct(payload)) {
        setProducts((prev) => [payload, ...(prev || []).filter((p) => isRealProduct(p) && String(p.id) !== String(payload.id))]);
      } else if (action === 'DELETE_PRODUCT' && payload && payload.productId) {
        const delId = String(payload.productId);
        const existingDeleted = safeJsonParse('freshfetch_deleted_products', []);
        const updatedDeleted = Array.from(new Set([...(existingDeleted || []).map(String), delId]));
        localStorage.setItem('freshfetch_deleted_products', JSON.stringify(updatedDeleted));

        setDeletedProductIds(updatedDeleted);
        setProducts((prev) => (prev || []).filter((p) => p && String(p.id) !== delId));
        setWishlist((prev) => (prev || []).filter((id) => String(id) !== delId));
        setSelectedProductDetail((curr) => (curr && String(curr.id) === delId ? null : curr));
        setShowMakingMediaModal((curr) => (curr && String(curr.id) === delId ? null : curr));
      } else if (action === 'UPDATE_PRODUCT' && payload && payload.productId) {
        setProducts((prev) =>
          (prev || []).map((p) => (String(p.id) === String(payload.productId) ? { ...p, ...payload.updates } : p))
        );
      } else if (action === 'UPDATE_PRODUCTS_BULK' && payload && payload.farmerPhone && payload.updates) {
        const { farmerPhone, updates } = payload;
        const cleanPhone = String(farmerPhone).replace(/\D/g, '').slice(-10);
        setProducts((prev) =>
          (prev || []).map((p) => {
            if (!p) return p;
            const pPhone = p.sellerPhone ? String(p.sellerPhone).replace(/\D/g, '').slice(-10) : '';
            const isMatch = p.sellerPhone === farmerPhone || pPhone === cleanPhone || p.sellerId === farmerPhone;
            return isMatch ? { ...p, ...updates } : p;
          })
        );
      } else if (action === 'UPDATE_USER' && payload && payload.user) {
        setRegisteredUsers((prev) => {
          const map = new Map();
          (prev || []).forEach((u) => map.set(u.id || u.phone, u));
          map.set(payload.user.id || payload.user.phone, payload.user);
          return Array.from(map.values());
        });
      } else if (action === 'CREATE_CHAT' && payload && payload.id) {
        setChats((prev) => {
          if ((prev || []).some((c) => c.id === payload.id)) {
            return prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c));
          }
          return [payload, ...(prev || [])];
        });
      } else if (action === 'SEND_MESSAGE' && payload && payload.chatId && payload.message) {
        const { chatId, message, chatContext } = payload;
        const isBuyerMsg = message.senderRole === 'buyer';
        setChats((prev) => {
          const chatIndex = (prev || []).findIndex((c) => c.id === chatId);
          if (chatIndex >= 0) {
            const currentChat = prev[chatIndex];
            const isMsgAlready = (currentChat.messages || []).some((m) => m.id === message.id);
            const updatedMessages = isMsgAlready ? currentChat.messages : [...(currentChat.messages || []), message];
            const updatedChat = {
              ...currentChat,
              ...(chatContext || {}),
              lastMessage: message.text,
              lastMessageTime: message.time || currentChat.lastMessageTime,
              unreadCountFarmer: isBuyerMsg ? (Number(currentChat.unreadCountFarmer || 0) + 1) : currentChat.unreadCountFarmer,
              unreadCountBuyer: !isBuyerMsg ? (Number(currentChat.unreadCountBuyer || 0) + 1) : currentChat.unreadCountBuyer,
              messages: updatedMessages
            };
            const copy = [...prev];
            copy[chatIndex] = updatedChat;
            return copy;
          } else if (chatContext) {
            return [{
              ...chatContext,
              lastMessage: message.text,
              lastMessageTime: message.time,
              unreadCountFarmer: isBuyerMsg ? 1 : 0,
              unreadCountBuyer: !isBuyerMsg ? 1 : 0,
              messages: [message]
            }, ...(prev || [])];
          }
          return prev;
        });
        setActiveChat((curr) => {
          if (!curr || curr.id !== chatId) return curr;
          const isMsgAlready = (curr.messages || []).some((m) => m.id === message.id);
          return {
            ...curr,
            lastMessage: message.text,
            lastMessageTime: message.time || curr.lastMessageTime,
            messages: isMsgAlready ? curr.messages : [...(curr.messages || []), message]
          };
        });
      } else if (action === 'DELETE_MESSAGE' && payload && payload.chatId && payload.messageId) {
        const { chatId, messageId } = payload;
        setChats((prev) =>
          (prev || []).map((c) => {
            if (c.id !== chatId) return c;
            const updatedMsgs = (c.messages || []).filter((m) => m && m.id !== messageId);
            const lastMsg = updatedMsgs.length > 0 ? updatedMsgs[updatedMsgs.length - 1] : null;
            return {
              ...c,
              messages: updatedMsgs,
              lastMessage: lastMsg ? lastMsg.text : '',
              lastMessageTime: lastMsg ? (lastMsg.time || '') : ''
            };
          })
        );
        setActiveChat((curr) => {
          if (!curr || curr.id !== chatId) return curr;
          const updatedMsgs = (curr.messages || []).filter((m) => m && m.id !== messageId);
          const lastMsg = updatedMsgs.length > 0 ? updatedMsgs[updatedMsgs.length - 1] : null;
          return {
            ...curr,
            messages: updatedMsgs,
            lastMessage: lastMsg ? lastMsg.text : '',
            lastMessageTime: lastMsg ? (lastMsg.time || '') : ''
          };
        });
      } else if (action === 'MARK_CHAT_READ' && payload && payload.chatId) {
        const { chatId, role: readerRole } = payload;
        const isFarmer = readerRole === 'producer';
        setChats((prev) =>
          (prev || []).map((c) => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              unreadCountFarmer: isFarmer ? 0 : c.unreadCountFarmer,
              unreadCountBuyer: !isFarmer ? 0 : c.unreadCountBuyer
            };
          })
        );
        setActiveChat((curr) => {
          if (!curr || curr.id !== chatId) return curr;
          return {
            ...curr,
            unreadCountFarmer: isFarmer ? 0 : curr.unreadCountFarmer,
            unreadCountBuyer: !isFarmer ? 0 : curr.unreadCountBuyer
          };
        });
      }
    };

    if (syncBus) {
      syncBus.addEventListener('message', handleSyncMessage);
    }

    // 6. Live User Chats Subscription
    if (isFirebaseConfigured && (currentUser?.id || currentUser?.phone)) {
      unsubscribeChats = subscribeToUserChats(currentUser, role || 'buyer', (cloudChats) => {
        if (cloudChats && Array.isArray(cloudChats)) {
          setChats((prev) => {
            const map = new Map();
            (prev || []).forEach((c) => map.set(c.id, c));
            cloudChats.forEach((c) => map.set(c.id, c));
            return Array.from(map.values()).sort((a, b) => {
              const timeA = a.lastMessageTimestamp?.seconds ? a.lastMessageTimestamp.seconds * 1000 : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
              const timeB = b.lastMessageTimestamp?.seconds ? b.lastMessageTimestamp.seconds * 1000 : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
              return timeB - timeA;
            });
          });
          setActiveChat((currActive) => {
            if (!currActive) return currActive;
            const updated = cloudChats.find((c) => c.id === currActive.id);
            return updated || currActive;
          });
        }
      });
    }

    // 7. Cross-Tab Local Storage Synchronization
    const handleStorage = (e) => {
      if (e.key === 'freshfetch_deleted_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const strParsed = parsed.map(String);
            setDeletedProductIds(strParsed);
            setProducts((prev) => (prev || []).filter((p) => p && !strParsed.includes(String(p.id))));
            setWishlist((prev) => (prev || []).filter((id) => !strParsed.includes(String(id))));
          }
        } catch (err) {
          console.warn("Storage sync error for deleted products:", err);
        }
      }
      if (e.key === 'freshfetch_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const localDeleted = safeJsonParse('freshfetch_deleted_products', []);
            const strDeleted = (localDeleted || []).map(String);
            const valid = parsed.filter(
              (p) => p && p.id && !FAKE_PRODUCT_IDS.includes(String(p.id)) && !strDeleted.includes(String(p.id)) && !p.isDeleted && p.status !== 'deleted'
            );
            setProducts(valid);
          }
        } catch (err) {
          console.warn("Storage sync error:", err);
        }
      }
      if (e.key === 'freshfetch_chats' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setChats(parsed);
          }
        } catch (err) {
          console.warn("Storage sync error for chats:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeProducts();
      unsubscribeDeleted();
      unsubscribeUsers();
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

  // Update User Profile (Details, Avatar, and Privacy Toggles)
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

    // If user is a farmer, sync updated details, photo, and privacy toggles to all their products in state and cloud
    if (updated.role === 'producer') {
      const productBulkUpdates = {
        sellerAvatar: updated.avatar || '',
        sellerName: updated.name || '',
        sellerPhone: updated.phone || '',
        sellerWhatsApp: updated.phone ? `91${updated.phone.replace(/\D/g, '')}` : '',
        showWhatsApp: updated.showWhatsApp !== false,
        showPhone: updated.showPhone !== false,
        sellerLocation: updated.location || '',
        farmName: updated.farmName || ''
      };

      setProducts((prev) =>
        (prev || []).map((p) => {
          const pPhone = p.sellerPhone ? String(p.sellerPhone).replace(/\D/g, '').slice(-10) : '';
          const uPhone = updated.phone ? String(updated.phone).replace(/\D/g, '').slice(-10) : '';
          if (p.sellerId === updated.id || (uPhone && pPhone === uPhone)) {
            return {
              ...p,
              ...productBulkUpdates
            };
          }
          return p;
        })
      );

      // Save bulk product update to Cloud Firestore
      updateProductsBulkInCloud(updated.phone || updated.id, productBulkUpdates);
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

  // 4. Verify User Identity for Secure Password Reset (Zero-Cost, Full Name & DOB Authentication)
  const verifyUserIdentityForReset = async (phone, fullName, dob) => {
    const cleanPhone = (phone ? String(phone).replace(/\D/g, '') : '').trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: t('userNotFound') || 'Please enter a valid 10-digit mobile number' };
    }

    let user = registeredUsers.find((u) => u.phone === cleanPhone);

    if (!user && isFirebaseConfigured) {
      try {
        const cloudUser = await fetchUserFromCloud(cleanPhone);
        if (cloudUser) {
          user = cloudUser;
          setRegisteredUsers((prev) => [...prev.filter((u) => u.phone !== cleanPhone), cloudUser]);
        }
      } catch (err) {
        console.warn("Cloud user fetch on identity verify:", err);
      }
    }

    if (!user) {
      return {
        success: false,
        error: t('userNotFound') || 'No account found with this mobile number. Please create an account.'
      };
    }

    // Normalize and compare Full Name and Date of Birth
    const enteredName = (fullName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const registeredName = (user.name || '').trim().toLowerCase().replace(/\s+/g, ' ');

    const enteredDob = (dob || '').trim();
    const registeredDob = (user.dob || '').trim();

    // Flexible name matching (exact match, contains first name, or contains full name)
    const nameMatches = Boolean(
      enteredName &&
      registeredName &&
      (enteredName === registeredName ||
       registeredName.includes(enteredName) ||
       enteredName.includes(registeredName) ||
       enteredName.split(' ')[0] === registeredName.split(' ')[0])
    );

    // Date of Birth match
    const dobMatches = Boolean(
      !registeredDob ||
      enteredDob === registeredDob ||
      enteredDob.replace(/\D/g, '') === registeredDob.replace(/\D/g, '')
    );

    if (!nameMatches || !dobMatches) {
      return {
        success: false,
        error: t('verificationFailed') || 'Verification failed. The Full Name or Date of Birth does not match the account registered with this mobile number.'
      };
    }

    return {
      success: true,
      user,
      message: t('identityVerifiedSuccess') || 'Identity verified successfully! Please set your new password.'
    };
  };

  // 5. Reset Password Directly after Identity Verification
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
      return {
        success: false,
        error: t('userNotFound') || 'No account found with this mobile number.'
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

    const buyerId = currentUser?.id || (currentUser?.phone ? `buyer-${currentUser.phone}` : `guest-${Date.now()}`);
    const buyerPhone = currentUser?.phone || '';
    const buyerName = currentUser?.name || (role === 'producer' ? 'Farmer' : 'Customer');

    // Check if chat thread already exists for this product
    const existingChat = chats.find(
      (c) => c.productId === product.id && ((currentUser && c.buyerId === currentUser.id) || (currentUser?.phone && c.buyerPhone === currentUser.phone))
    ) || chats.find((c) => c.productId === product.id && c.buyerPhone === buyerPhone);

    if (existingChat) {
      const isFarmer = role === 'producer' || Boolean(
        currentUser && (
          (existingChat.sellerId && existingChat.sellerId === currentUser.id) ||
          (existingChat.sellerPhone && existingChat.sellerPhone === currentUser.phone)
        )
      );
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

    // Create fresh genuine chat thread (starts clean with no fake messages)
    const newChat = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
      buyerId,
      buyerName,
      buyerPhone,
      unreadCountFarmer: 0,
      unreadCountBuyer: 0,
      lastMessage: '',
      lastMessageTime: '',
      messages: []
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
      const isFarmer = role === 'producer' || Boolean(
        currentUser && (
          (chat.sellerId && chat.sellerId === currentUser.id) ||
          (chat.sellerPhone && chat.sellerPhone === currentUser.phone)
        )
      );
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

  // Send a genuine message inside chat thread (No fake auto-replies)
  const sendMessage = (chatId, text, senderRole = (role || 'buyer')) => {
    if (!text || !text.trim() || !chatId) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isFarmer = senderRole === 'producer' || Boolean(
      currentUser && (
        (activeChat?.sellerId && activeChat.sellerId === currentUser.id) ||
        (activeChat?.sellerPhone && activeChat.sellerPhone === currentUser.phone)
      )
    );
    const effectiveSenderRole = isFarmer ? 'producer' : 'buyer';
    const senderName = currentUser?.name || (effectiveSenderRole === 'producer' ? (activeChat?.sellerName?.split('(')[0]?.trim() || 'Farmer') : 'Customer');

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderRole: effectiveSenderRole,
      senderName,
      text: text.trim(),
      time: timeStr,
      status: 'sent'
    };

    let targetChat = null;

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const isBuyerMsg = effectiveSenderRole === 'buyer';
        const updated = {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: timeStr,
          unreadCountFarmer: isBuyerMsg ? (Number(c.unreadCountFarmer || 0) + 1) : c.unreadCountFarmer,
          unreadCountBuyer: !isBuyerMsg ? (Number(c.unreadCountBuyer || 0) + 1) : c.unreadCountBuyer,
          messages: [...(c.messages || []), newMsg]
        };
        targetChat = updated;
        return updated;
      })
    );

    setActiveChat((prev) => {
      if (!prev || prev.id !== chatId) return prev;
      return {
        ...prev,
        lastMessage: text.trim(),
        lastMessageTime: timeStr,
        messages: [...(prev.messages || []), newMsg]
      };
    });

    // Send to Cloud Firestore for real-time multi-device sync
    const chatContext = targetChat || activeChat;
    sendChatMessageToCloud(chatId, newMsg, chatContext);
  };

  // Delete an individual chat message in real time across Firestore and open tabs
  const deleteChatMessage = (chatId, messageId) => {
    if (!chatId || !messageId) return;

    setChats((prev) =>
      (prev || []).map((c) => {
        if (c.id !== chatId) return c;
        const updatedMsgs = (c.messages || []).filter((m) => m && m.id !== messageId);
        const lastMsg = updatedMsgs.length > 0 ? updatedMsgs[updatedMsgs.length - 1] : null;
        return {
          ...c,
          messages: updatedMsgs,
          lastMessage: lastMsg ? lastMsg.text : '',
          lastMessageTime: lastMsg ? (lastMsg.time || '') : ''
        };
      })
    );

    setActiveChat((curr) => {
      if (!curr || curr.id !== chatId) return curr;
      const updatedMsgs = (curr.messages || []).filter((m) => m && m.id !== messageId);
      const lastMsg = updatedMsgs.length > 0 ? updatedMsgs[updatedMsgs.length - 1] : null;
      return {
        ...curr,
        messages: updatedMsgs,
        lastMessage: lastMsg ? lastMsg.text : '',
        lastMessageTime: lastMsg ? (lastMsg.time || '') : ''
      };
    });

    // Delete in Cloud Firestore and broadcast
    deleteChatMessageFromCloud(chatId, messageId);
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
      sellerAvatar: currentUser?.avatar || '',
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

    setDeletedProductIds((prev) => {
      const updated = prev.filter((id) => id !== productObj.id);
      localStorage.setItem('freshfetch_deleted_products', JSON.stringify(updated));
      return updated;
    });
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
    if (!productId) return;
    const strId = String(productId);

    // 1. Immediately update localStorage synchronously
    const existingDeleted = safeJsonParse('freshfetch_deleted_products', []);
    const updatedDeleted = Array.from(new Set([...(existingDeleted || []).map(String), strId]));
    localStorage.setItem('freshfetch_deleted_products', JSON.stringify(updatedDeleted));

    const existingProducts = safeJsonParse('freshfetch_products', []);
    const updatedProducts = (existingProducts || []).filter((p) => p && String(p.id) !== strId);
    localStorage.setItem('freshfetch_products', JSON.stringify(updatedProducts));

    const existingWishlist = safeJsonParse('freshfetch_wishlist', []);
    const updatedWishlist = (existingWishlist || []).filter((id) => String(id) !== strId);
    localStorage.setItem('freshfetch_wishlist', JSON.stringify(updatedWishlist));

    // 2. Update React State
    setDeletedProductIds(updatedDeleted);
    setProducts((prev) => (prev || []).filter((p) => p && String(p.id) !== strId));
    setWishlist((prev) => (prev || []).filter((id) => String(id) !== strId));
    setSelectedProductDetail((curr) => (curr && String(curr.id) === strId ? null : curr));
    setShowMakingMediaModal((curr) => (curr && String(curr.id) === strId ? null : curr));

    // 3. Delete from Multi-Tier Cloud (Firestore + BroadcastChannel)
    deleteProductFromCloud(strId);
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
        verifyUserIdentityForReset,
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
        deleteChatMessage,
        maskPhoneNumber,
        readInquiryIds,
        markFarmerLeadsAsRead,
        markChatAsRead,
        isFirebaseConfigured,
        sendFirebasePhoneOtp,
        verifyFirebasePhoneOtp,
        setupRecaptcha,
        deferredInstallPrompt,
        isAppInstalled,
        showInstallModal,
        setShowInstallModal,
        installPWA,
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
