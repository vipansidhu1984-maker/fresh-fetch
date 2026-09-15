// Mock Seed Data for Fresh Fetch - Hanumangarh & Sri Ganganagar, Rajasthan

export const REGIONS = [
  { id: 'all', name: 'All Locations', nameHi: 'सभी क्षेत्र', namePa: 'ਸਾਰੇ ਇਲਾਕੇ' },
  // Hanumangarh District
  { id: 'hnm-town', district: 'Hanumangarh', name: 'Hanumangarh Town', nameHi: 'हनुमानगढ़ टाउन', namePa: 'ਹਨੂਮਾਨਗੜ੍ਹ ਟਾਊਨ' },
  { id: 'hnm-jn', district: 'Hanumangarh', name: 'Hanumangarh Junction', nameHi: 'हनुमानगढ़ जंक्शन', namePa: 'ਹਨੂਮਾਨਗੜ੍ਹ ਜੰਕਸ਼ਨ' },
  { id: 'hnm-sangaria', district: 'Hanumangarh', name: 'Sangaria', nameHi: 'संगरिया', namePa: 'ਸੰਗਰੀਆ' },
  { id: 'hnm-nohar', district: 'Hanumangarh', name: 'Nohar', nameHi: 'नोहर', namePa: 'ਨੋਹਰ' },
  { id: 'hnm-bhadra', district: 'Hanumangarh', name: 'Bhadra', nameHi: 'भादरा', namePa: 'ਭਾਦਰਾ' },
  { id: 'hnm-pilibanga', district: 'Hanumangarh', name: 'Pilibanga', nameHi: 'पीलीबंगा', namePa: 'ਪੀਲੀਬੰਗਾ' },
  { id: 'hnm-rawatsar', district: 'Hanumangarh', name: 'Rawatsar', nameHi: 'रावतसर', namePa: 'ਰਾਵਤਸਰ' },
  { id: 'hnm-tibbi', district: 'Hanumangarh', name: 'Tibbi', nameHi: 'टिब्बी', namePa: 'ਟਿੱਬੀ' },
  // Sri Ganganagar District
  { id: 'ggn-city', district: 'Sri Ganganagar', name: 'Sri Ganganagar City', nameHi: 'श्रीगंगानगर शहर', namePa: 'ਸ੍ਰੀ ਗੰਗਾਨਗਰ ਸ਼ਹਿਰ' },
  { id: 'ggn-suratgarh', district: 'Sri Ganganagar', name: 'Suratgarh', nameHi: 'सूरतगढ़', namePa: 'ਸੂਰਤਗੜ੍ਹ' },
  { id: 'ggn-padampur', district: 'Sri Ganganagar', name: 'Padampur', nameHi: 'पदमपुर', namePa: 'ਪਦਮਪੁਰ' },
  { id: 'ggn-raisinghnagar', district: 'Sri Ganganagar', name: 'Raisinghnagar', nameHi: 'रायसिंहनगर', namePa: 'ਰਾਏਸਿੰਘਨਗਰ' },
  { id: 'ggn-anupgarh', district: 'Sri Ganganagar', name: 'Anupgarh', nameHi: 'अनूपगढ़', namePa: 'ਅਨੂਪਗੜ੍ਹ' },
  { id: 'ggn-sadulshahar', district: 'Sri Ganganagar', name: 'Sadulshahar', nameHi: 'सादुलशहर', namePa: 'ਸਾਦੁਲਸ਼ਹਿਰ' },
  { id: 'ggn-gajsinghpur', district: 'Sri Ganganagar', name: 'Gajsinghpur', nameHi: 'गजसिंहपुर', namePa: 'ਗਜਸਿੰਘਪੁਰ' }
];

export const CATEGORIES = [
  { id: 'all', key: 'catAll', icon: '🌾' },
  { id: 'ghee', key: 'catGhee', icon: '🧈' },
  { id: 'spices', key: 'catSpices', icon: '🌶️' },
  { id: 'oils', key: 'catOils', icon: '🫒' },
  { id: 'honey', key: 'catHoney', icon: '🍯' },
  { id: 'flour', key: 'catFlour', icon: '🌾' },
  { id: 'pickles', key: 'catPickles', icon: '🏺' },
  { id: 'fruits', key: 'catFruits', icon: '🍊' },
  { id: 'dairy', key: 'catDairy', icon: '🥛' }
];

// Helper to format Google Drive links into embedded preview links
export function formatDriveVideoUrl(url) {
  if (!url) return null;
  const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }
  const driveIdMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }
  return url;
}

// Helper to calculate future expiry date
export function calculateExpiryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split('T')[0];
}

// Check if a product is fresh and unexpired
export function isProductFresh(product) {
  if (!product || !product.expiryDate) return true;
  const today = new Date().toISOString().split('T')[0];
  return product.expiryDate >= today;
}

