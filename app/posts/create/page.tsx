'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { PrivateRoute } from '@/components/global/PrivateRoute';
import { PostEditor } from '@/components/posts/PostEditor';
import { Header } from '@/components/layout/Header';

export default function CreatePostPage() {
  const router = useRouter();

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main>
          <div className="max-w-4xl mx-auto px-4 py-8">

            <button
              onClick={() => router.back()}
              className=" inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <PostEditor />
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
