import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header } from '@/components/Header'; 

const navigation = [
  { name: 'Getting Started', href: '/docs/getting-started' },
  { name: 'Agent', href: '/docs/agent' },
  { name: 'Providers', href: '/docs/providers' },
  { name: 'Models', href: '/docs/models' },
  { name: 'Message Spec', href: '/docs/message-spec' },
  { name: 'Tools', href: '/docs/tools' },
  { name: 'Streaming', href: '/docs/streaming' },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen text-primary-text">
        <Header />
        <div className="flex pt-24 max-w-7xl mx-auto">
            <aside className="w-64 flex-shrink-0 p-4">
                <nav className="space-y-2 sticky top-24">
                {navigation.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg ${
                        router.pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-secondary-text hover:bg-surface hover:text-primary-text'
                    }`}
                    >
                    {item.name}
                    </Link>
                ))}
                </nav>
            </aside>
            <main className="flex-1 p-8">
                <div className="prose prose-invert max-w-none">{children}</div>
            </main>
        </div>
    </div>
  );
}
