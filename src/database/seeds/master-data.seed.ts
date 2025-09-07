import { DataSource } from 'typeorm';
import {
  SupplyCategory,
  SupplySubcategory,
  ConditionCategory,
  ConditionTemplate,
  DataType,
} from '../../analyzer/entities';

/**
 * 마스터 데이터 시드 - 공급유형, 조건 카테고리, 조건 템플릿
 */
export async function seedMasterData(dataSource: DataSource): Promise<void> {
  console.log('Starting master data seeding...');

  try {
    // 1. 공급 카테고리 시드
    await seedSupplyCategories(dataSource);
    
    // 2. 공급 서브카테고리 시드  
    await seedSupplySubcategories(dataSource);
    
    // 3. 조건 카테고리 시드
    await seedConditionCategories(dataSource);
    
    // 4. 조건 템플릿 시드
    await seedConditionTemplates(dataSource);
    
    console.log('Master data seeding completed successfully');
  } catch (error) {
    console.error('Error during master data seeding:', error);
    throw error;
  }
}

/**
 * 공급 카테고리 시드
 */
async function seedSupplyCategories(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(SupplyCategory);

  const categories = [
    {
      categoryCode: 'SPECIAL',
      categoryName: '특별공급',
      description: '다자녀, 신혼부부 등 특별한 자격을 갖춘 세대를 위한 공급',
      displayOrder: 1,
    },
    {
      categoryCode: 'GENERAL',
      categoryName: '일반공급',
      description: '일반적인 청약 조건을 만족하는 세대를 위한 공급',
      displayOrder: 2,
    },
  ];

  for (const data of categories) {
    const existing = await repository.findOne({
      where: { categoryCode: data.categoryCode },
    });

    if (!existing) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`Created supply category: ${data.categoryName}`);
    }
  }
}

/**
 * 공급 서브카테고리 시드
 */
async function seedSupplySubcategories(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(SupplyCategory);
  const subcategoryRepo = dataSource.getRepository(SupplySubcategory);

  const specialCategory = await categoryRepo.findOne({
    where: { categoryCode: 'SPECIAL' },
  });
  const generalCategory = await categoryRepo.findOne({
    where: { categoryCode: 'GENERAL' },
  });

  if (!specialCategory || !generalCategory) {
    throw new Error('Supply categories not found');
  }

  const subcategories = [
    // 특별공급 유형들
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'MULTI_CHILD',
      subcategoryName: '다자녀가구 특별공급',
      description: '미성년 자녀 3명 이상 또는 2명이면서 영유아 포함',
      displayOrder: 1,
      isSpecialSupply: true,
      requiresIncomeStandard: true,
      requiresAssetStandard: true,
      requiresSubscription: true,
      requiresPriorityRanking: true,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'NEWLYWED',
      subcategoryName: '신혼부부 특별공급',
      description: '혼인기간 7년 이내 또는 6세 이하 자녀를 둔 무주택세대구성원',
      displayOrder: 2,
      isSpecialSupply: true,
      requiresIncomeStandard: true,
      requiresAssetStandard: true,
      requiresSubscription: true,
      requiresPriorityRanking: false,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'FIRST_TIME',
      subcategoryName: '생애최초 특별공급',
      description: '생애최초로 주택을 구입하는 무주택세대구성원',
      displayOrder: 3,
      isSpecialSupply: true,
      requiresIncomeStandard: true,
      requiresAssetStandard: true,
      requiresSubscription: true,
      requiresPriorityRanking: false,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'ELDERLY_PARENT',
      subcategoryName: '노부모부양 특별공급',
      description: '만 65세 이상 직계존속을 3년 이상 부양하는 무주택세대구성원',
      displayOrder: 4,
      isSpecialSupply: true,
      requiresIncomeStandard: true,
      requiresAssetStandard: true,
      requiresSubscription: true,
      requiresPriorityRanking: true,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'NEWBORN',
      subcategoryName: '신생아 특별공급',
      description: '2021년 이후 출생아를 둔 무주택세대구성원',
      displayOrder: 5,
      isSpecialSupply: true,
      requiresIncomeStandard: true,
      requiresAssetStandard: true,
      requiresSubscription: true,
      requiresPriorityRanking: false,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'INSTITUTIONAL',
      subcategoryName: '기관추천 특별공급',
      description: '국가유공자, 장애인, 철거민 등 관련 기관에서 추천받은 자',
      displayOrder: 6,
      isSpecialSupply: true,
      requiresIncomeStandard: false,
      requiresAssetStandard: false,
      requiresSubscription: true,
      requiresPriorityRanking: false,
    },
    {
      categoryId: specialCategory.id,
      subcategoryCode: 'PRE_APPLICATION',
      subcategoryName: '사전청약 당첨자',
      description: '사전청약에서 당첨된 자',
      displayOrder: 7,
      isSpecialSupply: true,
      requiresIncomeStandard: false,
      requiresAssetStandard: false,
      requiresSubscription: false,
      requiresPriorityRanking: false,
    },
    
    // 일반공급 유형
    {
      categoryId: generalCategory.id,
      subcategoryCode: 'GENERAL',
      subcategoryName: '일반공급',
      description: '특별공급 외의 일반적인 청약 자격을 갖춘 세대',
      displayOrder: 1,
      isSpecialSupply: false,
      requiresIncomeStandard: false,
      requiresAssetStandard: false,
      requiresSubscription: true,
      requiresPriorityRanking: true,
    },
  ];

  for (const data of subcategories) {
    const existing = await subcategoryRepo.findOne({
      where: { subcategoryCode: data.subcategoryCode },
    });

    if (!existing) {
      const entity = subcategoryRepo.create(data);
      await subcategoryRepo.save(entity);
      console.log(`Created supply subcategory: ${data.subcategoryName}`);
    }
  }
}

