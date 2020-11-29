import { Row, Col, Input, Button } from 'antd';
import { LeftOutlined, ReloadOutlined, ReadOutlined } from '@ant-design/icons';
import EditorBroswer from '../EditorBroswer';
import { useEffect, useRef, useState } from 'react';

export function Courses() {
  const [codeResult, setCodeResult] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [codeResult]);

  return (
    <Row>
      <Col className="learn" xs={1} sm={1} md={8} lg={8} xl={8}>
        <div className="top-panel">
          <h3>
            <ReadOutlined /> Learn
          </h3>
        </div>
        <div className="instruction">
          <h2>Changing Variables</h2>
          <p>
            This line creates a message variable and stores the Change the message! text in it.
            Later in the program, message is used to reference that text inside drawName(), meaning
            that the message text appears on the screen
          </p>
        </div>
      </Col>
      <Col className="code" xs={1} sm={1} md={8} lg={8} xl={8}>
        <EditorBroswer setCodeResult={setCodeResult} />
      </Col>
      <Col className="display" xs={1} sm={1} md={8} lg={8} xl={8}>
        <div className="search-panel">
          <Button>
            <LeftOutlined />
          </Button>
          <Button>
            <ReloadOutlined />
          </Button>
          <Input
            defaultValue="http://localhost:3000"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                console.log('submit');
              }
            }}
          />
        </div>
        <div className="code-result">
          <pre>{codeResult}</pre>
          <div ref={scrollRef}></div>
        </div>
      </Col>
    </Row>
  );
}
