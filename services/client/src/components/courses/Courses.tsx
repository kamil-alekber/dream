import { Row, Col, Input, Button } from 'antd';
import { LeftOutlined, ReloadOutlined, ReadOutlined } from '@ant-design/icons';
import { Editor } from '../EditorBrowser';
import { useEffect, useRef, useState } from 'react';
import { Doc } from '../../pages/[kind]/[course]/[chapter]';
import { useRouter } from 'next/router';

export function Courses({ doc, code }: { doc?: Doc; code: string }) {
  const router = useRouter();
  const query = router.query as Record<string, string>;
  const [codeResult, setCodeResult] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [codeResult]);

  return (
    <Row style={{ height: '100%' }}>
      {/* 24 slices */}
      <Col className="learn" xs={8} sm={8} md={8} lg={8} xl={8}>
        <div className="top-panel">
          <h3>
            <ReadOutlined /> Learn
          </h3>
        </div>
        <div className="instruction">
          <h2>{doc?.data?.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: doc?.content?.split('---')[1] || doc?.content }}
          ></div>
        </div>
      </Col>
      <Col className="code" xs={8} sm={8} md={8} lg={8} xl={8}>
        <Editor defaultCode={code} setCodeResult={setCodeResult} />
      </Col>
      <Col className="display" xs={8} sm={8} md={8} lg={8} xl={8}>
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
          {['css', 'html'].indexOf(query.kind) >= 0 ? (
            <div dangerouslySetInnerHTML={{ __html: codeResult }}></div>
          ) : (
            <pre>{codeResult}</pre>
          )}
          <div ref={scrollRef}></div>
        </div>
      </Col>
    </Row>
  );
}
