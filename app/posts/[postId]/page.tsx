'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Heart, MessageCircle, Clock } from 'lucide-react';
import { PrivateRoute } from '@/components/global/PrivateRoute';
import { Header } from '@/components/layout/Header';
import { useGetPostQuery } from '@/store/postSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ViewPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const { data: post, isLoading, isError } = useGetPostQuery(postId);

  if (isLoading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading post...</p>
        </div>
      </PrivateRoute>
    );
  }

  if (isError || !post) {
    return (
      <PrivateRoute>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Post not found</p>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap text-gray-500 dark:text-gray-400 text-sm">
              <span className="inline-flex items-center gap-1">
                <Eye size={16} /> {post.views}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart size={16} /> {post.likes}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle size={16} /> {post.commentsCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={16} /> {post.readTime} min read
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap mt-2">
              <span className="font-medium">Category: {post.category}</span>
              <span>Published: {post.published ? 'Yes' : 'No'}</span>
              <span>Featured: {post.featured ? 'Yes' : 'No'}</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <img
                src={post?.author?.avatar}
                alt={post?.author?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="text-gray-700 dark:text-gray-300 text-sm">
                <p>{post?.author?.name}</p>
                <p className="text-gray-400 dark:text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()} &bull; Updated {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 mt-4">{post.excerpt}</p>
          </div>

          <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
