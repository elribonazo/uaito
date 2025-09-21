import Link from 'next/link';
import Image from 'next/image';
import { AnimatedText } from './AnimatedText';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useThrottle } from '@/hooks/useThrottle';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { MobileMenu } from './MobileMenu';

export const Header: FC = () => {
    const [isDesktop, setIsDesktop] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const acceptedTerms = true;
    const handleResize = useThrottle(() => {
        setIsDesktop(window.innerWidth >= 1024);
    }, 200);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    return (
        <>
            <nav className="fixed z-40 top-4 flex h-20 w-full">
                <div className="relative flex items-center justify-between m-auto rounded-full p-2 transition bg-gray-900 w-full mx-10">
                    <Link href="/" className="pl-4">
                        <div className="flex gap-3 items-center">
                            <Image
                                src="/UAITO.png"
                                alt="UAITO Logo"
                                width={25}
                                height={0}
                                style={{ height: 'auto', width: '25px' }}
                                className="animate-subtle-bounce"
                                priority
                            />
                            {isDesktop && <span className="uppercase font-bold text-white tracking-wider text-[20px] -mb-[4px]">
                                <AnimatedText />
                            </span>}
                        </div>
                    </Link>
                    {isDesktop ? (
                        <div className="hidden grow basis-0 justify-end lg:flex items-center gap-8">
                            <Link href="/docs" className="text-neutral-200 hover:underline hover:text-neutral-600">Docs</Link>
                            <Link href={"/dashboard"} className={`bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-green-500/50 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => !acceptedTerms && e.preventDefault()}>
                                Beta access
                            </Link>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-neutral-200 hover:text-neutral-600">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </nav>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} acceptedTerms={acceptedTerms} />
        </>
    );
};
