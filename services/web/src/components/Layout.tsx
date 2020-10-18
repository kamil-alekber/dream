import { Layout, PageHeader, Button } from 'antd';
import React from 'react';
import { BreadcrumbPanel } from './Breadcrumb/BreadcrumbPanel';
import './Layout.less';
import { AppMenu } from './Menu';

export function MainLayout({ children }: any) {
  const { Header, Content, Footer, Sider } = Layout;

  return (
    <>
      <PageHeader
        style={{
          zIndex: 2,
          position: 'fixed',
          width: '100%',
          background: '#fff',
          top: 0,
          left: 0,
          height: 65,
          boxShadow: '0px 1px 5px -1px rgba(0,0,0,0.75)',
        }}
        extra={[
          <Button key="1" type="primary">
            Login
          </Button>,
          <Button key="2">Register</Button>,
        ]}
        title={<BreadcrumbPanel />}
      />

      <Layout style={{ marginTop: 65 }}>
        <Sider
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <AppMenu />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200, minHeight: '100vh' }}>
          <Content style={{ margin: '24px 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            {new Date().getFullYear()}. Dream Web Client
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
