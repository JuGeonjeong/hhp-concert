import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 12307,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [`${__dirname}/../../domain/**/*.entity{.ts,.js}`],
  // timezone: '+09:00',
  charset: 'utf8mb4',
  logging: true,
  synchronize: false,
});
// console.log('MySQL DataSource 설정:', MysqlDataSource.options);
