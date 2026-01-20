'use client';

import { PrivateRoute } from '@/components/global/PrivateRoute';
import { PostEditor } from '@/components/posts/PostEditor';
import { Header } from '@/components/layout/Header';

export default function CreatePostPage() {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <PostEditor />
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}