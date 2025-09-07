import { DataSource } from 'typeorm';
import {
  HousingApplication,
  HousingType,
  ProcessingStatus,
  SupplyType,
  SupplySubcategory,
  ConditionTemplate,
  SupplyTypeCondition,
  ConditionType,
  IncomeStandard,
  StandardType,
  AssetStandard,
  SubscriptionRequirement,
  RegionalPriority,
} from '../../analyzer/entities';

/**
 * 예시 청약공고 데이터 시드
 */
export async function seedSampleHousingApplications(dataSource: DataSource): Promise<void> {
  console.log('Starting sample housing applications seeding...');

  try {
    // 1. 예시 청약공고 3개 생성
    await createSampleHousingApplication1(dataSource);
    await createSampleHousingApplication2(dataSource);
    await createSampleHousingApplication3(dataSource);

    console.log('Sample housing applications seeding completed successfully');
  } catch (error) {
    console.error('Error during sample housing applications seeding:', error);
    throw error;
  }
}

/**
 * 예시 1: 서울 강남구 공공분양 아파트
 */
async function createSampleHousingApplication1(dataSource: DataSource): Promise<void> {
  const housingRepo = dataSource.getRepository(HousingApplication);

  // 기존 데이터 확인
  const existing = await housingRepo.findOne({
    where: { title: '서울 강남구 래미안 강남포레 공공분양' },
  });

  if (existing) return;

  // 청약공고 생성
  const housing = housingRepo.create({
    title: '서울 강남구 래미안 강남포레 공공분양',
    announcementDate: new Date('2024-03-01'),
    applicationStartDate: new Date('2024-03-15'),
    applicationEndDate: new Date('2024-03-19'),
    winnerAnnouncementDate: new Date('2024-03-25'),
    contractDate: new Date('2024-04-05'),
    location: '서울특별시 강남구 역삼동 123-45',
    housingType: HousingType.PUBLIC_SALE,
    developer: 'LH공사',
    totalUnits: 300,
    processed: true,
    processingStatus: ProcessingStatus.COMPLETED,
  });

  const savedHousing = await housingRepo.save(housing);

  // 지역 우선공급 생성
  await createRegionalPriority(dataSource, savedHousing.id, 50, 30, 20);

  // 공급유형들 생성
  await createSupplyTypes1(dataSource, savedHousing.id);

  console.log('Created sample housing application 1: 서울 강남구 래미안 강남포레');
}

/**
 * 예시 2: 인천 부평구 신혼부부 특화 아파트
 */
async function createSampleHousingApplication2(dataSource: DataSource): Promise<void> {
  const housingRepo = dataSource.getRepository(HousingApplication);

  const existing = await housingRepo.findOne({
    where: { title: '인천 부평구 힐스테이트 신혼부부 특화단지' },
  });

  if (existing) return;

  const housing = housingRepo.create({
    title: '인천 부평구 힐스테이트 신혼부부 특화단지',
    announcementDate: new Date('2024-02-15'),
    applicationStartDate: new Date('2024-03-01'),
    applicationEndDate: new Date('2024-03-05'),
    winnerAnnouncementDate: new Date('2024-03-12'),
    contractDate: new Date('2024-03-20'),
    location: '인천광역시 부평구 부평동 567-89',
    housingType: HousingType.PRIVATE_SALE,
    developer: '현대건설',
    totalUnits: 480,
    processed: true,
    processingStatus: ProcessingStatus.COMPLETED,
  });

  const savedHousing = await housingRepo.save(housing);

  await createRegionalPriority(dataSource, savedHousing.id, 40, 35, 25);
  await createSupplyTypes2(dataSource, savedHousing.id);

  console.log('Created sample housing application 2: 인천 부평구 힐스테이트');
}

/**
 * 예시 3: 경기도 성남시 다자녀가구 우대 아파트
 */
async function createSampleHousingApplication3(dataSource: DataSource): Promise<void> {
  const housingRepo = dataSource.getRepository(HousingApplication);

  const existing = await housingRepo.findOne({
    where: { title: '성남 판교 자이 다자녀 우대단지' },
  });

  if (existing) return;

  const housing = housingRepo.create({
    title: '성남 판교 자이 다자녀 우대단지',
    announcementDate: new Date('2024-04-01'),
    applicationStartDate: new Date('2024-04-15'),
    applicationEndDate: new Date('2024-04-19'),
    winnerAnnouncementDate: new Date('2024-04-25'),
    contractDate: new Date('2024-05-10'),
    location: '경기도 성남시 분당구 판교동 321-12',
    housingType: HousingType.PUBLIC_SALE,
    developer: 'GS건설',
    totalUnits: 680,
    processed: true,
    processingStatus: ProcessingStatus.COMPLETED,
  });

  const savedHousing = await housingRepo.save(housing);

  await createRegionalPriority(dataSource, savedHousing.id, 30, 50, 20);
  await createSupplyTypes3(dataSource, savedHousing.id);

  console.log('Created sample housing application 3: 성남 판교 자이');
}

