import Loader from "@/components/Loader";
import Metatags from "@/components/Metatags";
import PostFeed from "@/components/PostFeed";
import { firestore, fromMillis, postToJSON } from "@/lib/firebase";
import Head from "next/head";
import { useState } from "react";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last?.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  return (
    <>
      <main>
        <Metatags
          title="Home Page"
          description="Get the latest posts blogs"
        />

        <div className="card card-info">
          <h2>BlogsKraft A Social Blogging Platform</h2>
          <p>Welcome! This app is built with Next.js and Firebase</p>
          <p>
            Sign up for an account, write posts, then ❤️ heart content created
            by other users.
          </p>
        </div>

        <PostFeed posts={posts} />

        {!loading && !postsEnd && (
          <button onClick={getMorePosts}>Load more</button>
        )}

        <Loader show={loading} />

        {postsEnd && "You have reached the end!"}
      </main>
    </>
  );
}
