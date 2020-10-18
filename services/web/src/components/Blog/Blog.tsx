import React from 'react';
import { Switch, Card, Skeleton, Avatar, Row, Col } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Blog.less';

export function Blog({ loading, posts }: { loading: boolean; posts: any[] }) {
  return (
    <Row gutter={24}>
      {posts.map(({ id, date, title }) => (
        <Col span={8}>
          <Card
            className="blog-container"
            key={id}
            style={{ minWidth: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <DeleteOutlined key="delete" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Card bordered={false}>
                <Card.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={title}
                  description={date}
                />
                <div style={{ textAlign: 'start', marginTop: 10 }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias aspernatur non
                  obcaecati aut? Quasi tenetur perspiciatis cum sint quas! Magni consequuntur
                  consectetur deserunt ipsam provident accusamus sint eveniet recusandae sapiente?
                </div>
              </Card>
            </Skeleton>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
