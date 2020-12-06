const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser'); // require cookie-parser

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cookieParser());

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.warn('\x1b[32m%s\x1b[0m', '[+] 👀 Client is listening on', `${process.env.HOST}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
