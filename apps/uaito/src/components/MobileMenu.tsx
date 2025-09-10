
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const MobileMenu = ({ isOpen, onClose, acceptedTerms }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
            <div className="rounded-lg p-8 w-full max-w-md">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-4">
                    <ul className="space-y-4">
                        <li><Link href="#testimonials" className="text-neutral-200 hover:underline hover:text-neutral-600 block" onClick={onClose}>Testimonials</Link></li>
                        <li><Link href="#features" className="text-neutral-200 hover:underline hover:text-neutral-600 block" onClick={onClose}>Features</Link></li>
                        <li><Link href="#usecases" className="text-neutral-200 hover:underline hover:text-neutral-600 block" onClick={onClose}>Use cases</Link></li>
                        <li><Link href="#ourteam" className="text-neutral-200 hover:underline hover:text-neutral-600 block" onClick={onClose}>Our team</Link></li>
                    </ul>
                </nav>
                <div className="mt-6">
                    <Link href={"/dashboard"} className={`block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-green-500/50 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => !acceptedTerms && e.preventDefault()}>
                        Beta access
                    </Link>
                </div>
            </div>
        </div>
    );
};
