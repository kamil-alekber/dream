import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
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
            console.log(`error: ${err.message}`);
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          console.log(`Building Image: ${stdout}`);
        }
      );
    } else {
      console.log(`Using Cached Img: ${imageName}`);
    }
  });

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
        console.log(`error: ${err.message}`);
      } else if (stderr) {
        console.log(`stderr: ${stderr}`);
      } else {
        console.log('Running Docker Container:', name);
        res.status(200).write(stdout);
        res.end();
      }
    }
  );
});

export { ContainerRoutes };
