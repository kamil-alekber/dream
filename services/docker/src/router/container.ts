import { Router } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import { DockerService } from '../docker';
import fs from 'fs';
import path from 'path';

const router = Router();

router
  .route('/run')
  .get(async (req, res) => {
    const container = await DockerService.createContainer();

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
    if (!code) return CustomResponse.badRequest(res);

    fs.writeFileSync(path.resolve(`${process.cwd()}/src/artifacts/files/`, 'index.js'), code);

    const container = await DockerService.createContainer();

    const logs = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      details: true,
      tail: 100,
      // timestamps: true,
    });

    return logs.pipe(res);
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
  });

export { router as ContainerRoutes };