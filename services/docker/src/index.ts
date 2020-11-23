import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { DockerService } from './docker';
import { ENV } from './env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (ENV.NODE_ENV !== 'prod') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.get('/', (req, res) =>
  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'))
);

app.get('/run', async (req, res) => {
  const container = await DockerService.createContainer();

  const logs = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    details: false,
    tail: 10,
    timestamps: true,
  });

  logs.pipe(res);
});
// 201 created
// 202 accepted

app.post('/run', async (req, res) => {
  // const container = await DockerService.createContainer();

  // const logs = await container.logs({
  //   follow: true,
  //   stdout: true,
  //   stderr: true,
  //   details: false,
  //   tail: 10,
  //   timestamps: true,
  // });

  // logs.pipe(res);

  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const oldPath = files['file'].path;
    const newPath = path.resolve(`${process.cwd()}/src/artifacts/files/`, files['file'].name);
    const rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);

      console.log(req.body);
      return res.send('Successfully uploaded');
    });
  });
});

app.listen(ENV.PORT, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🚀 Sever is listening on:',
    `http://localhost:${ENV.PORT}`
  );
});
