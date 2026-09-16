import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SellerDashboard } from './components/SellerDashboard';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { BuyerChats } from './components/BuyerChats';
import { UserProfile } from './components/UserProfile';
import { BottomNav } from './components/BottomNav';
import { AboutModal } from './components/AboutModal';
import { AddProductModal } from './components/AddProductModal';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

function MainLayout() {
  const { currentUser, role, onboardingStep, activeTab } = useApp();

  // If user is not yet logged in or is in onboarding steps 1-4, show the step-by-step OnboardingFlow
  if (!currentUser || onboardingStep < 5) {
    return (
      <div className="app-container" style={{ paddingBottom: 0 }}>
        <OnboardingFlow />
        <AboutModal />
        <SettingsModal />
        <PrivacyPolicyModal />
        <AuthModal />
        {/* Invisible Firebase Phone Auth reCAPTCHA mount */}
        <div id="recaptcha-container"></div>
      </div>
    );
  }

  // Once onboarded/logged in, show full app with Header, Dashboard, Bottom Nav, and Footer
  return (
    <div className="app-container">
      {/* Invisible Firebase Phone Auth reCAPTCHA mount */}
      <div id="recaptcha-container"></div>

      {/* Navigation Header */}
      <Header />

      {/* Main Dashboard based on Tab & Role */}
      <main className="main-content">
        {activeTab === 'profile' ? (
          <UserProfile />
        ) : activeTab === 'chats' ? (
          <BuyerChats />
        ) : activeTab === 'marketplace' || activeTab === 'wishlist' ? (
          <BuyerMarketplace />
        ) : role === 'producer' || activeTab === 'listings' || activeTab === 'inquiries' ? (
          <SellerDashboard />
        ) : (
          <BuyerMarketplace />
        )}
      </main>

      {/* Modals */}
      <AboutModal />
      <AddProductModal />
      <SettingsModal />
      <PrivacyPolicyModal />
      <ChatModal />
      <AuthModal />

      {/* Footer - shown only in Profile section to keep Market, Listings and Leads clean and simple */}
      {activeTab === 'profile' && <Footer />}

      {/* Mobile-Native Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
