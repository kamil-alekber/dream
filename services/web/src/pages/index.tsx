import { Switch } from 'antd';
import React, { useState } from 'react';
import { Blog } from '../components/Blog/Blog';
import { Breadcrumb } from '../components/Breadcrumb';
import { getSortedPostsData } from '../lib/posts';

export default function index({ allPostsData }) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Breadcrumb title="Articles" />
      <Switch checked={!loading} onChange={() => setLoading(!loading)} />
      <Blog loading={loading} posts={allPostsData} />
    </>
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
