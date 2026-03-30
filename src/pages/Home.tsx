import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { useFeed } from "@/hooks/use-posts";
import { useUser } from "@/hooks/use-auth";
import { PenLine, Loader2, BookOpen, Feather } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: user, isLoading: userLoading } = useUser();
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status 
  } = useFeed();
  
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flat() || [];

  return (
    <div className="min-h-screen notebook-page relative pb-24">
      <Navbar />

      {/* Book spine shadow on left */}
      <div className="fixed top-0 left-0 bottom-0 w-16 pointer-events-none z-40 hidden lg:block" style={{
        background: 'linear-gradient(to right, rgba(80, 55, 30, 0.06), transparent)',
      }} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 mt-8 pt-10 pb-16 relative z-10">
        {/* Decorative heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mt-2 mb-1" style={{ color: 'hsl(25, 35%, 18%)' }}>Your Feed</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-amber-800/15" />
            <BookOpen className="w-4 h-4 text-amber-800/25" />
            <div className="h-px w-12 bg-amber-800/15" />
          </div>
        </div>

        {status === 'pending' || userLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-800/40">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-display italic text-lg">Loading your feed...</p>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-20 leather-card rounded-xl p-8">
            <h2 className="text-xl font-display font-semibold mb-2" style={{ color: 'hsl(25, 35%, 18%)' }}>Could not load posts</h2>
            <p className="text-amber-800/50">Please check your connection to the server.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="text-center py-24 leather-card rounded-xl flex flex-col items-center justify-center border-dashed">
                <div className="w-16 h-16 bg-amber-800/8 rounded-full flex items-center justify-center mb-6">
                  <PenLine className="w-8 h-8 text-amber-800/30" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-3" style={{ color: 'hsl(25, 35%, 18%)' }}>No posts yet</h2>
                <p className="text-amber-800/45 mb-8 max-w-md">
                  The feed is looking a little empty. Be the first to share your thoughts with the world!
                </p>
                {user ? (
                  <Link href="/create-post">
                    <Button size="lg" className="wax-seal-btn rounded-md font-display tracking-wide">Write a Post</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="lg" className="wax-seal-btn rounded-md font-display tracking-wide">Log in to Post</Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                
                <div ref={ref} className="py-8 flex justify-center">
                  {isFetchingNextPage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-amber-800/30" />
                  ) : hasNextPage ? (
                    <p className="text-sm text-amber-800/35">Scroll for more</p>
                  ) : (
                    <div className="text-center">
                      <div className="journal-divider mb-4" />
                      <p className="text-sm text-amber-800/35 font-medium mt-6">You've reached the end!</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
