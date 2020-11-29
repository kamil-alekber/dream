import Docker from 'dockerode';
import path from 'path';
import { Containers } from './models/containers';
import { v4 as uuid4 } from 'uuid';
import { ENV } from './helpers/env';

const docker = new Docker({
  port: ENV.DOCKER_PORT,
});

type Kind = 'hmtl' | 'css' | 'js' | 'ts' | 'jsx';

export class DockerService {
  static docker = docker;
  static port = ENV.DOCKER_PORT;

  static async createImage(imageName: string, kind: Kind) {
    const listImages = await docker.listImages({ dangling: false });
    const existingImg = listImages.find((img) => img.RepoTags.includes(imageName + ':latest'));

    if (!existingImg) {
      const buildImageStream = await docker.buildImage(
        {
          context: path.resolve(process.cwd(), 'artifacts', kind),
          // TODO: choose the folder of a specific user from token ???
          src: ['Dockerfile', 'entry', 'users'],
        },
        { t: imageName }
      );

      const res = await new Promise((resolve, reject) => {
        docker.modem.followProgress(buildImageStream, (err: any, res: any) =>
          err ? reject(err) : resolve(res)
        );
      });

      console.log('[+] Creating image:', res);
    }

    return imageName;
  }

  static async createContainer(imageName = 'dream-docker-img', kind: Kind) {
    const createdImageName = await DockerService.createImage(imageName, kind);

    let container;
    let existingContainer = await Containers.findOne({}, 'containerId');

    if (!existingContainer?.containerId) {
      try {
        container = await docker.createContainer({
          Image: createdImageName,
          name: `docker-test-${kind}-${+new Date()}`,
          AttachStdin: false,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          OpenStdin: false,
          StdinOnce: false,
          HostConfig: {
            // :rw
            Binds: [
              `${process.cwd()}/artifacts/${kind}/entry:/usr/src/app/artifacts:r`,
              `${process.cwd()}/artifacts/${kind}/users:/usr/src/app/artifacts:rw`,
            ],
          },
        });
        // provide real userId maybe remove even from here to decouple db logic
        await Containers.create({ containerId: container.id, userId: uuid4() });
      } catch (error) {
        console.error(error);
      }
    }

    // TODO: can be old images removed from docker container registry, check if there is a container
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
