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

  exec(`docker image ls -f reference=${kind}-${course}`, (err, stdout, stderr) => {
    if (err) {
      console.log(`error: ${err.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }

    const existingImg = stdout.includes(`${kind}-${course}`);
    if (!existingImg) {
      exec(
        `docker build -t ${kind}-${course} ${process.cwd()}/artifacts/${kind}/${course}`,
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
      console.log(`Using Cached Img: ${kind}-${course}`);
    }
  });

  // 2. Run the container
  exec(
    `docker run --rm --name ${kind}-${course}-${req.user} ${kind}-${course}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(`error: ${err.message}`);
      } else if (stderr) {
        console.log(`stderr: ${stderr}`);
      } else {
        console.log(stdout);

        res.status(200).write(stdout);
        res.end();
      }
    }
  );
  // after writing to a folder we can run docker container
  // const logs = await container.logs({
  //   follow: true,
  //   stdout: true,
  //   stderr: true,
  //   details: true,
  //   tail: 100,
  //   // timestamps: true,
  // });
});

export { ContainerRoutes };
