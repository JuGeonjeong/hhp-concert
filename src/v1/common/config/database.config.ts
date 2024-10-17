import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  logging: configService.get<string>('NODE_ENV') !== 'production',
  timezone: '+09:00',
  charset: 'utf8mb4',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  autoLoadEntities: true,
  synchronize: true,
});
