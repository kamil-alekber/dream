import Docker from 'dockerode';
import path from 'path';
import { Containers } from './models/containers';
import { v4 as uuid4 } from 'uuid';
import { ENV } from './helpers/env';
import { Stream } from 'stream';

const docker = new Docker({
  port: ENV.DOCKER_PORT,
});

export type Kind = 'hmtl' | 'css' | 'js' | 'ts' | 'jsx';

export class DockerService {
  static docker = docker;
  static port = ENV.DOCKER_PORT;

  static async createImage(imageName: string, kind: Kind) {
    const listImages = await docker.listImages({ dangling: false });
    const existingImg = listImages.find((img) => img.RepoTags.includes(imageName + ':latest'));
    // const images = await dockerode.listImages({ filters: { reference: imageNamesArr } });

    if (!existingImg) {
      const buildImageStream = await docker.buildImage(
        {
          context: path.resolve(process.cwd(), 'artifacts', kind),
          // TODO: choose the folder of a specific user from token ???
          src: ['Dockerfile', 'entry', 'users', 'run.sh'],
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

  static async getUserContainer({ userId, kind }: { userId: string; kind: Kind }) {
    const existingContainer = await Containers.findOne({ userId, kind }, 'containerId');
    if (!existingContainer) return null;

    const container = docker.getContainer(existingContainer?.containerId);

    return container
      .stats()
      .then(async (_stats) => {
        const containerInfo = await container.inspect();
        return { container: containerInfo, status: 'Exists' };
      })
      .catch((err) => {
        if (err.statusCode !== 404) throw new Error(err);
        return { container: null, status: 'Not Found' };
      });
  }

  static async createContainer(imageName = 'dream-docker-img', kind: Kind) {
    const createdImageName = await DockerService.createImage(imageName, kind);

    let container;
    let existingContainer = await Containers.findOne({});
    const containerDocker = await DockerService.getUserContainer({
      userId: existingContainer?.userId || '',
      kind,
    });

    if (!containerDocker?.container) {
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
              `${process.cwd()}/artifacts/${kind}/entry:/usr/src/app/entry`,
              `${process.cwd()}/artifacts/${kind}/users:/usr/src/app/users:rw`,
            ],
          },
        });
        // provide real userId maybe remove even from here to decouple db logic
        await Containers?.updateOne(
          { userId: existingContainer?.userId },
          {
            containerId: container.id,
            userId: existingContainer?.userId || uuid4(),
            kind: existingContainer?.kind || kind,
          },
          { upsert: true }
        );
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

  static async imageExists(imageNames: string | string[]) {
    const imageNamesArr: string[] = typeof imageNames === 'string' ? [imageNames] : imageNames;
    const images = await docker.listImages({ filters: { reference: imageNamesArr } });
    return images.length > 0;
  }

  static async pullImageAsync(imageName: string): Promise<Docker.Image> {
    return new Promise(async (resolve, reject) => {
      const imageNameWithTag = imageName.indexOf(':') > 0 ? imageName : `${imageName}:latest`;

      if (await DockerService.imageExists(imageNameWithTag)) {
        return docker.getImage(imageNameWithTag);
      }

      docker.pull(imageNameWithTag, (pullError: any, stream: Stream) => {
        if (pullError) {
          reject(pullError);
        }
        if (!stream) {
          // throw new Error(`Image '${imageNameWithTag}' doesn't exists`);
          reject(`Image '${imageNameWithTag}' doesn't exists`);
        }

        docker.modem.followProgress(
          stream,
          (error: any, output: any) => {
            // onFinished
            if (error) {
              reject(error);
            }

            resolve(docker.getImage(imageNameWithTag));
          },
          (event: any) => {
            //TODO: check the event obj
            console.log('progress pulling img:', event);
          }
        );
      });

      return null;
    });
  }
}
