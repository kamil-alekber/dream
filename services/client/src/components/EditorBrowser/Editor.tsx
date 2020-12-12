import React, { useState, SetStateAction, useEffect } from 'react';
import AceEditor from 'react-ace';
import {
  SyncOutlined,
  CopyOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { Button, Tree, Dropdown, Modal, Spin, notification } from 'antd';
import { useRouter } from 'next/router';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import { parseQueryToURL } from '../../helpers';

const { DirectoryTree } = Tree;
interface Props {
  setCodeResult: React.Dispatch<SetStateAction<string>>;
  defaultCode: string;
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

async function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!');
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}

export default function Editor({ setCodeResult, defaultCode }: Props) {
  const [code, setCode] = useState(defaultCode);
  const [running, setRunning] = useState(false);
  const [refreshToDefault, setRefreshToDefault] = useState(false);
  const [copying, setCopying] = useState(false);

  const [selectedItem, setSelectedItem] = useState('');
  const [fileTreeOpen, setFileTreeOpen] = useState(false);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    setCode(defaultCode);
  }, [query.chapter, refreshToDefault]);

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

  const mode = {
    js: 'javascript',
    py: 'python',
  };

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
        mode={mode[`${query?.kind}`]}
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
        <Button
          size="large"
          type="link"
          onClick={async () => {
            Modal.warning({
              onOk: async () => {
                setRefreshToDefault(true);
                const url = parseQueryToURL('http://localhost:5000/default', query);
                const res = await fetch(url, { credentials: 'include' });
                const parsed = await res.json();

                router.push(
                  `/[kind]/[course]/[chapter]`,
                  `/${query.kind}/${query.course}/${query.chapter}`,
                  { shallow: false }
                );
                setTimeout(() => {
                  setRefreshToDefault(false);
                }, 600);

                console.log(parsed);
              },
              okCancel: true,
              centered: true,
              title: 'Refresh the content to the base file',
              content:
                'Are you sure to refresh the content to the base file. Your progress for the current chapter will be undone',
            });
          }}
        >
          {refreshToDefault ? <Spin /> : <SyncOutlined />}
        </Button>
        <Button
          size="large"
          type="link"
          onClick={async () => {
            if (copying) return;
            await copyTextToClipboard(code);
            setCopying(true);
            notification.info({
              onClose: () => {
                setCopying(false);
              },
              message: 'Copied to clipboard',
              placement: 'topRight',
              duration: 2,
            });
          }}
        >
          {copying ? <FileDoneOutlined /> : <CopyOutlined />}
        </Button>
      </div>
    </React.Fragment>
  );
}
