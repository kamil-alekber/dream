import { O_SYMLINK } from 'constants';
import { Router } from 'express';
import path from 'path';
import { CustomResponse } from '../helpers/customResponse';
import { ContainerRoutes } from './container';
import { statSync, readdirSync } from 'fs';

const appRoutes = Router();

appRoutes.get('/', (req, res) => {
  console.log('inside /', req.user);
  const artifactsFolder = `${process.cwd()}/artifacts`;
  const kindList = readdirSync(artifactsFolder);

  const artifacts = {};

  for (const kind of kindList) {
    const kindFolder = `${artifactsFolder}/${kind}`;
    const courseList = readdirSync(kindFolder);

    for (const course of courseList) {
      const courseFolder = `${artifactsFolder}/${kind}/${course}`;
      if (statSync(courseFolder).isFile()) continue;

      let chapterList = readdirSync(courseFolder);

      chapterList = chapterList.filter((chapter) => {
        return !statSync(`${courseFolder}/${chapter}`).isFile();
      });

      if (artifacts[kind]?.length > 0) {
        artifacts[kind].push({ [course]: chapterList });
      } else {
        artifacts[kind] = [{ [course]: chapterList }];
      }
    }
  }

  CustomResponse.ok(res, '', { artifacts });
});

appRoutes.use('/c', ContainerRoutes);

export { appRoutes };
