import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import { ENV } from '../helpers/env';

const ContainerRoutes = Router();
console.log('folder:');

ContainerRoutes.route('/run').post(async (req, res) => {
  const { code, kind, course, chapter } = req.body;

  if (!code || !kind || !course || !chapter) CustomResponse.badRequest(res);
  // TODO: pick up user from the session or token ???
  const coursePath = `${ENV.ARTIFACTS}/${kind}/${course}`;
  const isExist = fs.existsSync(coursePath);
  if (!isExist) CustomResponse.badRequest(res, 'Course does not exist');

  // exec() and spawn()
  // 1. create image if there is not
  const imageName = `${kind}-${course}`;
  let error = '';

  await new Promise((resolve, reject) => {
    exec(`docker image ls -f reference=${imageName}`, (err, stdout, stderr) => {
      if (err) {
        console.log(`error: ${err.message}`);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }

      const existingImg = stdout.includes(imageName);

      if (!existingImg) {
        exec(
          `docker build -t ${imageName} ${ENV.ARTIFACTS}/${kind}/${course}`,
          (err, stdout, stderr) => {
            if (err) {
              error = `[ERROR] Building Image: ${err.message}`;
              reject(error);
            } else if (!stderr.includes('DONE')) {
              error = `[STDERR] Building Image: ${stderr}`;
              reject(error);
            } else {
              const result = `[STDOUT] Building Image: ${stdout}`;
              resolve(result);
            }
          }
        );
      } else {
        const result = `[Cached] Using Cached Img: ${imageName}`;
        resolve(result);
      }
    });
  })
    .then(console.log)
    .catch(console.error);

  if (error) {
    res.status(500).send(error);
    res.end();
    return;
  }
  // 2. Run the container
  const name = `${imageName}-${req.user}`;
  const mountVolume = `${ENV.ARTIFACTS}/${kind}/${course}/${chapter}:/usr/src/app`;
  // TODO: only runs index js with the node
  const cmd = `node users-input/${req.user}/index.js`;
  // const cmd = 'ls -lha';

  // TODO: check if the image is bing build, else it will throw the error

  // Create the user specific folder and load the files in
  const userCoursePath = `${coursePath}/${chapter}/users-input/${req.user}`;
  if (!fs.existsSync(userCoursePath)) {
    fs.mkdirSync(userCoursePath, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(userCoursePath, fs.readdirSync(userCoursePath)?.[0] || 'default.' + kind),
    code
  );

  exec(
    `docker run --rm --name ${name} -v ${mountVolume} ${imageName} ${cmd}`,
    (err, stdout, stderr) => {
      if (err) {
        error = `[ERROR] Running container: ${err.message}`;
      } else if (stderr) {
        error = `[STDERR] Running container: ${stderr}`;
      } else {
        console.log('[STDOUT] Running Docker Container:', name);
        res.status(200).write(stdout);
        res.end();
      }

      // TODO: Error from container might move from here in the future
      if (error) {
        console.error(error);
        res.status(500).send(error);
        res.end();
        return;
      }
    }
  );
});

export { ContainerRoutes };
