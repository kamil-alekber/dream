import React, { useState, SetStateAction } from 'react';
import AceEditor from 'react-ace';
import {
  SyncOutlined,
  CopyOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, Tree, Dropdown, Tabs } from 'antd';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

const { DirectoryTree } = Tree;
const { TabPane } = Tabs;
interface Props {
  setCodeResult: React.Dispatch<SetStateAction<string>>;
}

export default function Editor({ setCodeResult }: Props) {
  const [code, setCode] = useState('const me = 123;');
  const [selectedItem, setSelectedItem] = useState('');
  const [fileTreeOpen, setFileTreeOpen] = useState(false);

  async function runCodeHandler() {
    const res = await fetch('http://localhost:5000/run', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
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
          <Button type="primary" onClick={() => setFileTreeOpen(!fileTreeOpen)}>
            {fileTreeOpen ? <FolderOpenOutlined /> : <FolderOutlined />}
          </Button>
          <h4 style={{ color: '#fff', margin: '0 0 0 10px' }}>{selectedItem}</h4>
        </div>
      </Dropdown>
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
