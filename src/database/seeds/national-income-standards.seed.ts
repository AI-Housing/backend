import { DataSource } from 'typeorm';
import { NationalIncomeStandard } from '../../analyzer/entities';

/**
 * 2024년 기준 전국 도시근로자 월평균소득 시드 데이터
 */
export async function seedNationalIncomeStandards(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(NationalIncomeStandard);

  const year = 2024;
  const incomeData = [
    // 1인 가구
    {
      householdSize: 1,
      standard100: 3803000, // 100%
      standard120: 4564000, // 120%
      standard130: 4944000, // 130%
      standard140: 5324000, // 140%
      standard200: 7606000, // 200%
    },
    // 2인 가구
    {
      householdSize: 2,
      standard100: 6295000,
      standard120: 7554000,
      standard130: 8184000,
      standard140: 8813000,
      standard200: 12590000,
    },
    // 3인 가구
    {
      householdSize: 3,
      standard100: 8088000,
      standard120: 9706000,
      standard130: 10514000,
      standard140: 11323000,
      standard200: 16176000,
    },
    // 4인 가구
    {
      householdSize: 4,
      standard100: 8881000,
      standard120: 10657000,
      standard130: 11545000,
      standard140: 12433000,
      standard200: 17762000,
    },
    // 5인 가구
    {
      householdSize: 5,
      standard100: 9674000,
      standard120: 11609000,
      standard130: 12576000,
      standard140: 13543000,
      standard200: 19348000,
    },
    // 6인 가구
    {
      householdSize: 6,
      standard100: 10467000,
      standard120: 12560000,
      standard130: 13607000,
      standard140: 14654000,
      standard200: 20934000,
    },
    // 7인 가구
    {
      householdSize: 7,
      standard100: 11260000,
      standard120: 13512000,
      standard130: 14638000,
      standard140: 15764000,
      standard200: 22520000,
    },
    // 8인 가구
    {
      householdSize: 8,
      standard100: 12053000,
      standard120: 14464000,
      standard130: 15669000,
      standard140: 16874000,
      standard200: 24106000,
    },
  ];

  for (const data of incomeData) {
    // 기존 데이터가 있는지 확인
    const existing = await repository.findOne({
      where: { year, householdSize: data.householdSize },
    });

    if (!existing) {
      const entity = repository.create({
        year,
        ...data,
      });
      await repository.save(entity);
      console.log(`Added income standard for ${data.householdSize} person household`);
    }
  }

  console.log('National income standards seeded successfully');
}

/**
 * 별도 실행 가능한 시드 스크립트
 */
export async function runSeed(dataSource: DataSource): Promise<void> {
  try {
    await seedNationalIncomeStandards(dataSource);
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}