import { Layout } from 'antd';
import './BasicLayout.less';
const { Header, Footer, Content } = Layout;

interface Props {
  children: React.ReactNode;
}

export function BasicLayout({ children }: Props) {
  return (
    <Layout>
      <Header className="header">Header</Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
