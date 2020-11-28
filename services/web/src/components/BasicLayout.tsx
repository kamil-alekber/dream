import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import './BasicLayout.less';

const { Header, Content, Footer } = Layout;

export function BasicLayout({ children }: { children: React.ReactNode }) {
  const actionMenu = (
    <Menu>
      <Menu.Item key="0">
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
        <div className="logo">Code Up</div>
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
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}
