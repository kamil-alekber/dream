import dotenv from 'dotenv';
import { mongoose } from '@typegoose/typegoose';

dotenv.config({
  path: require('path').resolve(
    process.cwd(),
    process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'
  ),
});

// iterate over properties and check if they exist
export class ENV {
  static NODE_ENV = process.env.NODE_ENV || 'dev';
  static PORT = parseInt(process.env.PORT || '5000');
  static MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dream';
  static JWT = process.env.JWT || '';
  static ARTIFACTS = process.env.ARTIFACTS || '';
}

(async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.warn('\x1b[32m%s\x1b[0m', '[+] 🏡 Connected to mongo on:', ENV.MONGO_URI);
  } catch (error) {
    console.error({ error });
  }
})();
