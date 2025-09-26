import { HeroSection } from '@/components/hero-section';
import { PostsDemo } from '@/components/posts-demo';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PostsDemo />
    </main>
  );
}