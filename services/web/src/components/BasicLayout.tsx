import { Layout, Menu } from 'antd';
import './BasicLayout.less';

const { Header, Content, Footer } = Layout;

export function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="BasicLayout">
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
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
