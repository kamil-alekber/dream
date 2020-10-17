import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function index({ allPostsData }) {
  return (
    <ul style={{ listStyle: 'none' }}>
      {allPostsData.map(({ id, date, title }, i) => (
        <li key={id}>
          <span>
            {title}
            <br />
            {id}
            <br />
            {date}
          </span>
          <br />
          <Link href="/blogs/[id]" as={`/blogs/${id}`}>
            <a>Read more</a>
          </Link>
          <hr />
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
    revalidate: 1,
  };
}
