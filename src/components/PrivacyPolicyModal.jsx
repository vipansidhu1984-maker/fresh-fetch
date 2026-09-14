import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Phone, 
  AlertCircle, 
  Scale, 
  Globe, 
  Tractor, 
  ShoppingBag, 
  Sparkles,
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export function PrivacyPolicyModal() {
  const { showPrivacyModal, setShowPrivacyModal, language, t } = useApp();
  const [policyLang, setPolicyLang] = useState(language === 'pa' ? 'pa' : language === 'hi' ? 'hi' : 'en');

  if (!showPrivacyModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
      <div className="modal-card" style={{ maxWidth: '780px', maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ position: 'sticky', top: 0, background: 'inherit', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: 'var(--radius-md)', 
                background: '#dcfce7', 
                color: 'var(--primary-forest)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Scale size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                {policyLang === 'hi' 
                  ? 'विस्तृत गोपनीयता नीति एवं नियम (Terms & Privacy Policy)' 
                  : policyLang === 'pa'
                  ? 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ ਅਤੇ ਨਿਯਮ (Terms & Privacy Policy)'
                  : 'Comprehensive Terms & Privacy Policy'}
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Fresh Fetch Technologies • Effective: September 2026 • Region: Hanumangarh & Sri Ganganagar
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setShowPrivacyModal(false)} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Policy Language Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-subtle)' }}>
          <button
            onClick={() => setPolicyLang('hi')}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: '800',
              background: policyLang === 'hi' ? 'var(--primary-forest)' : 'var(--card-bg)',
              color: policyLang === 'hi' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setPolicyLang('en')}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: '800',
              background: policyLang === 'en' ? 'var(--primary-forest)' : 'var(--card-bg)',
              color: policyLang === 'en' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
          >
            English
          </button>
          <button
            onClick={() => setPolicyLang('pa')}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: '800',
              background: policyLang === 'pa' ? 'var(--primary-forest)' : 'var(--card-bg)',
              color: policyLang === 'pa' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
          >
            ਪੰਜਾਬੀ (Punjabi)
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', fontSize: '0.88rem', lineHeight: '1.7', padding: '1.25rem' }}>
          
          {policyLang === 'hi' ? (
            /* =========================================================================
               HINDI VERSION (संपूर्ण विस्तृत विवरण)
               ========================================================================= */
            <div>
              {/* Executive Summary Card */}
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                  <ShieldCheck size={18} />
                  <span>मुख्य सारांश एवं डिजिटल प्रतिबद्धता (Core Trust Framework)</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#166534', lineHeight: '1.5' }}>
                  Fresh Fetch एक सीधा खेत-से-उपभोक्ता (Farm-to-Consumer) मंच है, जिसकी स्थापना <strong>विपनदीप सिंह (AIT Pune)</strong> और <strong>जशन</strong> द्वारा राजस्थान के <strong>हनुमानगढ़</strong> और <strong>श्रीगंगानगर</strong> जिलों में की गई है। हमारा उद्देश्य बिना किसी बिचौलिए के किसानों की 100% शुद्ध वस्तुओं (A2 बिलोना घी, कच्ची घानी सरसों तेल, जंगली शहद, लाकाडोंग हल्दी आदि) को सीधे परिवारों तक पहुँचाना है। नीचे प्रत्येक बिंदु का कानूनी और व्यावहारिक विवरण दिया गया है।
                </p>
              </div>

              {/* Point 1 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  1. प्रस्तावना, कार्यक्षेत्र एवं मंच की स्वीकृति (Preamble & Scope)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.5rem' }}>
                  इस एप्लिकेशन (वेबसाइट या प्रोग्रेसिव वेब ऐप - PWA) का उपयोग करके आप Fresh Fetch की इन सभी नीतियों और शर्तों को पूरी तरह स्वीकार करते हैं। यह मंच हनुमानगढ़ (टाउन, जंक्शन, संगरिया, नोहर, भादरा, पीलीबंगा, रावतसर, टिब्बी) एवं श्रीगंगानगर (शहर, सूरतगढ़, पदमपुर, रायसिंहनगर, अनूपगढ़, सादुलशहर) के स्थानीय नागरिकों और किसानों के लिए संचालित है।
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  यदि आप इनमें से किसी भी शर्त से असहमत हैं, तो आप इस ऐप का उपयोग बंद करने के लिए स्वतंत्र हैं।
                </p>
              </div>

              {/* Point 2 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  2. डेटा संग्रह, वर्गीकरण एवं गोपनीयता (Data Collection & DPDP Act Compliance)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  हम भारत के <strong>डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 (DPDP Act 2023)</strong> के सिद्धांतों का कड़ाई से पालन करते हैं। हम केवल वही सीमित जानकारी एकत्र करते हैं जो किसानों और खरीदारों के बीच स्थानीय संपर्क के लिए आवश्यक है:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>व्यक्तिगत पहचान:</strong> आपका पूरा नाम, मोबाइल नंबर, जन्म तिथि (आयु सत्यापन हेतु) और तहसील/स्थान।</li>
                  <li><strong>किसान प्रोफाइल व उत्पाद विवरण:</strong> खेत या गौशाला का नाम, उत्पाद की तस्वीरें, शुद्ध बनाने की पारम्परिक विधि का विवरण, बैच निर्माण तिथि एवं शेल्फ-लाइफ अवधि।</li>
                  <li><strong>उपयोगकर्ता प्राथमिकताएं:</strong> आपकी पसंदीदा वस्तुएं (Wishlist), व्हाट्सएप पूछताछ इतिहास एवं ग्राहक समीक्षाएं।</li>
                  <li><strong>डिवाइस वरीयताएँ:</strong> डार्क मोड सेटिंग एवं भाषा चयन जो आपके डिवाइस के सुरक्षित लोकल स्टोरेज में सहेजे जाते हैं।</li>
                </ul>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--primary-forest)', fontWeight: '700' }}>
                  🔒 डेटा सुरक्षा वादा: हम कभी भी आपका व्यक्तिगत डेटा किसी तीसरे पक्ष, विज्ञापन नेटवर्क, मार्केटिंग एजेंसी या डेटा ब्रोकर को नहीं बेचते हैं।
                </div>
              </div>

              {/* Point 3 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  3. शून्य वित्तीय डेटा देयता एवं प्रत्यक्ष भुगतान (Zero Financial Liability & Direct UPI/COD)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Fresh Fetch कोई वॉलेट, पेमेंट गेटवे या बैंक खाता डेटाबेस नहीं चलाता है।
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li>हम कभी भी आपके डेबिट कार्ड, क्रेडिट कार्ड नंबर, CVV, नेट बैंकिंग पासवर्ड या UPI पिन को एकत्र, प्रोसेस या स्टोर <strong>नहीं करते</strong>।</li>
                  <li>सभी आर्डर और लेन-देन सीधे किसान और खरीदार के बीच उनके अपने व्यक्तिगत UPI ऐप्स (PhonePe, Google Pay, Paytm, BHIM) या डिलीवरी के समय नकद (Cash on Delivery) के माध्यम से होते हैं।</li>
                  <li>Fresh Fetch किसानों से कोई कमीशन नहीं लेता है। इसलिए किसान को अपनी मेहनत का पूरा दाम मिलता है और ग्राहक को सबसे उचित मूल्य।</li>
                  <li>किसी भी बैंक विफलता, गलत खाते में अंतरण या व्यक्तिगत भुगतान विवाद के लिए Fresh Fetch वित्तीय रूप से उत्तरदायी नहीं है।</li>
                </ul>
              </div>

              {/* Point 4 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  4. किसानों एवं विक्रेताओं की आचार संहिता व 100% शुद्धता मानक (Farmer Purity Standards)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Fresh Fetch पर उत्पाद सूचीबद्ध करने वाले प्रत्येक किसान और उत्पादक को निम्नलिखित कड़े मानकों का पालन करना अनिवार्य है:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>पूर्ण शुद्धता की गारंटी:</strong> उत्पाद में किसी भी प्रकार की मिलावट, रासायनिक रंग, सिंथेटिक खुशबू, पाम आयल या प्रिज़र्वेटिव का उपयोग पूरी तरह वर्जित है।</li>
                  <li><strong>पारम्परिक विधि का सत्य विवरण:</strong> A2 वैदिक बिलोना घी केवल देशी गाय के दही को बिलोकर मिट्टी के बर्तन/तांबे के बर्तन में पारंपरिक विधि से ही बनाया जाना चाहिए। सरसों तेल कच्ची घानी (कोल्हू) से ही निकला होना चाहिए।</li>
                  <li><strong>सत्य शेल्फ-लाइफ एवं बैच तिथि:</strong> प्रत्येक उत्पाद पर सत्य बैच निर्माण तिथि और शेल्फ-लाइफ अंकित करना अनिवार्य है। अवधि समाप्त होने पर प्रणाली उत्पाद को स्वतः निष्क्रिय करती है जिसे नया बैच तैयार होने पर ही किसान नवीनीकृत (Renew) कर सकता है।</li>
                  <li><strong>उचित एवं पारदर्शी व्यवहार:</strong> खरीदारों द्वारा व्हाट्सएप पर पूछे गए प्रश्नों का सम्मानपूर्वक एवं त्वरित उत्तर देना किसान का कर्तव्य है।</li>
                </ul>
              </div>

              {/* Point 5 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  5. खरीदार के अधिकार, जिम्मेदारी एवं डिलीवरी दिशानिर्देश (Buyer Rights & Responsibilities)
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>डिलीवरी पर जाँच का अधिकार:</strong> ग्राहक को उत्पाद लेते समय पैकेजिंग, सील, बैच तिथि, सुगंध और गुणवत्ता की भौतिक रूप से जांच करने का पूर्ण अधिकार है।</li>
                  <li><strong>सद्भावपूर्ण संवाद:</strong> किसान सीधे अपने खेत से उत्पाद प्रदान कर रहे हैं; कृपया व्हाट्सएप पर बातचीत के दौरान शिष्टाचार बनाए रखें।</li>
                  <li><strong>धोखाधड़ी व स्पैम की मनाही:</strong> झूठे आर्डर देना, किसानों को परेशान करना या अनुचित मोलभाव के लिए स्पैम करना सख्त मना है। ऐसा करने पर उपयोगकर्ता की आईडी को तुरंत ब्लॉक कर दिया जाएगा।</li>
                  <li><strong>समीक्षा की प्रामाणिकता:</strong> ऐप पर दी जाने वाली समीक्षाएं (Reviews) वास्तविक उपभोग अनुभव पर आधारित होनी चाहिए।</li>
                </ul>
              </div>

              {/* Point 6 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  6. मध्यस्थ मंच का कानूनी स्वरूप एवं विधिक छूट (IT Act 2000 Section 79 Intermediary Status)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  भारतीय सूचना प्रौद्योगिकी अधिनियम 2000 (Information Technology Act, 2000) की <strong>धारा 79</strong> एवं मध्यस्थ दिशानिर्देश नियम 2021 के तहत Fresh Fetch एक 'डिजिटल मध्यस्थ' (Electronic Intermediary) के रूप में कार्य करता है:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li>Fresh Fetch स्वयं किसी उत्पाद का विनिर्माण, पैकेजिंग या भौतिक स्वामित्व नहीं रखता है।</li>
                  <li>प्रत्येक स्वतंत्र किसान अपने द्वारा सूचीबद्ध उत्पाद की गुणवत्ता, शुद्धता के दावों, सरकारी अनुमतियों एवं कानूनी दायित्वों के लिए स्वयं जिम्मेदार है।</li>
                  <li>यदि किसी उत्पाद या विक्रेता के खिलाफ मिलावट, कॉपीराइट उल्लंघन या धोखाधड़ी की विश्वसनीय शिकायत प्राप्त होती है, तो Fresh Fetch उस लिस्टिंग को तुरंत हटाने और संबंधित खाते को प्रतिबंधित करने का पूर्ण अधिकार रखता है।</li>
                </ul>
              </div>

              {/* Point 7 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  7. प्राकृतिक कृषि उत्पाद अस्वीकरण एवं दायित्व की सीमा (Natural Variations & Limitation of Liability)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  प्राकृतिक एवं शुद्ध कृषि उत्पादों (जैसे कच्चा शहद सर्दियों में स्वाभाविक रूप से जमना, कच्ची घानी तेल में प्राकृतिक तलछट बैठना, देशी गाय के चारे के आधार पर घी के रंग में हल्का मौसमी बदलाव) में प्रकृति के अनुसार स्वाभाविक भिन्नताएं हो सकती हैं। यह अशुद्धि का संकेत नहीं है बल्कि प्राकृतिक शुद्धता का प्रमाण है।
                </p>
              </div>

              {/* Point 8 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  8. उपयोगकर्ता अधिकार, प्रोफाइल संशोधन एवं डेटा निष्कासन (User Rights & Data Erasure)
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.3rem' }}>
                  आपको अपनी व्यक्तिगत जानकारी देखने, प्रोफ़ाइल फ़ोटो बदलने, नाम या पता संपादित करने का पूर्ण अधिकार है (प्रोफ़ाइल अनुभाग में 'Edit Profile' विकल्प के माध्यम से)।
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  यदि आप अपना खाता और सभी संबंधित डेटा स्थायी रूप से हटाना चाहते हैं, तो आप सीधे हमारे शिकायत निवारण अधिकारी को व्हाट्सएप पर संदेश भेजकर डेटा निष्कासन (Data Deletion) का अनुरोध कर सकते हैं।
                </p>
              </div>

              {/* Point 9 - Grievance Officer */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={18} />
                  <span>9. शिकायत निवारण अधिकारी एवं कानूनी क्षेत्राधिकार (Grievance Officer & Legal Jurisdiction)</span>
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  सूचना प्रौद्योगिकी (मध्यस्थ दिशानिर्देश) नियम 2021 के अनुपालन में, किसी भी सहायता, शिकायत या विधिक सूचना के लिए हमारे आधिकारिक संपर्क विवरण निम्नलिखित हैं:
                </p>
                <div style={{ display: 'grid', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  <div><strong>अधिकारी का नाम:</strong> विपनदीप सिंह (AIT Pune) एवं जशन</div>
                  <div><strong>पद:</strong> संस्थापक एवं शिकायत निवारण अधिकारी (Founders & Grievance Redressal Officers)</div>
                  <div><strong>संस्था:</strong> Fresh Fetch Technologies, Hanumangarh & Sri Ganganagar, Rajasthan</div>
                  <div>
                    <strong>व्हाट्सएप हेल्पलाइन: </strong>
                    <a href="https://wa.me/918107008156" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800', textDecoration: 'underline' }}>
                      +91 8107008156
                    </a>
                    <span> / </span>
                    <a href="https://wa.me/919511544399" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800', textDecoration: 'underline' }}>
                      +91 9511544399
                    </a>
                  </div>
                  <div><strong>शिकायत निवारण समय-सीमा (SLA):</strong> 24 घंटे के भीतर पावती (Acknowledgment) एवं 7 कार्य दिवसों में पूर्ण समाधान।</div>
                  <div><strong>कानूनी क्षेत्राधिकार:</strong> हनुमानगढ़ एवं श्रीगंगानगर न्यायालय, राजस्थान, भारत।</div>
                </div>
              </div>
            </div>
          ) : policyLang === 'pa' ? (
            /* =========================================================================
               PUNJABI VERSION
               ========================================================================= */
            <div>
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                  <ShieldCheck size={18} />
                  <span>ਮੁੱਖ ਸਾਰਾਂਸ਼ ਅਤੇ ਨਿਯਮ (Summary in Punjabi)</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#166534', lineHeight: '1.5' }}>
                  Fresh Fetch ਇੱਕ ਸਿੱਧਾ ਕਿਸਾਨ-ਤੋਂ-ਖਪਤਕਾਰ ਪਲੇਟਫਾਰਮ ਹੈ ਜਿਸ ਦੀ ਸ਼ੁਰੂਆਤ <strong>ਵਿਪਨਦੀਪ ਸਿੰਘ (AIT Pune)</strong> ਅਤੇ <strong>ਜਸ਼ਨ</strong> ਦੁਆਰਾ ਹਨੂਮਾਨਗੜ੍ਹ ਅਤੇ ਸ੍ਰੀ ਗੰਗਾਨਗਰ ਵਿੱਚ ਕੀਤੀ ਗਈ ਹੈ। ਅਸੀਂ ਕਿਸਾਨਾਂ ਦੇ ਸ਼ੁੱਧ ਉਤਪਾਦਾਂ (ਦੇਸੀ ਘਿਓ, ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ, ਸ਼ਹਿਦ, ਹਲਦੀ) ਨੂੰ ਬਿਨਾਂ ਵਿਚੋਲੇ ਦੇ ਸਿੱਧਾ ਘਰਾਂ ਤੱਕ ਪਹੁੰਚਾਉਣ ਲਈ ਵਚਨਬੱਧ ਹਾਂ।
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '0.98rem', marginBottom: '0.3rem' }}>
                  1. ਡੇਟਾ ਸੁਰੱਖਿਆ ਅਤੇ ਕੋਈ ਵਿੱਤੀ ਜਾਣਕਾਰੀ ਸਟੋਰ ਨਾ ਕਰਨਾ
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ਅਸੀਂ ਤੁਹਾਡਾ ਕੋਈ ਵੀ ਬੈਂਕ ਕਾਰਡ, CVV ਜਾਂ UPI ਪਿੰਨ ਸਟੋਰ ਨਹੀਂ ਕਰਦੇ। ਸਾਰਾ ਭੁਗਤਾਨ ਸਿੱਧਾ ਕਿਸਾਨ ਅਤੇ ਗਾਹਕ ਵਿਚਕਾਰ UPI ਜਾਂ ਕੈਸ਼ ਆਨ ਡਿਲੀਵਰੀ ਰਾਹੀਂ ਹੁੰਦਾ ਹੈ। ਅਸੀਂ ਤੁਹਾਡਾ ਨਿੱਜੀ ਡੇਟਾ ਕਿਸੇ ਤੀਜੀ ਧਿਰ ਨੂੰ ਨਹੀਂ ਵੇਚਦੇ।
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '0.98rem', marginBottom: '0.3rem' }}>
                  2. ਕਿਸਾਨਾਂ ਲਈ 100% ਸ਼ੁੱਧਤਾ ਦੀ ਗਾਰੰਟੀ
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ਸਾਰੇ ਉਤਪਾਦ ਅਸਲੀ ਅਤੇ ਬਿਨਾਂ ਮਿਲਾਵਟ ਦੇ ਹੋਣੇ ਲਾਜ਼ਮੀ ਹਨ। ਮਿਆਦ ਪੁੱਗਣ ਦੀ ਮਿਤੀ (Shelf-life) ਸਹੀ ਦੱਸੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ।
                </p>
              </div>

              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem', border: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                  3. ਸਹਾਇਤਾ ਅਤੇ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਨ ਅਧਿਕਾਰੀ
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ਕਿਸੇ ਵੀ ਪ੍ਰਸ਼ਨ ਜਾਂ ਸ਼ਿਕਾਇਤ ਲਈ ਸਿੱਧਾ ਸਾਡੇ ਵਟਸਐਪ ਨੰਬਰ 'ਤੇ ਸੰਪਰਕ ਕਰੋ:
                </p>
                <div style={{ marginTop: '0.3rem', fontWeight: '800', color: 'var(--whatsapp-dark)' }}>
                  📞 WhatsApp Helpline: +91 8107008156 / +91 9511544399 (Vipandeep & Jashan)
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               ENGLISH VERSION (Comprehensive & Detailed Legal Drafting)
               ========================================================================= */
            <div>
              {/* Executive Summary Card */}
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--primary-forest)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                  <ShieldCheck size={18} />
                  <span>Platform Trust Architecture & Executive Summary</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#166534', lineHeight: '1.5' }}>
                  Fresh Fetch is a direct Farm-to-Consumer digital marketplace founded by <strong>Vipandeep Singh (Army Institute of Technology Pune)</strong> and <strong>Jashan</strong>, purpose-built for the agrarian heartlands of <strong>Hanumangarh</strong> and <strong>Sri Ganganagar</strong> districts in Rajasthan, India. Our mission is to eliminate adulteration and commercial intermediaries, enabling verified rural producers to supply 100% authentic, traditionally prepared agricultural produce directly to households.
                </p>
              </div>

              {/* Section 1 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  1. Preamble, Scope & Acceptance of Terms
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  By downloading, browsing, registering, or interacting with the Fresh Fetch Progressive Web Application (PWA) and digital services, you unconditionally agree to be bound by these comprehensive Terms of Service and Privacy Policy.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  These terms govern all transactions, communications, listings, and consumer interactions across Phase 1 operational tehsils: Hanumangarh Town, Junction, Sangaria, Nohar, Bhadra, Pilibanga, Rawatsar, Tibbi, Sri Ganganagar City, Suratgarh, Padampur, Raisinghnagar, Anupgarh, and Sadulshahar.
                </p>
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  2. Data Collection, DPDP Act 2023 Principles & Purpose Limitation
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Fresh Fetch operates in strict compliance with India's <strong>Digital Personal Data Protection Act, 2023 (DPDP Act 2023)</strong> and fundamental principles of data minimization and purpose limitation. We collect only the data essential for facilitating direct agricultural commerce:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>Account Profile Identifiers:</strong> Full Legal Name, Verified 10-digit Mobile Phone Number, Date of Birth (for contractual capacity verification, minimum age 18 years), Tehsil/Village/City location.</li>
                  <li><strong>Producer & Farm Credentials:</strong> Farm/Goshala Name, physical village location, authentic preparation descriptions (e.g. A2 Vedic Bilona method, wood-pressed expeller extraction), product photographs, preparation batch dates, and shelf-life periods.</li>
                  <li><strong>User Interaction Records:</strong> Wishlist bookmarks, order inquiry logs, and authentic customer reviews and ratings.</li>
                  <li><strong>Device State & Preferences:</strong> UI theme (Dark Mode / Light Mode), language choice (English, Hindi, Punjabi), stored securely in client-side storage (`localStorage`).</li>
                </ul>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--primary-forest)', fontWeight: '700' }}>
                  🔒 Non-Disclosure Guarantee: We never sell, rent, monetize, or trade your personal data with third-party advertisers, data brokers, or marketing syndicates.
                </div>
              </div>

              {/* Section 3 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  3. Zero Financial Data Liability & Peer-to-Peer Payment Architecture
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Fresh Fetch maintains a zero-custody financial architecture to ensure total user data safety:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>No Banking Data Storage:</strong> We do NOT collect, process, store, or transmit credit card numbers, debit card details, CVVs, net banking credentials, or UPI PINs.</li>
                  <li><strong>Direct Settlement:</strong> 100% of financial settlements occur directly between the buyer and the producer via independent third-party UPI applications (Google Pay, PhonePe, Paytm, BHIM) or Cash on Delivery (COD) upon physical inspection.</li>
                  <li><strong>Zero Commission Platform:</strong> Fresh Fetch charges 0% commission from farmers, ensuring 100% fair earnings reach the producer and buyers enjoy honest prices.</li>
                  <li><strong>No Financial Intermediary Liability:</strong> Fresh Fetch is not a licensed banking entity or payment gateway and holds no liability for failed bank transfers, UPI network downtimes, or financial disputes between parties.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  4. Farmer & Producer Purity Standards & Code of Conduct
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Every producer listing items on Fresh Fetch warrants and agrees to the following non-negotiable community standards:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>100% Purity Guarantee:</strong> Products (A2 Vedic Bilona Ghee, Cold-Pressed Mustard Oil, Wild Forest Honey, Lakadong Haldi, Sharbati Atta) must be completely free from adulterants, chemical preservatives, palm oil, artificial colors, or synthetic essences.</li>
                  <li><strong>Authentic Traditional Methods:</strong> Claims of Vedic Bilona curd-churning, cold-press wood expeller (Kolhu), or stone-pounding must be genuine and verifiable.</li>
                  <li><strong>Accurate Shelf-Life & Dynamic Expiry:</strong> Farmers must state accurate preparation batch dates and realistic shelf-life estimates. Expired batches are automatically flagged by our smart freshness countdown and must be renewed only upon producing fresh stock.</li>
                  <li><strong>Professional WhatsApp Conduct:</strong> Farmers agree to respond promptly, honestly, and courteously to customer inquiries received on WhatsApp.</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  5. Buyer Rights, Verification & Fair Use Policies
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li><strong>Right to Physical Inspection:</strong> Buyers are encouraged to inspect packaging, batch seal, aroma, and consistency upon delivery/pickup before making final payment.</li>
                  <li><strong>Respectful Interaction:</strong> Our farmers are independent rural producers; respectful communication is required on WhatsApp.</li>
                  <li><strong>Strict Anti-Spam & Anti-Harassment:</strong> Placing fake orders, making non-serious inquiries, or harassing producers will result in immediate and permanent hardware/device banning from Fresh Fetch.</li>
                  <li><strong>Review Authenticity:</strong> Customer reviews must reflect genuine product experience without malicious intent.</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  6. Intermediary Status & Safe Harbor under Information Technology Act, 2000
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                  Fresh Fetch functions strictly as an electronic intermediary marketplace under <strong>Section 2(1)(w) and Section 79 of the Information Technology Act, 2000</strong> read with the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'grid', gap: '0.35rem' }}>
                  <li>Fresh Fetch does not initiate the transmission, select the receiver of the transmission, or modify the contents of the transaction between farmer and consumer.</li>
                  <li>Each independent farmer is solely responsible for product compliance, traditional preparation claims, food safety standards, and local delivery fulfillment.</li>
                  <li><strong>Notice & Takedown Protocol:</strong> Fresh Fetch maintains zero tolerance for adulteration or fraud. Upon receipt of valid notice or verified complaint, Fresh Fetch will expeditiously delist any offending product or deactivate violating user accounts within 24 hours.</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  7. Natural Agricultural Variations & Limitation of Liability
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  Pure, unadulterated farm produce naturally exhibits organic variations (such as pure raw honey crystallizing in winter cold, unrefined cold-pressed mustard oil having natural micro-sediment, or slight color variations in desi cow ghee due to seasonal fodder). These characteristics are natural indicators of chemical-free purity rather than defects.
                </p>
              </div>

              {/* Section 8 */}
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  8. User Rights, Profile Editing & Permanent Data Erasure
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '0.3rem' }}>
                  In accordance with the DPDP Act 2023, you retain the right to review, rectify, or edit your profile details, location, and profile photograph at any time via the "Edit Profile" feature in your app profile.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  You also have the right to request the complete and permanent erasure of your account, listings, and stored preferences by contacting our Grievance Officer on WhatsApp.
                </p>
              </div>

              {/* Section 9 - Grievance Redressal */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--card-border)' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--primary-forest)', fontSize: '1rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={18} />
                  <span>9. Grievance Redressal Officer & Legal Jurisdiction</span>
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021, the designated Grievance Officers for Fresh Fetch are:
                </p>
                <div style={{ display: 'grid', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                  <div><strong>Officers:</strong> Vipandeep Singh (Army Institute of Technology Pune) & Jashan</div>
                  <div><strong>Designation:</strong> Co-Founders & Chief Grievance Redressal Officers</div>
                  <div><strong>Entity:</strong> Fresh Fetch Technologies, Hanumangarh & Sri Ganganagar, Rajasthan</div>
                  <div>
                    <strong>Official WhatsApp Helpline: </strong>
                    <a href="https://wa.me/918107008156" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800', textDecoration: 'underline' }}>
                      +91 8107008156
                    </a>
                    <span> / </span>
                    <a href="https://wa.me/919511544399" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: '800', textDecoration: 'underline' }}>
                      +91 9511544399
                    </a>
                  </div>
                  <div><strong>Grievance Resolution SLA:</strong> Acknowledgment within 24 hours; complete investigation and resolution within 7 business days.</div>
                  <div><strong>Governing Law & Jurisdiction:</strong> Laws of the Republic of India; exclusive jurisdiction of competent courts in Hanumangarh & Sri Ganganagar, Rajasthan.</div>
                </div>
              </div>
            </div>
          )}

          {/* Accept / Close Button */}
          <button 
            className="btn-primary" 
            style={{ marginTop: '1.5rem', width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <CheckCircle2 size={18} />
            <span>
              {policyLang === 'hi' 
                ? 'मैंने सभी नियम एवं शर्तें पढ़ ली हैं व स्वीकार करता हूँ' 
                : policyLang === 'pa'
                ? 'ਮੈਂ ਸਾਰੇ ਨਿਯਮ ਪੜ੍ਹ ਲਏ ਹਨ ਅਤੇ ਸਵੀਕਾਰ ਕਰਦਾ ਹਾਂ'
                : 'I Have Reviewed & Accept Terms & Privacy Policy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
