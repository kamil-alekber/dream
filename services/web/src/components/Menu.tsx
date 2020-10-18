import React from 'react';
import { Menu } from 'antd';
import { ProfileOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function AppMenu() {
  const router = useRouter();
  console.log('Pathname:', router.pathname);

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
      <Menu.Item key="/" icon={<ProfileOutlined />}>
        <Link href="/">
          <a> Articles</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/blogs/[id]" icon={<TeamOutlined />}>
        <Link href="/blogs/[id]" as={`/blogs/hello`}>
          <a>Blog</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
