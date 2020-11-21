import dotenv from 'dotenv';
dotenv.config({
  path: require('path').resolve(
    process.cwd(),
    process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'
  ),
});

export class ENV {
  static NODE_ENV = process.env.NODE_ENV;
  static PORT = parseInt(process?.env?.PORT || '5000');
  static DOCKER_PORT = parseInt(process?.env?.DOCKER_PORT || '2375');
}
