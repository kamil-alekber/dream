import { ENV } from './env';
import express from 'express';
import Docker from 'dockerode';
import path from 'path';

const app = express();

if (ENV.NODE_ENV !== 'prod') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

const docker = new Docker({
  port: ENV.DOCKER_PORT,
});

async function createImage() {
  const imageName = 'dream-docker-img';

  const listImages = await docker.listImages({ dangling: false });
  const existingImg = listImages.find((img) => img.RepoTags.includes(imageName + ':latest'));

  if (!existingImg) {
    const buildImageStream = await docker.buildImage(
      {
        context: path.resolve(process.cwd(), 'src/artifacts'),
        src: ['Dockerfile', 'files'],
      },
      { t: imageName }
    );

    const res = await new Promise((resolve, reject) => {
      docker.modem.followProgress(buildImageStream, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    console.log({ res });
  }

  return imageName;
}

async function createContainer() {
  const imageName = await createImage();

  const container = await docker.createContainer({
    Image: imageName,
    name: `docker-test-${+new Date()}`,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false,
  });

  return container;
}

app.get('/', (req, res) => res.status(200).json({ error: false, data: true, message: null }));
app.get('/run', async (req, res) => {
  const container = await createContainer();
  await container.start();

  const logs = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    details: false,
    tail: 50,
    timestamps: true,
  });
  logs.pipe(res);
  container.wait().then(() => container.remove());
});

app.listen(ENV.PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', '[+] 🚀 Sever is listening on:', `http://localhost:${ENV.PORT}`);
});
