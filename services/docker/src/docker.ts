import Docker from 'dockerode';
import path from 'path';
import { Containers } from './models/containers';
import { v4 as uuid4 } from 'uuid';
import { ENV } from './env';

const docker = new Docker({
  port: ENV.DOCKER_PORT,
});

export class DockerService {
  static docker = docker;
  static port = ENV.DOCKER_PORT;

  static async createImage() {
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

  static async createContainer() {
    const imageName = await DockerService.createImage();

    let container;
    let existingContainer = await Containers.findOne({}, 'containerId');

    if (!existingContainer?.containerId) {
      try {
        container = await docker.createContainer({
          Image: imageName,
          name: `docker-test-${+new Date()}`,
          AttachStdin: false,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          OpenStdin: false,
          StdinOnce: false,
          HostConfig: {
            Binds: [`${process.cwd()}/src/artifacts/files:/usr/src/app/files:rw`],
          },
        });
        await Containers.create({ containerId: container.id, userId: uuid4() });
      } catch (error) {
        console.log(error);
      }
    }

    container = container ?? docker.getContainer(existingContainer?.containerId!);

    // check if container exists
    // console.log(container.stats());
    const containerInfo = await container.inspect();
    if (!containerInfo.State.Running) {
      await container.start();
    }

    return container;
  }

  static stopContainers({ removeOnStop }: { removeOnStop: boolean }) {
    docker.listContainers((err, containers) => {
      containers?.forEach((containerInfo) => {
        const container = docker.getContainer(containerInfo.Id);
        container.stop();

        if (removeOnStop) {
          container.remove();
        }
      });
    });
  }
}
