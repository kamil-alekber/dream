import { ENV } from './env';
import express from 'express';
import Docker from 'dockerode';
import path from 'path';
import { Containers } from './models/containers';
import { mongoose } from '@typegoose/typegoose';
import { v4 as uuid4 } from 'uuid';

(async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.warn('\x1b[32m%s\x1b[0m', '[+] 🏡 Connected to mongo on:', ENV.MONGO_URI);
  } catch (error) {
    console.error({ error });
  }
})();

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

  let container;
  let existingContainer = await Containers.findOne({}, 'containerId');
  console.log('found containers', { existingContainer });
  if (!existingContainer?.containerId) {
    container = await docker.createContainer({
      Image: imageName,
      name: `docker-test-${+new Date()}`,
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      OpenStdin: false,
      StdinOnce: false,
    });

    await Containers.create({ containerId: container.id, userId: uuid4() });
  }

  container = container ?? docker.getContainer(existingContainer?.containerId!);
  await container.start();
  return container;
}

app.get('/', (req, res) => res.status(200).json({ error: false, data: true, message: null }));
app.get('/run', async (req, res) => {
  const container = await createContainer();

  const logs = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    details: false,
    tail: 50,
    timestamps: true,
  });
  console.log(logs.pipe);
  logs.pipe(res);
  // container.wait().then(() => container.remove());
});

app.listen(ENV.PORT, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🚀 Sever is listening on:',
    `http://localhost:${ENV.PORT}`
  );
});
