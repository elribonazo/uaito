import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AnimatedText } from '@/components/AnimatedText';

const ErrorPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.query.error) {
      setErrorMessage(decodeURIComponent(router.query.error as string));
    }
  }, [router.query]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <nav className="fixed z-40 top-4 w-full">
        <div className="flex items-center justify-between m-auto rounded-full p-2 transition bg-gray-800 w-11/12 lg:w-auto">
          <Link href="/" className="pl-4">
            <div className="flex gap-3 items-center">
              <Image
                src="/UAITO.png"
                alt="UAITO Logo"
                width={25}
                height={25}
                className="animate-subtle-bounce"
                priority
              />
              <span className="uppercase font-bold text-white tracking-wider text-[20px] -mb-[4px]">
                <AnimatedText />
              </span>
            </div>
          </Link>
        </div>
      </nav>
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-2xl mb-8">
          {errorMessage || 'An error occurred'}
        </p>
        <div className="mb-8">
          <AnimatedText />
        </div>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;