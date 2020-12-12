import { Layout, Dropdown, Menu, Avatar, Button } from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  CloseCircleOutlined,
  BugOutlined,
  IssuesCloseOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import './BasicLayout.less';
import { DrawerOpener } from './DrawerOpener';
import { useRouter } from 'next/router';

const { Header, Content, Footer } = Layout;

interface Props {
  chapters?: string[];
  children: React.ReactNode;
}

export function BasicLayout({ children, chapters }: Props) {
  const router = useRouter();
  const { query } = router;
  const actionMenu = (
    <Menu>
      <div></div>
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
        <div className="title">{query.course}</div>
        <div className="action">
          <Dropdown overlay={actionMenu} trigger={['click']}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content className="content">{children}</Content>
      <Footer className="footer" style={{ textAlign: 'center' }}>
        <DrawerOpener
          opener={({ show }) => {
            return (
              <div style={{ minWidth: 170, textAlign: 'left' }}>
                <Button onClick={show}>
                  <MenuFoldOutlined /> {query.chapter}
                </Button>
              </div>
            );
          }}
          footer={false}
          drawerProps={{
            closeIcon: <CloseCircleOutlined style={{ color: '#fff', fontSize: 16 }} />,
            title: <h3 style={{ color: '#fff' }}>Chapters</h3>,
            placement: 'left',
            headerStyle: { backgroundColor: '#26282c' },
            drawerStyle: { backgroundColor: '#26282c', color: '#fff' },
          }}
          content={({ hide }) => {
            return (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {chapters?.map((chapter, i) => {
                  return (
                    <li key={i} onClick={hide}>
                      <Link
                        href="/[kind]/[course]/[chapter]"
                        as={`/${query.kind}/${query.course}/${chapter}`}
                      >
                        <a>
                          {i + 1}. {chapter}
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            width: 380,
          }}
        >
          <Button
            disabled={chapters?.indexOf(query?.chapter as string) < 1}
            onClick={() => {
              router.push(
                '/[kind]/[course]/[chapter]',
                `/${query.kind}/${query.course}/${
                  chapters[chapters?.indexOf(query?.chapter as string) - 1]
                }`
              );
            }}
          >
            Back
          </Button>
          <span>
            {chapters?.indexOf(query?.chapter as string) + 1} / {chapters?.length}
          </span>
          <Button
            disabled={chapters?.indexOf(query?.chapter as string) >= chapters?.length - 1}
            onClick={() => {
              router.push(
                '/[kind]/[course]/[chapter]',
                `/${query.kind}/${query.course}/${
                  chapters[chapters?.indexOf(query?.chapter as string) + 1]
                }`
              );
            }}
            type="text"
            style={{ backgroundColor: '#FFD500' }}
          >
            {chapters?.indexOf(query?.chapter as string) >= chapters?.length - 1
              ? 'End course'
              : 'Next'}
          </Button>
        </div>
        <div>
          <BugOutlined /> Report a Bug
        </div>
      </Footer>
    </Layout>
  );
}
