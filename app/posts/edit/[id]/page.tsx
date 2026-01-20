'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { PrivateRoute } from '@/components/global/PrivateRoute';
import { Header } from '@/components/layout/Header';
import { PostEditor } from '@/components/posts/PostEditor';
import { usePosts } from '@/hooks/usePosts';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const { getPostQuery } = usePosts();
    const { data: post, isLoading } = getPostQuery(postId);

    if (isLoading) {
        return (
            <PrivateRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">Loading post...</p>
                </div>
            </PrivateRoute>
        );
    }

    if (!post) {
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
                <main>
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <button
                            onClick={() => router.back()}
                            className="mb-6 inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <PostEditor
                            postId={postId}
                            initialData={{
                                title: post.title,
                                content: post.content,
                                category: post.category,
                                tags: post.tags,
                                published: post.published,
                            }}
                        />
                    </div>
                </main>
            </div>
        </PrivateRoute>
    );
}
