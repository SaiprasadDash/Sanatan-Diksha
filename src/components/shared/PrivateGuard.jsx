'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function PrivateGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/');
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <div></div>;
  if (!isAuthenticated) return null;
  return children;
}
