import React, { useState, SetStateAction, useRef, useEffect } from 'react';
import AceEditor from 'react-ace';
import { SyncOutlined, CopyOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Button, Tree, Dropdown } from 'antd';
import { useRouter } from 'next/router';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

const { DirectoryTree } = Tree;
interface Props {
  setCodeResult: React.Dispatch<SetStateAction<string>>;
  defaultCode: string;
}

export default function Editor({ setCodeResult, defaultCode }: Props) {
  const [code, setCode] = useState(defaultCode || '');
  const [running, setRunning] = useState(false);

  const [selectedItem, setSelectedItem] = useState('');
  const [fileTreeOpen, setFileTreeOpen] = useState(false);

  const { query } = useRouter();

  async function runCodeHandler() {
    const res = await fetch('http://localhost:5000/c/run', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...query, code }),
    });

    return res.text();
  }

  const treeData = [
    {
      title: 'entry',
      key: '0-0',
      children: [
        { title: 'index.js', key: '0-0-0', isLeaf: true },
        { title: 'import.js', key: '0-0-1', isLeaf: true },
      ],
    },
    {
      title: 'user',
      key: '0-1',
      children: [
        { title: 'index.js', key: '0-1-0', isLeaf: true },
        { title: 'import.js', key: '0-1-1', isLeaf: true },
      ],
    },
  ];

  const actionMenu = (
    <div className="file-tree">
      <DirectoryTree
        multiple
        defaultExpandAll
        onSelect={(keys, info) => {
          console.log(info.node.title);
          if (info.node.isLeaf) {
            setFileTreeOpen(false);
            setSelectedItem(`${info.node.title}`);
          }
        }}
        treeData={treeData}
      />
    </div>
  );

  return (
    <React.Fragment>
      <Dropdown
        overlayStyle={{ color: '#fff', minWidth: 180 }}
        overlay={actionMenu}
        trigger={['click']}
        visible={fileTreeOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button size="large" type="primary" onClick={() => setFileTreeOpen(!fileTreeOpen)}>
            {fileTreeOpen ? <FolderOpenOutlined /> : <FolderOutlined />}
          </Button>
          <h4 style={{ color: '#fff', margin: '0 0 0 10px' }}>{selectedItem}</h4>
        </div>
      </Dropdown>
      <AceEditor
        value={code}
        onChange={(value) => setCode(value)}
        mode="javascript"
        theme="tomorrow_night"
        // CSS id
        name="editor"
      />
      <div className="action-panel">
        <Button
          loading={running}
          onClick={async () => {
            setRunning(true);
            const res = await runCodeHandler();
            if (res) {
              setCodeResult(res);
            }
            setRunning(false);
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
