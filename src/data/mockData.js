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

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'A2 Vedic Bilona Desi Cow Ghee (राठी गाय का शुद्ध बिलोना घी)',
    category: 'ghee',
    price: 1450,
    unit: 'kg',
    availableQty: '35 kg',
    minOrder: '1 kg',
    shelfLifeDays: 180,
    expiryDate: calculateExpiryDate(180),
    inStock: true,
    rating: 4.9,
    reviewsCount: 3,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1bilona_curd_churning_sample_drive_video_view/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-churning-fresh-butter-and-milk-41221-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80', caption: 'Grass-fed Rathi Cows' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80', caption: 'Traditional Wooden Churning (Bilona)' }
    ],
    purityBadge: 'A2 Bilona Method',
    purityMethod: 'Prepared by churning whole curd using wooden Bilona in earthen pots from free-grazing Rathi cows.',
    sellerId: 'farmer-ramesh',
    sellerName: 'Ramesh Kumar (रमेश कुमार)',
    sellerPhone: '9829012345',
    sellerWhatsApp: '919829012345',
    sellerLocation: 'Sangaria, Hanumangarh',
    regionId: 'hnm-sangaria',
    farmName: 'Surya Rathi Goshala & Farm',
    verified: true,
    harvestDate: 'Fresh Weekly Batch',
    createdDate: '2026-09-01',
    reviews: [
      { id: 'rev-1', reviewerName: 'Amit Bansal', rating: 5, comment: 'Authentic village aroma and grain structure! Exactly like my grandmother used to make in Sangaria.', date: '2026-09-08' },
      { id: 'rev-2', reviewerName: 'Sunita Mehra', rating: 5, comment: 'Very pure and light on stomach. Ordered 2 kg for family in Pune.', date: '2026-09-10' },
      { id: 'rev-3', reviewerName: 'Gurdeep S.', rating: 4.8, comment: 'Quick response on WhatsApp from Ramesh ji. Highly recommended.', date: '2026-09-12' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Cold-Pressed Kachi Ghani Mustard Oil (कच्ची घाणी सरसों तेल)',
    category: 'oils',
    price: 195,
    unit: 'Litre',
    availableQty: '60 Litres',
    minOrder: '2 Litres',
    shelfLifeDays: 90,
    expiryDate: calculateExpiryDate(90),
    inStock: true,
    rating: 4.8,
    reviewsCount: 2,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1mustard_kolhu_coldpress_drive_video_view/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-fresh-oil-into-a-bowl-43405-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80', caption: 'Harvested Black Mustard Seeds' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', caption: 'Wooden Kolhu Cold Extraction' }
    ],
    purityBadge: 'Wood Pressed / Kolhu',
    purityMethod: 'Cold-pressed at low temperature (<40°C) in wooden Kolhu. 100% unrefined with intense natural pungency.',
    sellerId: 'farmer-balwinder',
    sellerName: 'Balwinder Singh (बलविंदर सिंह)',
    sellerPhone: '9414078901',
    sellerWhatsApp: '919414078901',
    sellerLocation: 'Suratgarh, Sri Ganganagar',
    regionId: 'ggn-suratgarh',
    farmName: 'Balwinder Organic Ghani',
    verified: true,
    harvestDate: 'Extracted Daily',
    createdDate: '2026-09-03',
    reviews: [
      { id: 'rev-4', reviewerName: 'Vikram Joshi', rating: 5, comment: 'Real pungent smell (तीखापन) that store-bought oils lack completely. Pure quality.', date: '2026-09-09' },
      { id: 'rev-5', reviewerName: 'Manpreet K.', rating: 4.7, comment: 'Great packaging and delivered fresh from Suratgarh.', date: '2026-09-11' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Direct Orchard Ganganagar Kinnow (श्रीगंगानगर का मीठा किन्नू)',
    category: 'fruits',
    price: 650,
    unit: 'Box (10kg)',
    availableQty: '40 Boxes',
    minOrder: '1 Box',
    shelfLifeDays: 14,
    expiryDate: calculateExpiryDate(14),
    inStock: true,
    rating: 5.0,
    reviewsCount: 2,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1ganganagar_kinnow_orchard_harvest_video/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-oranges-hanging-on-a-tree-in-the-sun-41315-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80', caption: 'Canal-irrigated Orchards' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80', caption: 'Tree-ripened Pluck' }
    ],
    purityBadge: 'Tree Ripened Orchard Pluck',
    purityMethod: 'Handpicked from canal-fed orchards in Sri Ganganagar. Wax-free, naturally ripened without artificial gases.',
    sellerId: 'farmer-jashan',
    sellerName: 'Jashan Singh (जशन सिंह)',
    sellerPhone: '9876543210',
    sellerWhatsApp: '919876543210',
    sellerLocation: 'Sri Ganganagar City',
    regionId: 'ggn-city',
    farmName: 'Jashan Kinnow Orchards',
    verified: true,
    harvestDate: 'Fresh Plucked',
    createdDate: '2026-09-05',
    reviews: [
      { id: 'rev-6', reviewerName: 'Priya Sharma', rating: 5, comment: 'Juiciest Kinnows I ever had! Sweet and full of vitamin C.', date: '2026-09-10' },
      { id: 'rev-7', reviewerName: 'Rajesh Godara', rating: 5, comment: 'Jashan bhai sent fresh crate via bus transport within a few hours.', date: '2026-09-12' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Stone-Pounded Rajasthani Lakadong Haldi (हाथ की कुटी हल्दी)',
    category: 'spices',
    price: 340,
    unit: 'kg',
    availableQty: '25 kg',
    minOrder: '500g',
    shelfLifeDays: 365,
    expiryDate: calculateExpiryDate(365),
    inStock: true,
    rating: 4.9,
    reviewsCount: 2,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1turmeric_stone_grinding_video_view/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-grinding-spices-with-a-mortar-and-pestle-41804-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80', caption: 'Sun-dried Curcumin Rhizomes' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', caption: 'Stone Pestle Pounding' }
    ],
    purityBadge: 'Stone Ground (हाथ पिसाई)',
    purityMethod: 'Sun-dried turmeric rhizomes hand-pounded in stone pestle. Zero artificial color, starch or lead chromate.',
    sellerId: 'farmer-harpreet',
    sellerName: 'Harpreet Kaur (हरप्रीत कौर)',
    sellerPhone: '9783056789',
    sellerWhatsApp: '919783056789',
    sellerLocation: 'Hanumangarh Junction',
    regionId: 'hnm-jn',
    farmName: 'Maa Annapurna Desi Masale',
    verified: true,
    harvestDate: 'August 2026 Batch',
    createdDate: '2026-09-02',
    reviews: [
      { id: 'rev-8', reviewerName: 'Deepak Verma', rating: 5, comment: 'Just half spoon gives deep golden color to curries. No adulteration at all.', date: '2026-09-06' }
    ]
  },
  {
    id: 'prod-5',
    title: 'Raw Multi-Flora Desert Honey (कच्चा प्राकृतिक शहद)',
    category: 'honey',
    price: 520,
    unit: 'kg',
    availableQty: '20 kg',
    minOrder: '1 kg',
    shelfLifeDays: 365,
    expiryDate: calculateExpiryDate(365),
    inStock: true,
    rating: 4.8,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1honey_apiary_harvest_drive_video_view/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-honey-flowing-from-a-wooden-dipper-43406-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=800&q=80', caption: 'Mustard Floral Apiary' }
    ],
    purityBadge: '100% Raw Unprocessed',
    purityMethod: 'Harvested directly from bee boxes in Hanumangarh mustard floral belt. Unheated & cloth-filtered.',
    sellerId: 'farmer-sukhwinder',
    sellerName: 'Sukhwinder Sharma (सुखविंदर)',
    sellerPhone: '9828034567',
    sellerWhatsApp: '919828034567',
    sellerLocation: 'Nohar, Hanumangarh',
    regionId: 'hnm-nohar',
    farmName: 'Thar Pure Honey Apiary',
    verified: true,
    harvestDate: 'Fresh Harvest',
    createdDate: '2026-09-04',
    reviews: [
      { id: 'rev-9', reviewerName: 'Simranjeet S.', rating: 4.8, comment: 'Natural pollen aroma. Truly raw honey.', date: '2026-09-07' }
    ]
  },
  {
    id: 'prod-6',
    title: 'Rajasthani Ker Sangri Homemade Achar (केयर सांगरी आचार)',
    category: 'pickles',
    price: 480,
    unit: 'kg',
    availableQty: '15 kg',
    minOrder: '500g',
    shelfLifeDays: 180,
    expiryDate: calculateExpiryDate(180),
    inStock: true,
    rating: 5.0,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1589135233689-d653767cf5e4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://drive.google.com/file/d/1ker_sangri_pickle_making_drive_video/view?usp=sharing',
    fallbackDirectVideo: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-and-spices-on-a-table-41805-large.mp4',
    processMedia: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1589135233689-d653767cf5e4?auto=format&fit=crop&w=800&q=80', caption: 'Sun Curing in Ceramic Barnis' }
    ],
    purityBadge: 'Homemade In Kachi Ghani Oil',
    purityMethod: 'Authentic Ker and Sangri sun-cured in wood-pressed mustard oil with hand-ground spices.',
    sellerId: 'farmer-kamla',
    sellerName: 'Kamla Devi (कमला देवी)',
    sellerPhone: '9460011223',
    sellerWhatsApp: '919460011223',
    sellerLocation: 'Bhadra, Hanumangarh',
    regionId: 'hnm-bhadra',
    farmName: 'Desi Dadi-Nani Rasoi',
    verified: true,
    harvestDate: 'Fresh Batch',
    createdDate: '2026-09-06',
    reviews: [
      { id: 'rev-10', reviewerName: 'Anita Rathore', rating: 5, comment: 'Tastes exactly like authentic Marwari wedding Ker Sangri!', date: '2026-09-11' }
    ]
  }
];

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

