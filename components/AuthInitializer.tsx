'use client';

import { useInitializeAuth } from '@/hooks/useInitializeAuth';

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitializeAuth();
  return <>{children}</>;
}
