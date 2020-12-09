import { O_SYMLINK } from 'constants';
import { Router } from 'express';
import path from 'path';
import { CustomResponse } from '../helpers/customResponse';
import { ContainerRoutes } from './container';
import { statSync, readdirSync, fstat, readFileSync } from 'fs';
const appRoutes = Router();

appRoutes.get('/', (req, res) => {
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

appRoutes.get('/artifacts', (req, res) => {
  const { kind, course, chapter } = req.query;
  if (chapter === 'worker-javascript.js') return CustomResponse.ok(res);
  const courseFolder = `${process.cwd()}/artifacts/${kind}/${course}`;
  const docFolder = `${courseFolder}/${chapter}/docs/learn.md`;

  const chapters = readdirSync(courseFolder).filter((chapter) => {
    return !statSync(`${courseFolder}/${chapter}`).isFile();
  });

  const doc = readFileSync(docFolder, 'utf8');
  // const
  return CustomResponse.ok(res, '', { doc, chapters });
});

appRoutes.use('/c', ContainerRoutes);

export { appRoutes };
