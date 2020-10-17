import React from 'react';
import { useRouter } from 'next/router';
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import fs from 'fs';
import path from 'path';
import { getSortedPostsData } from '../../lib/posts';

export default function Blog({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <h1>{JSON.stringify(post, null, 2)}</h1>;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const paths = fileNames.map((filename) => {
    return { params: { id: filename.replace(/\.md$/, '') } };
  });

  return {
    paths,
    // better to be under false and build the app as necessary in a sever-less function
    // otherwise creates too many pages
    fallback: false,
  };
}

// This also gets called at build time
export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<{ post: { id: string; date: string; title: string } }>
> {
  const post = getSortedPostsData().find((post) => post.id === params.id);

  return {
    props: { post },
    revalidate: 1,
  };
}
