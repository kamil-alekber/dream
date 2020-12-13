import React, { useState, SetStateAction, useEffect } from 'react';
import AceEditor from 'react-ace';
import { SyncOutlined, CopyOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-emmet';
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';

import { parseQueryToURL } from '../../helpers';

function fallbackCopyTextToClipboard(text: string) {
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

async function copyTextToClipboard(text: string) {
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

interface Props {
  setCodeResult: React.Dispatch<SetStateAction<string>>;
  files: Record<string, string>;
}

export default function Editor({ setCodeResult, files }: Props) {
  const [running, setRunning] = useState(false);
  const [refreshToDefault, setRefreshToDefault] = useState(false);
  const [copying, setCopying] = useState(false);
  const router = useRouter();
  const query = router.query as Record<string, string>;
  const modeList = { js: 'javascript', py: 'python', css: 'css', html: 'html' };
  const defaultMode = modeList[Object?.keys(files)?.[0]?.split?.('.')?.[1]] || query.kind;
  const defaultFile = Object.keys(files)?.[0];
  const [modeFile, setModeFile] = useState({ mode: defaultMode, file: defaultFile });
  const [code, setCode] = useState(files[modeFile.file]);

  useEffect(() => {
    setCode(files[modeFile.file]);
  }, [query.chapter, refreshToDefault]);

  async function runCodeHandler() {
    const url =
      ['css', 'html'].indexOf(query.kind) >= 0
        ? 'http://localhost:5000/c/run/local'
        : 'http://localhost:5000/c/run';

    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...query, code }),
    });

    return res.text();
  }

  const { TabPane } = Tabs;

  return (
    <React.Fragment>
      <Tabs
        tabBarStyle={{ color: '#fff', paddingLeft: 10, marginBottom: 5 }}
        defaultActiveKey="0"
        onChange={(key) => {
          setCode(files[key]);
          setModeFile({ file: key, mode: key.split('.')[1] });
        }}
      >
        {Object.keys(files).map((fileName) => {
          return <TabPane tab={fileName} key={fileName} />;
        })}
      </Tabs>
      <AceEditor
        setOptions={{
          useElasticTabstops: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableEmmet: true,
          enableSnippets: true,
        }}
        wrapEnabled
        value={code}
        onChange={(value) => {
          setCode(value);
          files[modeFile.file] = value;
        }}
        mode={modeFile.mode}
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

            setTimeout(() => {
              setCodeResult(res);
              setRunning(false);
            }, 1000);
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
              title: 'Reset Workspace',
              content: 'Are you sure you want to restart? All of your code will be erased',
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

            setTimeout(() => {
              setCopying(false);
            }, 3000);
          }}
        >
          {copying ? (
            <React.Fragment>
              <FileDoneOutlined /> Copied to clipboard
            </React.Fragment>
          ) : (
            <CopyOutlined />
          )}
        </Button>
      </div>
    </React.Fragment>
  );
}
