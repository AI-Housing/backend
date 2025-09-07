import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { entities } from '../analyzer/entities';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'password'),
  database: configService.get<string>('DB_NAME', 'housing_db'),
  entities,
  synchronize: configService.get<string>('NODE_ENV') === 'development', // 운영환경에서는 false로 설정
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('NODE_ENV') === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  extra: {
    // Connection pool settings
    max: 20,
    min: 5,
    idle: 10000,
    acquire: 30000,
    evict: 1000,
  },
  // PostgreSQL specific options
  schema: 'public',
});