'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchPosts } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import Pagination from '@/components/shared/Pagination';

export default function HomeClient({ user }: { user: any }) {
  const [posts, setPosts] = useState<any[]>([]);  // Store posts in state
  const [isNext, setIsNext] = useState(false);  // Store next page status
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? +searchParams.get('page') : 1;  // Get page number from search params

  useEffect(() => {
    // Fetch posts when the component is mounted
    async function fetchData() {
      const result = await fetchPosts(page, 30);  // Fetch posts based on current page
      setPosts(result.posts);  // Update posts in state
      setIsNext(result.isNext);  // Set next page status
    }
    
    fetchData();  // Call the async function
  }, [page]);  // Re-run when `page` changes

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user.id}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
            />
          ))
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={page}
        isNext={isNext}
      />
    </>
  );
}