// Get remaining days count
export function getDaysRemaining(expiryDate) {
  if (!expiryDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  const diffTime = exp - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Live Products Store - Real farmer listings only (No fake / dummy listings)
export const INITIAL_PRODUCTS = [];

export const REGISTERED_USERS_SEED = [
  {
    id: 'farmer-ramesh',
    name: 'Ramesh Kumar (रमेश कुमार)',
    role: 'producer',
    phone: '9829012345',
    password: 'farmer123',
    dob: '1982-06-15',
    location: 'Sangaria, Hanumangarh',
    regionId: 'hnm-sangaria',
    farmName: 'Surya Rathi Goshala & Farm',
    bio: 'Dedicated to pure Rathi cows and natural farm produce in Sangaria.'
  },
  {
    id: 'farmer-jashan',
    name: 'Jashan Singh (जशन सिंह)',
    role: 'producer',
    phone: '9814054321',
    password: 'farmer123',
    dob: '1996-03-22',
    location: 'Sri Ganganagar City',
    regionId: 'ggn-city',
    farmName: 'Jashan Kinnow Orchards',
    bio: 'Co-founder partner. Orchard fresh Kinnow and pure produce.'
  },
  {
    id: 'founder-vipandeep',
    name: 'Vipandeep Singh (AIT Pune)',
    role: 'producer',
    phone: '8107008156',
    password: 'admin123',
    dob: '2003-11-10',
    location: 'Hanumangarh Town',
    regionId: 'hnm-town',
    farmName: 'Fresh Fetch Pure Farms',
    bio: 'Founder at Fresh Fetch. Building direct farm-to-kitchen revolution.'
  },
  {
    id: 'buyer-priya',
    name: 'Priya Sharma (प्रिया शर्मा)',
    role: 'buyer',
    phone: '9876543210',
    password: 'buyer123',
    dob: '1995-08-20',
    location: 'Hanumangarh Town',
    regionId: 'hnm-town',
    bio: 'Looking for 100% pure Desi Ghee & Spices for home.'
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat-1',
    productId: 'prod-1',
    productTitle: 'A2 Vedic Bilona Desi Cow Ghee (राठी गाय का शुद्ध बिलोना घी)',
    productPrice: 1450,
    productUnit: 'kg',
    productImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    sellerId: 'farmer-ramesh',
    sellerName: 'Ramesh Kumar (रमेश कुमार)',
    sellerPhone: '9829012345',
    sellerLocation: 'Sangaria, Hanumangarh',
    buyerId: 'buyer-priya',
    buyerName: 'Priya Sharma',
    buyerPhone: '9876543210',
    unreadCountFarmer: 0,
    unreadCountBuyer: 0,
    lastMessage: 'Ji bilkul, fresh batch packed yesterday. Home delivery available.',
    lastMessageTime: '10:45 AM',
    messages: [
      {
        id: 'msg-1',
        senderRole: 'buyer',
        senderName: 'Priya Sharma',
        text: 'Namaste Ramesh ji! Is this pure A2 Bilona ghee from Rathi cows? Can you deliver 2kg to Hanumangarh Town?',
        time: '10:30 AM',
        status: 'read'
      },
      {
        id: 'msg-2',
        senderRole: 'producer',
        senderName: 'Ramesh Kumar',
        text: 'Namaste Priya ji! Haan ji, 100% pure Rathi cow curd bilona ghee hai. Kal subah ka fresh batch ready hai. Hum Hanumangarh Town me kal dopahar tak deliver kar denge.',
        time: '10:35 AM',
        status: 'read'
      },
      {
        id: 'msg-3',
        senderRole: 'buyer',
        senderName: 'Priya Sharma',
        text: 'Great! Please confirm 2kg pack. Total ₹2,900. I will pay via UPI on delivery.',
        time: '10:40 AM',
        status: 'read'
      },
      {
        id: 'msg-4',
        senderRole: 'producer',
        senderName: 'Ramesh Kumar',
        text: 'Ji bilkul, fresh batch packed yesterday. Home delivery available. Thank you!',
        time: '10:45 AM',
        status: 'read'
      }
    ]
  },
  {
    id: 'chat-2',
    productId: 'prod-2',
    productTitle: 'Cold-Pressed Kachi Ghani Mustard Oil (कच्ची घाणी सरसों तेल)',
    productPrice: 195,
    productUnit: 'Litre',
    productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    sellerId: 'farmer-balwinder',
    sellerName: 'Balwinder Singh (बलविंदर सिंह)',
    sellerPhone: '9414078901',
    sellerLocation: 'Suratgarh, Sri Ganganagar',
    buyerId: 'user-guest',
    buyerName: 'Amit Bansal',
    buyerPhone: '9414055443',
    unreadCountFarmer: 1,
    unreadCountBuyer: 0,
    lastMessage: 'Is this extracted in wooden kolhu at low temperature?',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'msg-201',
        senderRole: 'buyer',
        senderName: 'Amit Bansal',
        text: 'Sat Sri Akal Balwinder ji! Is this extracted in wooden kolhu at low temperature?',
        time: 'Yesterday',
        status: 'delivered'
      }
    ]
  }
];

export const DEMO_USERS = {
  farmerRamesh: REGISTERED_USERS_SEED[0],
  farmerJashan: REGISTERED_USERS_SEED[1],
  founderVipandeep: REGISTERED_USERS_SEED[2],
  buyerPriya: REGISTERED_USERS_SEED[3]
};

