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
            <nav className="fixed z-40 flex w-full items-center">
                <div className="relative flex w-full items-center justify-between bg-surface p-2 px-6">
                    <Link href="/" className="pl-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/UAITO.png"
                                alt="UAITO Logo"
                                width={25}
                                height={25}
                                className="animate-subtle-bounce"
                                priority
                            />
                            {isDesktop && (
                                <span className="uppercase font-bold text-primary-text tracking-wider text-xl">
                                    <AnimatedText />
                                </span>
                            )}
                        </div>
                    </Link>
                    {isDesktop ? (
                        <div className="hidden grow basis-0 justify-end lg:flex items-center gap-8">
                            <Link href="/docs" className="text-secondary-text hover:text-primary-text transition-colors">Docs</Link>
                            <Link 
                                href={"/dashboard"} 
                                className={`bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-base transition-all duration-300 ease-in-out transform hover:scale-105 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                onClick={(e) => !acceptedTerms && e.preventDefault()}
                            >
                                Beta access
                            </Link>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-secondary-text hover:text-primary-text">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </nav>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} acceptedTerms={acceptedTerms} />
        </>
    );
};
