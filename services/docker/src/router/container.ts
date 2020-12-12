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
      if (stderr) {
        console.log(`Reference stderr: ${stderr}`);
      } else if (err) {
        console.log(`Reference error: ${err.message}`);
      }

      const existingImg = stdout.includes(imageName);

      if (!existingImg) {
        exec(
          `docker build --quiet --tag ${imageName} ${ENV.ARTIFACTS}/${kind}/${course}`,
          (err, stdout, stderr) => {
            if (stderr) {
              error = `[STDERR] Building Image: ${stderr}`;
              reject(error);
            } else if (err) {
              error = `[ERROR] Building Image: ${err.message}`;
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

  const userCoursePath = `${coursePath}/${chapter}/users-input/${req.user}`;

  fs.writeFileSync(
    path.resolve(userCoursePath, fs.readdirSync(userCoursePath)?.[0] || 'default.' + kind),
    code
  );

  // 2. Run the container
  const name = `${imageName}-${req.user}`;
  // read only mountVolume :ro
  const mountVolume = `${ENV.ARTIFACTS}/${kind}/${course}/${chapter}:/usr/src/app:ro`;
  const cmd = {
    js: `node users-input/${req.user}/index.js`,
    py: `python3 users-input/${req.user}/index.py`,
    debug: 'ls -lha',
  };

  exec(
    `docker run --rm --name ${name} -v ${mountVolume} ${imageName} ${cmd[kind] || cmd.debug}`,
    (err, stdout, stderr) => {
      // TODO: change error that is exposed to the client
      if (stderr) {
        error = `[ERROR] Running code: ${stderr}`;
      } else if (err) {
        error = `[ERROR] Running code: ${err.message}`;
      } else {
        console.log('[STDOUT] Running code:', name);
        res.status(200).write(stdout);
        res.end();
      }

      // TODO: Error from container might move from here in the future
      if (error) {
        console.error(error);
        res.status(500).send(error);
        res.end();
      }
    }
  );
});

ContainerRoutes.route('/run/local').post(async (req, res) => {
  const { code, kind, course, chapter } = req.body;
  if (!code || !kind || !course || !chapter) CustomResponse.badRequest(res);

  const coursePath = `${ENV.ARTIFACTS}/${kind}/${course}`;
  const userCoursePath = `${coursePath}/${chapter}/users-input/${req.user}`;

  fs.writeFileSync(
    path.resolve(userCoursePath, fs.readdirSync(userCoursePath)?.[0] || 'default.' + kind),
    code
  );

  res.status(200).write(code);
  res.end();
});

export { ContainerRoutes };
