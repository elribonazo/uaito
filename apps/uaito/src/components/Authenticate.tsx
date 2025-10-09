



import { signIn } from "next-auth/react";
import Link from 'next/link';
import { Logo } from './Logo';




const LoginButton = () => (
    <button
      type="button"
      onClick={() => signIn('keycloak')}
      className="flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full max-w-xs"
    >
      Sign in to the BETA
    </button>
  )
  
const Authenticate = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 z-10">
      <div className="max-w-5xl w-full bg-surface bg-opacity-90 p-8 rounded-xl shadow-2xl border border-muted">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-8">
          Login / Signup
        </h1>
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div className="md:w-1/2 md:pr-8 text-left">
            <p className="text-xl text-accent mb-4">
              Join UAITO and supercharge your development process!
            </p>
            <p className="text-lg text-secondary-text mb-4">
              With UAITO, you'll enjoy:
            </p>
            <ul className="list-disc list-inside text-secondary-text mb-6 space-y-2">
              <li>AI-powered code assistance</li>
              <li>Seamless project management</li>
              <li>Intelligent debugging support</li>
              <li>Automated documentation generation</li>
              <li>Cutting-edge development insights</li>
            </ul>
            <p className="text-lg text-accent mb-4">
              Sign up or log in to get started!
            </p>
          </div>
          <div className="md:w-1/2 md:pl-8 flex justify-center items-center">
            <Logo
              width={300}
              height={300}
              variant="large"
            />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <LoginButton />
          <Link href="/" className="text-primary-text hover:text-accent transition-colors">
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
  

  export default Authenticate