import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DocsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/docs/getting-started');
  }, [router]);
  return null;
}
