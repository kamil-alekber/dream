import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

export default function Editor() {
  const [code, setCode] = useState('hello world');
  function onChange(newValue) {
    // console.log('change', newValue);
  }

  function runCodeHandler() {
    console.log();
  }

  return (
    <AceEditor
      onChange={(value) => setCode(value)}
      mode="javascript"
      theme="tomorrow_night"
      // CSS id
      name="editor"
    />
  );
}
