import { DataSource } from 'typeorm';
import Queue from 'src/domain/queue/domain/queue.entity';
import Payment from 'src/domain/payment/domain/entity/payment.entity';
import Concert from 'src/domain/concert/domain/entity/concert.entity';
import User from 'src/domain/user/domain/entity/user.entity';
import Seat from 'src/domain/concert/domain/entity/seat.entity';
import Point from 'src/domain/user/domain/entity/point.entity';
import * as dotenv from 'dotenv';
import Schedule from 'src/domain/concert/domain/entity/schedule.entity';

dotenv.config();
export const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 12307,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [Queue, Payment, Concert, User, Seat, Point, Schedule],
  // timezone: '+09:00',
  charset: 'utf8mb4',
  logging: true,
  synchronize: true,
});
// console.log('MySQL DataSource 설정:', MysqlDataSource.options);
