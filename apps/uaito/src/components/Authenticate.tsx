



import { signIn } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';




const LoginButton = () => (
    <button
      type="button"
      onClick={() => signIn('keycloak')}
      className="flex items-center justify-center bg-white text-gray-700 font-bold py-2 px-4 rounded-full border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full max-w-xs"
    >
      Sign in to the BETA
    </button>
  )
  
const Authenticate = () => {
  return (
    <section className="relative  flex flex-col items-center justify-center text-center px-4 z-10">
      <div className="max-w-5xl w-full bg-black bg-opacity-50 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in-up">
          Login / Signup
        </h1>
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div className="md:w-1/2 md:pr-8 text-left">
            <p className="text-xl text-purple-300 mb-4 animate-fade-in-up">
              Join UAITO and supercharge your development process!
            </p>
            <p className="text-lg text-gray-300 mb-4">
              With UAITO, you'll enjoy:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>AI-powered code assistance</li>
              <li>Seamless project management</li>
              <li>Intelligent debugging support</li>
              <li>Automated documentation generation</li>
              <li>Cutting-edge development insights</li>
            </ul>
            <p className="text-lg text-purple-300 mb-4">
              Sign up or log in to get started!
            </p>
          </div>
          <div className="md:w-1/2 md:pl-8 flex justify-center items-center">
            <Image
              src="/UAITO.png"
              alt="UAITO"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <LoginButton />
          <Link href="/" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
  

  export default Authenticate