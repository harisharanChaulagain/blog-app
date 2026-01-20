'use client';

import { PrivateRoute } from '@/components/global/PrivateRoute';
import { PostList } from '@/components/posts/PostList';
import { Header } from '@/components/layout/Header';

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main>
          <PostList />
        </main>
      </div>
    </PrivateRoute>
  );
}