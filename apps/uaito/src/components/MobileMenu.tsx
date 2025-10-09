
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AnimatedText } from './AnimatedText';
import { Logo } from './Logo';

export const MobileMenu = ({ isOpen, onClose, acceptedTerms }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-20 z-50 w-full px-4">
            <div className="w-full bg-surface rounded-lg p-4 flex flex-col items-center space-y-4 relative border border-muted">
                <button onClick={onClose} type="button" className="text-secondary-text hover:text-primary-text absolute top-4 right-4">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <Link href="/" className="pl-4" onClick={onClose}>
                    <div className="flex gap-3 items-center">
                        <Logo
                            width={25}
                            height={25}
                            priority
                            variant="small"
                        />
                        <span className="uppercase font-bold text-primary-text tracking-wider text-xl">
                            <AnimatedText />
                        </span>
                    </div>
                </Link>
                <nav className="mt-4 w-full">
                    <ul className="flex flex-col items-center space-y-4 w-full">
                        <li><Link href="/docs" className="text-secondary-text hover:text-primary-text block text-lg" onClick={onClose}>Docs</Link></li>
                        <li className="w-full">
                            <Link 
                                href={"/dashboard"} 
                                className={`block w-full text-center bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                onClick={(e) => {if(!acceptedTerms) e.preventDefault(); onClose();}}
                            >
                                Beta access
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
