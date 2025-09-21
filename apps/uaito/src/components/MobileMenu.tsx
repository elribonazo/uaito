
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedText } from './AnimatedText';

export const MobileMenu = ({ isOpen, onClose, acceptedTerms }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-24 z-50 w-full px-4">
            <div className="w-full bg-gray-800 rounded-lg p-4 flex flex-col items-center space-y-4 relative">
                <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700 absolute top-2 right-2">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <Link href="/" className="pl-4" onClick={onClose}>
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
                        <span className="uppercase font-bold text-white tracking-wider text-[20px] -mb-[4px]">
                            <AnimatedText />
                        </span>
                    </div>
                </Link>
                <nav className="mt-4 w-full">
                    <ul className="flex flex-col items-center space-y-4 w-full">
                        <li><Link href="/docs" className="text-neutral-200 hover:underline hover:text-neutral-600 block text-lg" onClick={onClose}>Docs</Link></li>
                        <li className="w-full">
                            <Link href={"/dashboard"} className={`block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-green-500/50 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => {if(!acceptedTerms) e.preventDefault(); onClose();}}>
                                Beta access
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
