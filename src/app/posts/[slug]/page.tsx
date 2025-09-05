'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Calendar, User, Tag, MessageCircle, Send, Edit, ArrowLeft } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${params.slug}`);
      const data = await response.json();

      if (response.ok) {
        setPost(data.post);
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/404');
    }
  }, [params.slug, router]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${params.slug}/comments`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [params.slug, fetchPost, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/posts/${params.slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments([data.comment, ...comments]);
        setCommentText('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                {session && session.user.id === post.author._id && (
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-800 border border-green-200 rounded-md hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>By {post.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time>{formatDate(post.createdAt)}</time>
                </div>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Post Content */}
            <div className="prose max-w-none">
              <div className="text-gray-800 text-lg leading-relaxed">
                {formatContent(post.content)}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-5 w-5 mr-2 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            {session ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your comment..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign in
                  </Link>
                  {' '}to post a comment.
                </p>
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.author.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
