import { Row, Col } from 'antd';
import EditorBroswer from '../EditorBroswer';

export function Courses() {
  return (
    <Row>
      <Col className="learn" xs={1} sm={1} md={8} lg={8} xl={8}>
        <h1>Learn</h1>
      </Col>
      <Col className="code" xs={1} sm={1} md={8} lg={8} xl={8}>
        <h3>x index.html</h3>
        <div className="editor">
          <EditorBroswer />
        </div>
      </Col>
      <Col className="display" xs={1} sm={1} md={8} lg={8} xl={8}>
        Col
      </Col>
    </Row>
  );
}
