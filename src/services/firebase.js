import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

// 1. Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase keys are configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your_api_key_here"
);

// 2. Initialize Firebase instances (only if configured)
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🌿 Fresh Fetch: Cloud Firebase & Firestore Connected Successfully!");
  } catch (error) {
    console.warn("⚠️ Fresh Fetch: Firebase initialization error, falling back to local mode:", error);
  }
} else {
  console.log("ℹ️ Fresh Fetch: Running in Local/Offline Hybrid Mode (No Firebase keys set yet).");
}

export { auth, db };

// ============================================================================
// 3. PHONE AUTHENTICATION (Real Cellular SMS OTP via Google)
// ============================================================================

/**
 * Initializes invisible or visible reCAPTCHA on a DOM element
 */
export function setupRecaptcha(containerId = 'recaptcha-container') {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired. Please try again.");
      }
    });
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error creating RecaptchaVerifier:", error);
    return null;
  }
}

/**
 * Sends a real SMS OTP to the given phone number (+91 formatted)
 */
export async function sendFirebasePhoneOtp(phone) {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, simulated: true, otp: "4821" };
  }

  try {
    // Format to standard international +91
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    let verifier = window.recaptchaVerifier;
    if (!verifier) {
      verifier = setupRecaptcha('recaptcha-container');
    }

    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult, phone: formattedPhone };
  } catch (error) {
    console.error("Firebase sendPhoneOtp error:", error);
    return { success: false, error: error.message || "Failed to send SMS OTP" };
  }
}

/**
 * Verifies the SMS OTP code entered by the user
 */
export async function verifyFirebasePhoneOtp(otpCode) {
  if (!isFirebaseConfigured || !window.confirmationResult) {
    if (otpCode === '4821' || otpCode === '1234') {
      return { success: true, simulated: true };
    }
    return { success: false, error: "Invalid OTP" };
  }

  try {
    const result = await window.confirmationResult.confirm(otpCode);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Firebase verifyPhoneOtp error:", error);
    return { success: false, error: error.message || "Invalid OTP code" };
  }
}

// ============================================================================
// 4. CLOUD FIRESTORE: LIVE PRODUCTS DATABASE
// ============================================================================

/**
 * Real-time subscription to Products collection
 */
export function subscribeToCloudProducts(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(products);
    }, (err) => {
      console.warn("Firestore products sync listener warning:", err);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn("Failed to subscribe to cloud products:", err);
    return () => {};
  }
}

/**
 * Save / Create a new product in Firestore
 */
export async function saveProductToCloud(product) {
  if (!isFirebaseConfigured || !db) return { success: false, offline: true };

  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
      createdAt: product.createdAt || serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error("Error saving product to Firestore:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromCloud(productId) {
  if (!isFirebaseConfigured || !db) return { success: false, offline: true };

  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (err) {
    console.error("Error deleting product from Firestore:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Update product fields (price, stock, availability)
 */
export async function updateProductInCloud(productId, updates) {
  if (!isFirebaseConfigured || !db) return { success: false, offline: true };

  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (err) {
    console.error("Error updating product in Firestore:", err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// 5. CLOUD FIRESTORE: REAL-TIME IN-APP CHATS & MESSAGES
// ============================================================================

/**
 * Subscribe to all chat threads where current user is buyer or seller
 */
export function subscribeToUserChats(userId, userRole, onUpdate) {
  if (!isFirebaseConfigured || !db || !userId) return () => {};

  try {
    const field = userRole === 'producer' ? 'sellerId' : 'buyerId';
    const q = query(
      collection(db, 'chats'),
      where(field, '==', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(chats);
    }, (err) => {
      console.warn("Chats subscription listener warning:", err);
    });
  } catch (err) {
    console.warn("Failed to subscribe to user chats:", err);
    return () => {};
  }
}

/**
 * Real-time listener for messages in a specific chat
 */
export function subscribeToChatMessages(chatId, onUpdate) {
  if (!isFirebaseConfigured || !db || !chatId) return () => {};

  try {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onUpdate(messages);
    }, (err) => {
      console.warn("Messages subscription listener warning:", err);
    });
  } catch (err) {
    console.warn("Failed to subscribe to chat messages:", err);
    return () => {};
  }
}

/**
 * Send a message inside a chat channel
 */
export async function sendChatMessageToCloud(chatId, message) {
  if (!isFirebaseConfigured || !db || !chatId) return { success: false, offline: true };

  try {
    // 1. Add message to subcollection
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCol, {
      ...message,
      timestamp: serverTimestamp(),
      createdAtIso: new Date().toISOString()
    });

    // 2. Update parent chat doc
    const chatDoc = doc(db, 'chats', chatId);
    const updateData = {
      lastMessage: message.text,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastMessageTimestamp: serverTimestamp()
    };

    if (message.senderRole === 'buyer') {
      updateData.unreadCountFarmer = 1;
    } else {
      updateData.unreadCountBuyer = 1;
    }

    await updateDoc(chatDoc, updateData);
    return { success: true };
  } catch (err) {
    console.error("Error sending message to Firestore:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Create a new chat thread in Firestore
 */
export async function createChatInCloud(chatData) {
  if (!isFirebaseConfigured || !db) return { success: false, offline: true };

  try {
    const chatDoc = doc(db, 'chats', chatData.id);
    await setDoc(chatDoc, {
      ...chatData,
      lastMessageTimestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    // Add initial greeting message if present
    if (chatData.messages && chatData.messages.length > 0) {
      const initialMsg = chatData.messages[0];
      const messagesCol = collection(db, 'chats', chatData.id, 'messages');
      await addDoc(messagesCol, {
        ...initialMsg,
        timestamp: serverTimestamp(),
        createdAtIso: new Date().toISOString()
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Error creating chat in Firestore:", err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// 6. CLOUD FIRESTORE: USER PROFILES, INQUIRIES & REVIEWS
// ============================================================================

export async function saveUserToCloud(user) {
  if (!isFirebaseConfigured || !db || !user?.phone) return { success: false, offline: true };

  try {
    const cleanPhone = user.phone.replace(/\D/g, '');
    const userDoc = doc(db, 'users', cleanPhone);
    await setDoc(userDoc, {
      ...user,
      phone: cleanPhone,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
    return { success: false, error: err.message };
  }
}

export async function fetchUserFromCloud(phone) {
  if (!isFirebaseConfigured || !db || !phone) return null;

  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const userDoc = doc(db, 'users', cleanPhone);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.error("Error fetching user from Firestore:", err);
    return null;
  }
}

export async function saveInquiryToCloud(inquiry) {
  if (!isFirebaseConfigured || !db) return { success: false, offline: true };

  try {
    const inqDoc = doc(db, 'inquiries', inquiry.id);
    await setDoc(inqDoc, {
      ...inquiry,
      timestamp: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error("Error saving inquiry to Firestore:", err);
    return { success: false, error: err.message };
  }
}
