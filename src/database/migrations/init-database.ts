import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class InitDatabase implements MigrationInterface {
  name = 'InitDatabase';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // schema.sql 파일 읽기
    const schemaPath = path.join(__dirname, '../../analyzer/database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // 스키마를 개별 명령어로 분할하여 실행
    const commands = schemaSQL
      .split(';')
      .filter(cmd => cmd.trim().length > 0)
      .map(cmd => cmd.trim());

    for (const command of commands) {
      if (command) {
        await queryRunner.query(command);
      }
    }

    // indexes.sql 파일 읽기 (인덱스 및 트리거 등)
    const indexesPath = path.join(__dirname, '../../analyzer/database/indexes.sql');
    if (fs.existsSync(indexesPath)) {
      const indexesSQL = fs.readFileSync(indexesPath, 'utf8');
      
      const indexCommands = indexesSQL
        .split(';')
        .filter(cmd => cmd.trim().length > 0)
        .map(cmd => cmd.trim());

      for (const command of indexCommands) {
        if (command && !command.includes('CREATE TABLE')) {
          try {
            await queryRunner.query(command);
          } catch (error) {
            console.warn(`Warning: Could not execute index command: ${command.substring(0, 50)}...`);
            console.warn('Error:', error.message);
          }
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 테이블 삭제 (역순으로)
    const tables = [
      'priority_scores',
      'supply_type_qualifications',
      'matching_results',
      'user_subscription_accounts',
      'user_qualifications',
      'users',
      'national_income_standards',
      'regional_priorities',
      'asset_standards',
      'income_standards',
      'subscription_requirements',
      'supply_types',
      'housing_applications',
    ];

    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    // 함수 삭제
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE`);
  }
}