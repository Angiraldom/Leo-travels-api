import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => {
  return {
    database: {
      // Hace referencia a los archivos '.env'
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      db: process.env.MONGO_DB,
      cluster: process.env.MONGO_CLUSTER,
    },
    email: {
      username: process.env.EMAIL,
      password: process.env.EMAIL_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
});
