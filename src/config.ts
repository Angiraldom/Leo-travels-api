import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => {
  return {
    database: {
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      db: process.env.MONGO_DB,
      cluster: process.env.MONGO_CLUSTER,
    },
    email: {
      username: process.env.EMAIL,
      password: process.env.EMAIL_PASSWORD,
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST
    },
    aws: {
      name: process.env.BUCKET_NAME,
      region: process.env.BUCKET_REGION,
      key: process.env.ACCESS_KEY,
      secret: process.env.SECRET_ACCESS_KEY,
    },
    redis: {
      url: process.env.REDIS_URL,
      host: process.env.REDISHOST,
      password: process.env.REDISPASSWORD,
      port: process.env.REDISPORT,
      user: process.env.REDISUSER,
    },
    appUrls: {
      urlLogin: process.env.URL_LOGIN,
      urlChangePassword: process.env.URL_CHANGE_PASSWORD,
      urlFreeClass: process.env.URL_FREE_CLASS
    },
    facebook: {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      pixelId: process.env.PIXEL_ID,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtSecretRecoverPassword: process.env.JWT_SECRET_RECOVER_PASSWORD,
  };
});
