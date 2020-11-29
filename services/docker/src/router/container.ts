import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import { DockerService, Kind } from '../docker';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/info', async (req, res) => {
  const kind = req.body.kind;
  const userId = req.body.userId;
  if (!kind || !userId) return CustomResponse.badRequest(res);

  // get the userInfo
  const container = await DockerService.getUserContainer({
    userId,
    kind: kind as Kind,
  });

  return CustomResponse.ok(res, undefined, container);
});

router
  .route('/run')
  .get(async (req, res) => {
    const container = await DockerService.createContainer('dream-docker-img', 'js');

    const logs = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      details: false,
      tail: 10,
      timestamps: true,
    });

    logs.pipe(res);
  })
  .post(async (req, res) => {
    const code = req.body.code;
    const kind = req.body.kind;

    if (!code || !kind) return CustomResponse.badRequest(res);
    // TODO: pick up user from the session or token ???
    fs.writeFileSync(path.resolve(`${process.cwd()}/artifacts/${kind}/users`, 'index.js'), code);

    const container = await DockerService.createContainer('dream-docker-img', 'js');

    const logs = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      details: true,
      tail: 100,
      // timestamps: true,
    });

    return logs.pipe(res);
  });

export { router as ContainerRoutes };

// const form = new formidable.IncomingForm();
// form.parse(req, function (err, fields, files) {
//   const oldPath = files['file'].path;
//   const newPath = path.resolve(`${process.cwd()}/src/artifacts/files/`, files['file'].name);
//   const rawData = fs.readFileSync(oldPath);

//   fs.writeFile(newPath, rawData, function (err) {
//     if (err) console.log(err);

//     console.log(req.body);
//     return res.send('Successfully uploaded');
//   });
// });
