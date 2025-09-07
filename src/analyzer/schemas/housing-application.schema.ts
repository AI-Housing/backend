// 청약공고 데이터 스키마
export interface HousingApplicationData {
  // 기본 정보
  basicInfo: {
    announcementDate?: string;
    applicationStartDate?: string;
    applicationEndDate?: string;
    winnerAnnouncementDate?: string;
    contractDate?: string;
    location: string;
    housingType: 'PUBLIC_SALE' | 'PRIVATE_SALE' | 'PUBLIC_RENTAL';
    developer: string;
    totalUnits: number;
  };

  // 공급 유형별 세부 정보
  supplyTypes: {
    // 사전청약 당첨자
    preApplication?: SupplyTypeInfo;
    
    // 기관추천 특별공급
    institutionalRecommendation?: SupplyTypeInfo;
    
    // 다자녀가구 특별공급
    multiChildFamily?: SpecialSupplyInfo;
    
    // 신혼부부 특별공급
    newlywed?: SpecialSupplyInfo;
    
    // 생애최초 특별공급
    firstTimeHomebuyer?: SpecialSupplyInfo;
    
    // 노부모부양 특별공급
    elderlyParentSupport?: SpecialSupplyInfo;
    
    // 신생아 특별공급
    newborn?: SpecialSupplyInfo;
    
    // 일반공급
    general: GeneralSupplyInfo;
  };

  // 지역별 우선공급 비율
  regionalPriority: {
    localCity?: number; // 해당 시/군 거주자 우선공급 비율 (%)
    localProvince?: number; // 해당 도 거주자 우선공급 비율 (%)
    others?: number; // 기타 지역 거주자 비율 (%)
  };

  // 소득기준 (4인 가구 기준, 월소득)
  incomeStandards: {
    standard100?: number; // 도시근로자 월평균소득 100%
    standard120?: number; // 120%
    standard130?: number; // 130%
    standard140?: number; // 140%
    standard200?: number; // 200%
  };

  // 주요 유의사항
  importantNotices: {
    duplicateApplicationRestriction?: string;
    birthSpecialBenefit?: string;
    rewinningRestriction?: string;
    overseasResidenceRestriction?: string;
  };
}

// 기본 공급 유형 정보
export interface SupplyTypeInfo {
  units: number; // 공급 세대수
  conditions: string[]; // 필수 조건들
}

// 특별공급 정보 (소득/자산 기준 포함)
export interface SpecialSupplyInfo extends SupplyTypeInfo {
  subscriptionRequirement?: SubscriptionRequirement;
  incomeStandard?: IncomeStandard;
  assetStandard?: AssetStandard;
}

// 일반공급 정보
export interface GeneralSupplyInfo extends SupplyTypeInfo {
  subscriptionRequirement?: SubscriptionRequirement;
  firstPriorityConditions: string[];
  secondPriorityConditions: string[];
}

// 청약통장 요건
export interface SubscriptionRequirement {
  subscriptionPeriod?: string; // 가입기간 (예: "2년 이상")
  depositCount?: number; // 납입횟수
  depositAmount?: number; // 예치금액
  housingType?: string; // 주택형 제한
}

// 소득기준
export interface IncomeStandard {
  prioritySupply?: {
    percentage: number; // 소득 기준 퍼센트 (예: 100, 120)
    dualIncomePercentage?: number; // 맞벌이 기준 퍼센트
    ratio: number; // 공급 비율 (예: 70, 90)
  };
  generalSupply?: {
    percentage: number;
    dualIncomePercentage?: number;
    ratio: number;
  };
  lotterySupply?: {
    percentage: number;
    dualIncomePercentage?: number;
    ratio: number;
  };
}

// 자산기준
export interface AssetStandard {
  realEstate?: number; // 부동산 자산 한도 (단위: 천원)
  vehicle?: number; // 자동차 자산 한도 (단위: 천원)
  financialAssets?: number; // 금융자산 한도 (단위: 천원)
}

// 매칭을 위한 공고 요약 정보
export interface HousingApplicationSummary {
  id: string;
  title: string;
  location: string;
  applicationPeriod: {
    start?: string;
    end?: string;
  };
  availableSupplyTypes: SupplyType[];
  totalUnits: number;
  processed: boolean; // PDF 분석 완료 여부
  createdAt: Date;
  updatedAt: Date;
}

// 공급 유형 열거형
export enum SupplyType {
  PRE_APPLICATION = 'preApplication',
  INSTITUTIONAL_RECOMMENDATION = 'institutionalRecommendation',
  MULTI_CHILD_FAMILY = 'multiChildFamily',
  NEWLYWED = 'newlywed',
  FIRST_TIME_HOMEBUYER = 'firstTimeHomebuyer',
  ELDERLY_PARENT_SUPPORT = 'elderlyParentSupport',
  NEWBORN = 'newborn',
  GENERAL = 'general'
}