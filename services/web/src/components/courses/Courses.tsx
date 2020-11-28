import { Row, Col, Input, Button } from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import EditorBroswer from '../EditorBroswer';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';

export function Courses() {
  return (
    <Row>
      <Col className="learn" xs={1} sm={1} md={8} lg={8} xl={8}>
        <h3>Learn</h3>
      </Col>
      <Col className="code" xs={1} sm={1} md={8} lg={8} xl={8}>
        <div className="window-panel">
          <h3>index.js</h3>
        </div>
        <EditorBroswer />
        <div className="action-panel">
          <Button type="primary">Run</Button>
          <Button type="link">
            <SyncOutlined />
          </Button>
          <Button type="link">
            <CopyOutlined />
          </Button>
        </div>
      </Col>
      <Col className="display" xs={1} sm={1} md={8} lg={8} xl={8}>
        <div className="search-panel">
          <Button>
            <LeftOutlined />
          </Button>
          <Button>
            <ReloadOutlined />
          </Button>
          <Input />
        </div>
        Col
      </Col>
    </Row>
  );
}
