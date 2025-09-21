import React from 'react';
import SpaceBackground from '../components/SpaceBackground';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AnimatedText } from '@/components/AnimatedText';

const TermsAndConditions: React.FC = () => {
  return (
    <main className="min-h-screen relative bg-background text-secondary-text font-sans">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        
      <Link href={"/"} className="block text-center p-10 text-primary-text font-bold py-4 px-10 text-lg hover:text-accent">
      go back to <AnimatedText />
      </Link>
        <h1 className="text-4xl font-bold mb-8 text-center text-primary-text">Terms and Conditions</h1>
        
        <div className="space-y-6 text-lg">
          <p>Welcome to our application. By using our services, you agree to these terms and conditions.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">1. Account Creation and Authentication</h2>
          <p>1.1. We use Google OAuth for account authentication. By creating an account, you agree to provide accurate and complete information.</p>
          <p>1.2. Your Google account email will be used as your primary identifier in our application.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">2. Use of Personal Information</h2>
          <p>2.1. We collect and use your email address to provide and improve our services, send important notifications, and manage your account.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">3. Data Protection and Privacy</h2>
          <p>3.1. We are committed to protecting your personal information and will only use it as described in our Privacy Policy.</p>
          <p>3.2. By using our services, you consent to the collection and use of your information as outlined in our Privacy Policy.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">4. Termination of Services</h2>
          <p>4.1. We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">5. Changes to Terms</h2>
          <p>5.1. We may modify these Terms and Conditions at any time. We will notify you of any significant changes via email.</p>
          
          <p className="mt-8">By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
        </div>
      </div>
      <Footer />

    </main>
  );
}

export default TermsAndConditions;