/**
 * 조건 카테고리 시드
 */
async function seedConditionCategories(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(ConditionCategory);

  const categories = [
    { categoryCode: 'AGE', categoryName: '나이', description: '연령 관련 조건', dataType: DataType.NUMBER, displayOrder: 1 },
    { categoryCode: 'MARRIAGE', categoryName: '혼인', description: '결혼 관련 조건', dataType: DataType.BOOLEAN, displayOrder: 2 },
    { categoryCode: 'MARRIAGE_PERIOD', categoryName: '혼인기간', description: '결혼 기간 관련 조건', dataType: DataType.NUMBER, displayOrder: 3 },
    { categoryCode: 'CHILDREN', categoryName: '자녀', description: '자녀 수 관련 조건', dataType: DataType.NUMBER, displayOrder: 4 },
    { categoryCode: 'CHILDREN_AGE', categoryName: '자녀나이', description: '자녀 나이 관련 조건', dataType: DataType.NUMBER, displayOrder: 5 },
    { categoryCode: 'HOUSING_OWNERSHIP', categoryName: '주택보유', description: '주택 보유 관련 조건', dataType: DataType.BOOLEAN, displayOrder: 6 },
    { categoryCode: 'HOUSING_COUNT', categoryName: '보유주택수', description: '보유 주택 수 관련 조건', dataType: DataType.NUMBER, displayOrder: 7 },
    { categoryCode: 'RESIDENCE_PERIOD', categoryName: '거주기간', description: '거주 기간 관련 조건', dataType: DataType.NUMBER, displayOrder: 8 },
    { categoryCode: 'SUBSCRIPTION_PERIOD', categoryName: '청약가입기간', description: '청약통장 가입 기간 관련 조건', dataType: DataType.NUMBER, displayOrder: 9 },
    { categoryCode: 'DEPOSIT_COUNT', categoryName: '납입횟수', description: '청약통장 납입 횟수 관련 조건', dataType: DataType.NUMBER, displayOrder: 10 },
    { categoryCode: 'INCOME', categoryName: '소득', description: '소득 관련 조건', dataType: DataType.NUMBER, displayOrder: 11 },
    { categoryCode: 'ASSETS', categoryName: '자산', description: '자산 관련 조건', dataType: DataType.NUMBER, displayOrder: 12 },
    { categoryCode: 'SPECIAL_STATUS', categoryName: '특별자격', description: '국가유공자, 장애인 등 특별 자격', dataType: DataType.BOOLEAN, displayOrder: 13 },
    { categoryCode: 'ELDERLY_SUPPORT', categoryName: '노부모부양', description: '직계존속 부양 관련 조건', dataType: DataType.BOOLEAN, displayOrder: 14 },
    { categoryCode: 'NEWBORN', categoryName: '신생아', description: '신생아 관련 조건', dataType: DataType.BOOLEAN, displayOrder: 15 },
  ];

  for (const data of categories) {
    const existing = await repository.findOne({
      where: { categoryCode: data.categoryCode },
    });

    if (!existing) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`Created condition category: ${data.categoryName}`);
    }
  }
}

