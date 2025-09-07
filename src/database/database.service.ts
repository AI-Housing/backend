import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { seedNationalIncomeStandards } from './seeds/national-income-standards.seed';
import { seedMasterData } from './seeds/master-data.seed';
import { seedSampleHousingApplications } from './seeds/sample-housing-applications.seed';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 개발 환경에서만 시드 데이터 자동 생성
    if (this.configService.get('NODE_ENV') === 'development') {
      await this.seedInitialData();
    }
  }

  /**
   * 초기 시드 데이터 생성
   */
  async seedInitialData(): Promise<void> {
    try {
      console.log('Starting database seeding...');
      
      // 1. 전국 소득기준 데이터 생성 (기본 데이터)
      console.log('Seeding national income standards...');
      await seedNationalIncomeStandards(this.dataSource);
      
      // 2. 마스터 데이터 생성 (공급유형, 조건 카테고리, 조건 템플릿)
      console.log('Seeding master data...');
      await seedMasterData(this.dataSource);
      
      // 3. 예시 청약공고 데이터 생성 (개발환경에서만)
      if (this.configService.get('NODE_ENV') === 'development') {
        console.log('Seeding sample housing applications...');
        await seedSampleHousingApplications(this.dataSource);
      }
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error during database seeding:', error);
      // 시드 데이터 생성 실패해도 애플리케이션은 계속 실행
    }
  }

  /**
   * 수동으로 시드 데이터 재생성
   */
  async reseedData(): Promise<void> {
    await this.seedInitialData();
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  /**
   * 데이터베이스 통계 정보 조회
   */
  async getDatabaseStats(): Promise<any> {
    try {
      const housingApplicationsCount = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM housing_applications'
      );
      
      const processedApplicationsCount = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM housing_applications WHERE processed = true'
      );
      
      const usersCount = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM users'
      );
      
      const matchingResultsCount = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM matching_results'
      );

      return {
        housingApplications: parseInt(housingApplicationsCount[0].count),
        processedApplications: parseInt(processedApplicationsCount[0].count),
        users: parseInt(usersCount[0].count),
        matchingResults: parseInt(matchingResultsCount[0].count),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        error: 'Failed to get database statistics',
        timestamp: new Date(),
      };
    }
  }
}