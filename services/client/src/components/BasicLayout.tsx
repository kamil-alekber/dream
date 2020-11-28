import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import './BasicLayout.less';

const { Header, Content, Footer } = Layout;

export function BasicLayout({ children }: { children: React.ReactNode }) {
  const actionMenu = (
    <Menu>
      <Menu.Item>
        <Link href="/account">
          <a>
            <UserOutlined /> Account
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="BasicLayout">
      <Header className="header">
        <div className="logo">
          <Link href="/">
            <a>Code Up</a>
          </Link>
        </div>
        <div className="title">Java Script</div>
        <div className="action">
          <Dropdown overlay={actionMenu} trigger={['click']}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content className="content">
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer className="footer" style={{ textAlign: 'center' }}>
        <p>2020. Code up</p>
      </Footer>
    </Layout>
  );
}
