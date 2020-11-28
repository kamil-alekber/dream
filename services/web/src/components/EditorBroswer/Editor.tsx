import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

export default function Editor() {
  function onChange(newValue) {
    // console.log('change', newValue);
  }

  return (
    <AceEditor
      mode="javascript"
      theme="tomorrow_night"
      // onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
    />
  );
}
