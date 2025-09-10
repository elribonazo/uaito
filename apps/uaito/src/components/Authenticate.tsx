



import { signIn } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';




const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
  
  const LoginButton = ({ provider, children }: { provider: string; children: React.ReactNode }) => (
    <button
      onClick={() => signIn('google')}
      className="flex items-center justify-center bg-white text-gray-700 font-bold py-2 px-4 rounded-full border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full max-w-xs"
    >
      <GoogleIcon />
      <span className="ml-3">Sign to the BETA with Google</span>
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
              Sign up or log in securely using your Google Account to get started!
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
          <LoginButton provider="google">
            Login/Sign in with Google
          </LoginButton>
          <Link href="/" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
  

  export default Authenticate