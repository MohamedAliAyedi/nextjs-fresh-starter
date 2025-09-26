'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPosts, Post } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Loader as Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function PostsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { selectedPost, setSelectedPost, toggleFavorite, isFavorite, favoriteIds } = useAppStore();

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', refreshKey],
    queryFn: fetchPosts,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-600">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading posts. Please try again.</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            API Demo
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            See React Query and Zustand in action with real API data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleRefresh} variant="outline" className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Badge variant="secondary" className="text-sm">
              Favorites: {favoriteIds.length}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts?.map((post: Post) => (
            <Card 
              key={post.id} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant={isFavorite(post.id) ? "default" : "ghost"}
                    className="ml-2 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(post.id);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${isFavorite(post.id) ? 'fill-current' : ''}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {post.body}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">ID: {post.id}</Badge>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPost && (
          <Card className="max-w-2xl mx-auto border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-blue-900">
                  Selected Post (Zustand State)
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {selectedPost.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {selectedPost.body}
              </p>
              <div className="flex items-center gap-4">
                <Badge>Post ID: {selectedPost.id}</Badge>
                <Badge variant="outline">User ID: {selectedPost.userId}</Badge>
                <Button
                  size="sm"
                  variant={isFavorite(selectedPost.id) ? "default" : "outline"}
                  onClick={() => toggleFavorite(selectedPost.id)}
                  className="ml-auto"
                >
                  <Heart 
                    className={`w-4 h-4 mr-2 ${isFavorite(selectedPost.id) ? 'fill-current' : ''}`} 
                  />
                  {isFavorite(selectedPost.id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}