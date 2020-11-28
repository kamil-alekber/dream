import React, { useState, SetStateAction } from 'react';
import AceEditor from 'react-ace';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

interface Props {
  setCodeResult: React.Dispatch<SetStateAction<string>>;
}

export default function Editor({ setCodeResult }: Props) {
  const [code, setCode] = useState('const me = 123;');

  async function runCodeHandler() {
    const res = await fetch('http://localhost:5000/run', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    return res.text();
  }

  return (
    <React.Fragment>
      <AceEditor
        defaultValue={code}
        onChange={(value) => setCode(value)}
        mode="javascript"
        theme="tomorrow_night"
        // CSS id
        name="editor"
      />
      <div className="action-panel">
        <Button
          onClick={async () => {
            const res = await runCodeHandler();
            console.log({ res });
            if (res) {
              setCodeResult(res);
            }
          }}
          size="large"
          type="primary"
        >
          Run
        </Button>
        <Button size="large" type="link">
          <SyncOutlined />
        </Button>
        <Button size="large" type="link">
          <CopyOutlined />
        </Button>
      </div>
    </React.Fragment>
  );
}
