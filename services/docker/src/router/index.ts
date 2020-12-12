import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import { ContainerRoutes } from './container';
import fs from 'fs';
import { ENV } from '../helpers/env';

const appRoutes = Router();

appRoutes.get('/', (req, res) => {
  const kindList = fs.readdirSync(ENV.ARTIFACTS);

  const artifacts = {};

  for (const kind of kindList) {
    const kindFolder = `${ENV.ARTIFACTS}/${kind}`;
    const courseList = fs.readdirSync(kindFolder);

    for (const course of courseList) {
      const courseFolder = `${ENV.ARTIFACTS}/${kind}/${course}`;
      if (fs.statSync(courseFolder).isFile()) continue;

      let chapterList = fs.readdirSync(courseFolder);

      chapterList = chapterList.filter((chapter) => {
        return !fs.statSync(`${courseFolder}/${chapter}`).isFile();
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
  if (!kind || !course || !chapter) CustomResponse.badRequest(res);

  const courseFolder = `${ENV.ARTIFACTS}/${kind}/${course}`;
  const docFolder = `${courseFolder}/${chapter}/docs`;

  if (!fs.existsSync(docFolder)) {
    fs.mkdirSync(docFolder, { recursive: true });
    const str = `Artifact \"learn\" in docs for the course \"${course}\" in chapter \"${chapter}\" is not present. Generating default one.\n`;
    // write default file if it does not exist
    fs.writeFileSync(docFolder + '/learn.md', str);
    console.warn(str);
  }

  const doc = fs.readFileSync(docFolder + '/learn.md', 'utf8');

  const userFolder = `${courseFolder}/${chapter}/users-input/${req.user}`;
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });

    // copy files recursively from entry folder to a user
    const entryFolder = `${courseFolder}/${chapter}/entry`;
    // write default file if it does not exist
    if (!fs.existsSync(entryFolder)) {
      fs.mkdirSync(entryFolder, { recursive: true });
      const str = `Artifact \"default file\" in entry folder for \nthe course \"${course}\" \nin chapter \"${chapter}\" is not present. \nGenerating default one.\n`;
      // write default file if it does not exist
      fs.writeFileSync(entryFolder + '/index.' + kind, str);
      console.warn(str);
    }

    const entryFolderContent = fs.readdirSync(entryFolder);
    entryFolderContent.forEach((file) => {
      fs.copyFileSync(`${entryFolder}/${file}`, `${userFolder}/${file}`);
    });
  }
  // TODO: currently only reads first file
  const code = fs.readFileSync(`${userFolder}/${fs.readdirSync(userFolder)[0]}`, 'utf8');
  const chapters = fs.readdirSync(courseFolder).filter((chap) => {
    return !fs.statSync(`${courseFolder}/${chap}`).isFile();
  });
  return CustomResponse.ok(res, '', { code, doc, chapters });
});

appRoutes.use('/default', async (req, res) => {
  const { kind, course, chapter } = req.query;
  if (!kind || !course || !chapter) CustomResponse.badRequest(res);

  const srcFolder = `${ENV.ARTIFACTS}/${kind}/${course}/${chapter}/entry`;
  const destFolder = `${ENV.ARTIFACTS}/${kind}/${course}/${chapter}/users-input/${req.user}/${
    fs.readdirSync(srcFolder)[0]
  }`;
  fs.copyFileSync(`${srcFolder}/${fs.readdirSync(srcFolder)[0]}`, destFolder);
  CustomResponse.ok(res);
});

appRoutes.use('/c', ContainerRoutes);

export { appRoutes };
