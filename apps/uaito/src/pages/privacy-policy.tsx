import React from 'react';
import SpaceBackground from '../components/SpaceBackground';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AnimatedText } from '@/components/AnimatedText';

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="min-h-screen relative bg-background text-secondary-text font-sans">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <Link href={"/"} className="block text-center p-10 text-primary-text font-bold py-4 px-10 text-lg hover:text-accent">
          go back to <AnimatedText />
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-center text-primary-text">Privacy Policy</h1>
        
        <div className="space-y-6 text-lg">
          <p>Last updated: August 15, 2024</p>
          <p>This Privacy Policy describes how UAITO.io ("we", "our", or "us") collects, uses, and shares your information when you use our service. By using UAITO.io, you agree to the collection and use of your information as described in this Privacy Policy.</p>
          
          <PolicySection title="1. Information We Collect">
            <p>1.1. Personal Information: We collect your email address, name, and profile information when you create an account using Google Sign-In.</p>
            <p>1.2. Usage Data: We collect information about how you interact with UAITO.io, including chat logs and usage patterns.</p>
          </PolicySection>
          
          <PolicySection title="2. How We Use Your Information">
            <p>2.1. To provide and improve our services.</p>
            <p>2.2. To personalize your experience and offer more relevant responses.</p>
            <p>2.3. To communicate with you about your account and our services.</p>
          </PolicySection>
          
          <PolicySection title="3. Google API Services User Data Policy">
            <p>3.1. Our use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-accent hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
            <p>3.2. We do not sell Google or any other third party user data or use it for advertising purposes.</p>
            <p>3.3. We do not allow humans to read Google user data unless:</p>
            <ul className="list-disc list-inside pl-5">
              <li>It is your fullname or email address</li>
            </ul>
          </PolicySection>
          
          <PolicySection title="4. Data Storage and Security">
            <p>4.1. We implement industry-standard security measures to protect your personal information.</p>
            <p>4.2. Your data, including that received from Google APIs, is encrypted and stored securely.</p>
            <p>4.3. We retain your data for as long as necessary to provide our services and comply with legal obligations.</p>
          </PolicySection>
          
          <PolicySection title="5. Data Sharing">
            <p>5.1. We do not sell your personal information to third parties.</p>
            <p>5.2. We may disclose your information if required by law or to protect our rights and the safety of our users.</p>
          </PolicySection>
          
          <PolicySection title="6. Your Rights and Choices">
            <p>6.1. You can access, update, or delete your personal information through your account settings.</p>
            <p>6.2. You can revoke our access to your Google data at any time through your Google Account settings or by contacting us.</p>
            <p>6.3. You have the right to request a copy of your personal data or ask for its deletion, subject to legal requirements.</p>
          </PolicySection>
          
          
          <PolicySection title="7. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through our application.</p>
          </PolicySection>
          
          <PolicySection title="8. Contact Us">
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <p>Email: elribonazo@uaito.io</p>
            <p>Address: C/Saragossa 78 3rd 2nd, 08006 Barcelona, Spain</p>
          </PolicySection>
          
          <p className="mt-8">This Privacy Policy is publicly accessible at https://uaito.io/privacy-policy. By using UAITO.io, you acknowledge that you have read and understood this Privacy Policy.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-text">{title}</h2>
    <div className="space-y-2">
      {children}
    </div>
  </section>
);

export default PrivacyPolicy;