/**
 * 조건 템플릿 시드
 */
async function seedConditionTemplates(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(ConditionCategory);
  const templateRepo = dataSource.getRepository(ConditionTemplate);

  // 카테고리별 템플릿 데이터
  const templateData = [
    // 나이 관련
    { categoryCode: 'AGE', conditionCode: 'MIN_AGE_19', conditionName: '만 19세 이상', description: '신청자가 만 19세 이상이어야 함', numericValue: 19, operator: '>=', displayOrder: 1 },
    
    // 혼인 관련
    { categoryCode: 'MARRIAGE', conditionCode: 'MARRIED', conditionName: '혼인 중', description: '혼인신고를 필한 배우자가 있는 상태', booleanValue: true, operator: '=', displayOrder: 1 },
    { categoryCode: 'MARRIAGE_PERIOD', conditionCode: 'MARRIED_WITHIN_7_YEARS', conditionName: '혼인기간 7년 이내', description: '혼인신고일로부터 7년 이내', numericValue: 7, operator: '<=', displayOrder: 1 },
    
    // 자녀 관련
    { categoryCode: 'CHILDREN', conditionCode: 'CHILDREN_3_OR_MORE', conditionName: '미성년 자녀 3명 이상', description: '미성년 자녀가 3명 이상', numericValue: 3, operator: '>=', displayOrder: 1 },
    { categoryCode: 'CHILDREN', conditionCode: 'CHILDREN_2_WITH_INFANT', conditionName: '자녀 2명 (영유아 포함)', description: '미성년 자녀 2명 중 영유아 포함', numericValue: 2, textValue: '영유아 포함', operator: '=', displayOrder: 2 },
    { categoryCode: 'CHILDREN_AGE', conditionCode: 'CHILD_UNDER_6', conditionName: '6세 이하 자녀', description: '6세 이하의 자녀가 있음', numericValue: 6, operator: '<=', displayOrder: 1 },
    
    // 주택보유 관련
    { categoryCode: 'HOUSING_OWNERSHIP', conditionCode: 'NO_HOUSE_OWNER', conditionName: '무주택세대구성원', description: '세대구성원 전원이 주택을 소유하지 않음', booleanValue: false, operator: '=', displayOrder: 1 },
    { categoryCode: 'HOUSING_COUNT', conditionCode: 'MAX_1_HOUSE', conditionName: '1주택 이하', description: '보유 주택이 1채 이하', numericValue: 1, operator: '<=', displayOrder: 1 },
    
    // 거주기간 관련
    { categoryCode: 'RESIDENCE_PERIOD', conditionCode: 'RESIDENCE_1_YEAR', conditionName: '해당지역 1년 이상 거주', description: '해당 지역에 1년 이상 거주', numericValue: 12, operator: '>=', displayOrder: 1 },
    { categoryCode: 'RESIDENCE_PERIOD', conditionCode: 'RESIDENCE_2_YEARS', conditionName: '해당지역 2년 이상 거주', description: '해당 지역에 2년 이상 거주', numericValue: 24, operator: '>=', displayOrder: 2 },
    
    // 청약통장 관련
    { categoryCode: 'SUBSCRIPTION_PERIOD', conditionCode: 'SUBSCRIPTION_6_MONTHS', conditionName: '청약통장 6개월 이상 가입', description: '청약통장에 6개월 이상 가입', numericValue: 6, operator: '>=', displayOrder: 1 },
    { categoryCode: 'SUBSCRIPTION_PERIOD', conditionCode: 'SUBSCRIPTION_2_YEARS', conditionName: '청약통장 2년 이상 가입', description: '청약통장에 2년 이상 가입', numericValue: 24, operator: '>=', displayOrder: 2 },
    { categoryCode: 'DEPOSIT_COUNT', conditionCode: 'DEPOSIT_6_TIMES', conditionName: '6회 이상 납입', description: '청약통장에 6회 이상 납입', numericValue: 6, operator: '>=', displayOrder: 1 },
    { categoryCode: 'DEPOSIT_COUNT', conditionCode: 'DEPOSIT_24_TIMES', conditionName: '24회 이상 납입', description: '청약통장에 24회 이상 납입', numericValue: 24, operator: '>=', displayOrder: 2 },
    
    // 소득 관련
    { categoryCode: 'INCOME', conditionCode: 'INCOME_120_PERCENT', conditionName: '소득 120% 이하', description: '도시근로자 월평균소득 120% 이하', numericValue: 120, operator: '<=', displayOrder: 1 },
    { categoryCode: 'INCOME', conditionCode: 'INCOME_130_PERCENT', conditionName: '소득 130% 이하', description: '도시근로자 월평균소득 130% 이하', numericValue: 130, operator: '<=', displayOrder: 2 },
    { categoryCode: 'INCOME', conditionCode: 'INCOME_140_PERCENT', conditionName: '소득 140% 이하', description: '도시근로자 월평균소득 140% 이하', numericValue: 140, operator: '<=', displayOrder: 3 },
    
    // 특별자격 관련
    { categoryCode: 'SPECIAL_STATUS', conditionCode: 'NATIONAL_MERIT', conditionName: '국가유공자', description: '국가보훈처에서 국가유공자로 인정받은 자', booleanValue: true, operator: '=', displayOrder: 1 },
    { categoryCode: 'SPECIAL_STATUS', conditionCode: 'DISABLED_PERSON', conditionName: '장애인', description: '장애인복지법에 따른 장애인', booleanValue: true, operator: '=', displayOrder: 2 },
    
    // 노부모부양 관련
    { categoryCode: 'ELDERLY_SUPPORT', conditionCode: 'SUPPORT_ELDERLY_3_YEARS', conditionName: '직계존속 3년 이상 부양', description: '만 65세 이상 직계존속을 3년 이상 부양', numericValue: 3, operator: '>=', displayOrder: 1 },
    
    // 신생아 관련
    { categoryCode: 'NEWBORN', conditionCode: 'NEWBORN_2021_AFTER', conditionName: '2021년 이후 출생아', description: '2021년 1월 1일 이후 출생한 자녀', booleanValue: true, textValue: '2021년 이후', operator: '=', displayOrder: 1 },
  ];

  for (const data of templateData) {
    const category = await categoryRepo.findOne({
      where: { categoryCode: data.categoryCode },
    });

    if (!category) continue;

    const existing = await templateRepo.findOne({
      where: { conditionCode: data.conditionCode },
    });

    if (!existing) {
      const entity = templateRepo.create({
        categoryId: category.id,
        conditionCode: data.conditionCode,
        conditionName: data.conditionName,
        conditionDescription: data.description,
        numericValue: data.numericValue,
        booleanValue: data.booleanValue,
        textValue: data.textValue,
        operator: data.operator,
        displayOrder: data.displayOrder,
      });
      await templateRepo.save(entity);
      console.log(`Created condition template: ${data.conditionName}`);
    }
  }
}