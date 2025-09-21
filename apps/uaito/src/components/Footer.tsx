import Link from 'next/link';
import Script from 'next/script';

const Footer: React.FC<{}> = props => (
  <footer className="bg-background text-primary-text py-6 z-10 relative border-t border-muted">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center space-x-6 mb-4">
        <Link href="/terms-and-conditions" className="text-sm text-secondary-text hover:text-primary-text transition-colors">
          Terms and Conditions
        </Link>
        <Link href="/privacy-policy" className="text-sm text-secondary-text hover:text-primary-text transition-colors">
          Privacy Policy
        </Link>
        <Link href="mailto:elribonazo@uaito.io" className="text-sm text-secondary-text hover:text-primary-text transition-colors">
          Contact
        </Link>
      </div>
      <p className="text-center text-sm text-accent mb-2">Empowering engineers with AI-driven solutions</p>
      <p className="text-center text-xs text-secondary-text">&copy; 2024 UAITO.io. All rights reserved.</p>
    </div>
  <Script id="visitor-script" strategy="afterInteractive">
    {`
      (function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
      vgo('setAccount', '255190599');
      vgo('setTrackByDefault', true);
      vgo('process');
    `}
  </Script>
</footer>
)

export default Footer