import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    db: {
      host: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    rabbitmq: {
      urls: process.env.RABBITMQ_URL,
      queueUrls: process.env.RABBITMQ_QUEUE_URLS,
      queueStats: process.env.RABBITMQ_QUEUE_STATS
    },
    keySecret: process.env.JWT_SECRET,
    appUrl: process.env.APP_URL,
  };
});