/**
 * 지역 우선공급 생성
 */
async function createRegionalPriority(
  dataSource: DataSource,
  housingId: number,
  localCity: number,
  localProvince: number,
  others: number
): Promise<void> {
  const repo = dataSource.getRepository(RegionalPriority);
  
  const entity = repo.create({
    housingApplicationId: housingId,
    localCityRatio: localCity,
    localProvinceRatio: localProvince,
    otherRegionRatio: others,
  });

  await repo.save(entity);
}

/**
 * 예시 1의 공급유형들 생성
 */
async function createSupplyTypes1(dataSource: DataSource, housingId: number): Promise<void> {
  const subcategoryRepo = dataSource.getRepository(SupplySubcategory);
  const supplyTypeRepo = dataSource.getRepository(SupplyType);

  // 신혼부부 특별공급 (90세대)
  const newlywedSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'NEWLYWED' } });
  if (newlywedSubcat) {
    const newlywedSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: newlywedSubcat.id,
      units: 90,
    });
    const savedNewlywed = await supplyTypeRepo.save(newlywedSupply);

    // 신혼부부 특별공급 조건들
    await createSupplyTypeConditions(dataSource, savedNewlywed.id, [
      'MARRIED',
      'MARRIED_WITHIN_7_YEARS',
      'NO_HOUSE_OWNER',
      'SUBSCRIPTION_6_MONTHS',
    ]);

    // 소득기준
    await createIncomeStandards(dataSource, savedNewlywed.id, [
      { type: StandardType.PRIORITY, percentage: 130, ratio: 70 },
      { type: StandardType.GENERAL, percentage: 140, ratio: 20 },
      { type: StandardType.LOTTERY, percentage: 160, ratio: 10 },
    ]);

    // 자산기준
    await createAssetStandards(dataSource, savedNewlywed.id, {
      maxRealEstate: 328000000,
      maxVehicle: 37080000,
      maxFinancialAssets: 68940000,
    });
  }

  // 생애최초 특별공급 (60세대)
  const firstTimeSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'FIRST_TIME' } });
  if (firstTimeSubcat) {
    const firstTimeSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: firstTimeSubcat.id,
      units: 60,
    });
    const savedFirstTime = await supplyTypeRepo.save(firstTimeSupply);

    await createSupplyTypeConditions(dataSource, savedFirstTime.id, [
      'NO_HOUSE_OWNER',
      'SUBSCRIPTION_2_YEARS',
      'DEPOSIT_24_TIMES',
    ]);

    await createIncomeStandards(dataSource, savedFirstTime.id, [
      { type: StandardType.PRIORITY, percentage: 130, ratio: 100 },
    ]);
  }

  // 일반공급 (150세대)
  const generalSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'GENERAL' } });
  if (generalSubcat) {
    const generalSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: generalSubcat.id,
      units: 150,
    });
    const savedGeneral = await supplyTypeRepo.save(generalSupply);

    await createSupplyTypeConditions(dataSource, savedGeneral.id, [
      'MIN_AGE_19',
      'SUBSCRIPTION_2_YEARS',
      'DEPOSIT_24_TIMES',
    ]);

    // 청약통장 요건
    await createSubscriptionRequirement(dataSource, savedGeneral.id, {
      subscriptionPeriodMonths: 24,
      depositCount: 24,
      depositAmount: 200000,
    });
  }
}

/**
 * 예시 2의 공급유형들 생성 (신혼부부 특화)
 */
async function createSupplyTypes2(dataSource: DataSource, housingId: number): Promise<void> {
  const subcategoryRepo = dataSource.getRepository(SupplySubcategory);
  const supplyTypeRepo = dataSource.getRepository(SupplyType);

  // 신혼부부 특별공급 (190세대 - 특화단지)
  const newlywedSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'NEWLYWED' } });
  if (newlywedSubcat) {
    const newlywedSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: newlywedSubcat.id,
      units: 190,
    });
    const savedNewlywed = await supplyTypeRepo.save(newlywedSupply);

    await createSupplyTypeConditions(dataSource, savedNewlywed.id, [
      'MARRIED',
      'MARRIED_WITHIN_7_YEARS',
      'NO_HOUSE_OWNER',
      'CHILD_UNDER_6',
    ]);

    await createIncomeStandards(dataSource, savedNewlywed.id, [
      { type: StandardType.PRIORITY, percentage: 120, dualIncomePercentage: 130, ratio: 75 },
      { type: StandardType.GENERAL, percentage: 130, dualIncomePercentage: 140, ratio: 15 },
      { type: StandardType.LOTTERY, percentage: 140, dualIncomePercentage: 160, ratio: 10 },
    ]);
  }

  // 다자녀가구 특별공급 (96세대)
  const multiChildSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'MULTI_CHILD' } });
  if (multiChildSubcat) {
    const multiChildSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: multiChildSubcat.id,
      units: 96,
    });
    const savedMultiChild = await supplyTypeRepo.save(multiChildSupply);

    await createSupplyTypeConditions(dataSource, savedMultiChild.id, [
      'CHILDREN_3_OR_MORE',
      'NO_HOUSE_OWNER',
      'SUBSCRIPTION_6_MONTHS',
    ]);
  }

  // 일반공급 (194세대)
  const generalSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'GENERAL' } });
  if (generalSubcat) {
    const generalSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: generalSubcat.id,
      units: 194,
    });
    await supplyTypeRepo.save(generalSupply);
  }
}

