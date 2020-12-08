import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const ContainerRoutes = Router();

ContainerRoutes.route('/run').post(async (req, res) => {
  const code = req.body.code;
  const kind = req.body.kind;
  const course = req.body.course;
  const chapter = req.body.chapter;

  if (!code || !kind || !course || !chapter) CustomResponse.badRequest(res);
  // TODO: pick up user from the session or token ???
  const coursePath = `${process.cwd()}/artifacts/${kind}/${course}/${chapter}`;
  const isExist = fs.existsSync(coursePath);
  if (!isExist) CustomResponse.badRequest(res, 'Course does not exist');

  const userCoursePath = `${coursePath}/users/${req.user}`;

  if (!fs.existsSync(userCoursePath)) {
    fs.mkdirSync(userCoursePath);
  }

  fs.writeFileSync(path.resolve(userCoursePath, 'index.js'), code);

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
        `docker build -t ${imageName}${process.cwd()}/artifacts/${kind}/${course}`,
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
  const mountVolume = `${process.cwd()}/artifacts/${kind}/${course}/${chapter}:/usr/src/app`;
  // TODO: change the main file
  const cmd = `node users/${req.user}/index.js`;
  // const cmd = 'ls -lha';
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
