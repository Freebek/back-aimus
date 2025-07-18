import { registerAs } from '@nestjs/config';
import * as process from 'process';

export const CONFIG_APP_TOKEN = process.env.CONFIG_APP_TOKEN || 'app';
export const CONFIG_MONGO_DB_TOKEN = process.env.CONFIG_MONGO_DB_TOKEN || 'db';
export const CONFIG_MINIO_TOKEN = process.env.CONFIG_MINIO_TOKEN || 'minio';

export const appConfig = registerAs(
  CONFIG_APP_TOKEN,
  (): AppConfig => ({
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || 5000,
    cors_domains: process.env.CORS_DOMAINS || '*',
  }),
);

export const dbConfig = registerAs(
  CONFIG_MONGO_DB_TOKEN,
  (): DbConfig => ({
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/aimus',
  }),
);

export const minioConfig = registerAs(
  CONFIG_MINIO_TOKEN,
  (): MinioConfig => ({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true' || false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucketName: process.env.MINIO_BUCKET_NAME || 'bozorhub',
    publicUrl: process.env.MINIO_URL || 'http://localhost:9000',
    publicBucket: process.env.MINIO_PUBLIC_BUCKET || 'bozorhub',
  }),
);

export type AppConfig = {
  host: string;
  port: number;
  cors_domains: string;
};

export type DbConfig = {
  url: string;
};

export type MinioConfig = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  publicUrl: string;
  publicBucket: string;
};

export const ValidatorConfig = {
  transform: true,
  stopAtFirstError: true,
  whitelist: true,
};

export const JwtConfig = {
  secret: process.env.JWT_SECRET_KEY || 'secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '10d',
};