/**
 * 예시 3의 공급유형들 생성 (다자녀 우대)
 */
async function createSupplyTypes3(dataSource: DataSource, housingId: number): Promise<void> {
  const subcategoryRepo = dataSource.getRepository(SupplySubcategory);
  const supplyTypeRepo = dataSource.getRepository(SupplyType);

  // 다자녀가구 특별공급 (136세대 - 우대단지)
  const multiChildSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'MULTI_CHILD' } });
  if (multiChildSubcat) {
    const multiChildSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: multiChildSubcat.id,
      units: 136,
    });
    const savedMultiChild = await supplyTypeRepo.save(multiChildSupply);

    await createSupplyTypeConditions(dataSource, savedMultiChild.id, [
      'CHILDREN_3_OR_MORE',
      'NO_HOUSE_OWNER',
      'RESIDENCE_2_YEARS',
    ]);

    await createIncomeStandards(dataSource, savedMultiChild.id, [
      { type: StandardType.PRIORITY, percentage: 130, ratio: 90 },
      { type: StandardType.LOTTERY, percentage: 160, ratio: 10 },
    ]);
  }

  // 신혼부부 특별공급 (102세대)
  const newlywedSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'NEWLYWED' } });
  if (newlywedSubcat) {
    const newlywedSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: newlywedSubcat.id,
      units: 102,
    });
    await supplyTypeRepo.save(newlywedSupply);
  }

  // 노부모부양 특별공급 (68세대)
  const elderlySubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'ELDERLY_PARENT' } });
  if (elderlySubcat) {
    const elderlySupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: elderlySubcat.id,
      units: 68,
    });
    const savedElderly = await supplyTypeRepo.save(elderlySupply);

    await createSupplyTypeConditions(dataSource, savedElderly.id, [
      'NO_HOUSE_OWNER',
      'SUPPORT_ELDERLY_3_YEARS',
      'SUBSCRIPTION_2_YEARS',
    ]);
  }

  // 일반공급 (374세대)
  const generalSubcat = await subcategoryRepo.findOne({ where: { subcategoryCode: 'GENERAL' } });
  if (generalSubcat) {
    const generalSupply = supplyTypeRepo.create({
      housingApplicationId: housingId,
      subcategoryId: generalSubcat.id,
      units: 374,
    });
    await supplyTypeRepo.save(generalSupply);
  }
}

/**
 * 공급유형별 조건 생성
 */
async function createSupplyTypeConditions(
  dataSource: DataSource,
  supplyTypeId: number,
  conditionCodes: string[]
): Promise<void> {
  const templateRepo = dataSource.getRepository(ConditionTemplate);
  const conditionRepo = dataSource.getRepository(SupplyTypeCondition);

  for (const code of conditionCodes) {
    const template = await templateRepo.findOne({
      where: { conditionCode: code },
    });

    if (template) {
      const condition = conditionRepo.create({
        supplyTypeId,
        conditionTemplateId: template.id,
        conditionType: ConditionType.REQUIRED,
      });
      await conditionRepo.save(condition);
    }
  }
}

/**
 * 소득기준 생성
 */
async function createIncomeStandards(
  dataSource: DataSource,
  supplyTypeId: number,
  standards: Array<{
    type: StandardType;
    percentage: number;
    dualIncomePercentage?: number;
    ratio: number;
  }>
): Promise<void> {
  const repo = dataSource.getRepository(IncomeStandard);

  for (const standard of standards) {
    const entity = repo.create({
      supplyTypeId,
      standardType: standard.type,
      percentage: standard.percentage,
      dualIncomePercentage: standard.dualIncomePercentage,
      ratio: standard.ratio,
    });
    await repo.save(entity);
  }
}

/**
 * 자산기준 생성
 */
async function createAssetStandards(
  dataSource: DataSource,
  supplyTypeId: number,
  standards: {
    maxRealEstate?: number;
    maxVehicle?: number;
    maxFinancialAssets?: number;
  }
): Promise<void> {
  const repo = dataSource.getRepository(AssetStandard);

  const entity = repo.create({
    supplyTypeId,
    ...standards,
  });
  await repo.save(entity);
}

/**
 * 청약통장 요건 생성
 */
async function createSubscriptionRequirement(
  dataSource: DataSource,
  supplyTypeId: number,
  requirement: {
    subscriptionPeriodMonths?: number;
    depositCount?: number;
    depositAmount?: number;
  }
): Promise<void> {
  const repo = dataSource.getRepository(SubscriptionRequirement);

  const entity = repo.create({
    supplyTypeId,
    ...requirement,
  });
  await repo.save(entity);
}