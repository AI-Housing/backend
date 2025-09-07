import { HousingApplicationData } from './housing-application.schema';
import { UserQualification, QualificationMatchResult } from './user-qualification.schema';

// 매칭 서비스 인터페이스
export interface HousingMatchingService {
  // 단일 공고에 대한 매칭 검사
  checkEligibility(
    userQualification: UserQualification,
    housingData: HousingApplicationData
  ): Promise<MatchingResult>;

  // 여러 공고에 대한 매칭 검사 (추천 순으로 정렬)
  findMatchingApplications(
    userQualification: UserQualification,
    housingApplications: HousingApplicationData[]
  ): Promise<MatchingResult[]>;

  // 특정 공급유형의 자격 요건 검사
  checkSupplyTypeEligibility(
    userQualification: UserQualification,
    supplyType: string,
    housingData: HousingApplicationData
  ): Promise<QualificationMatchResult>;
}

// 전체 매칭 결과
export interface MatchingResult {
  housingApplicationId?: string;
  housingTitle: string;
  location: string;
  applicationPeriod?: {
    start?: string;
    end?: string;
  };
  
  // 각 공급유형별 자격 결과
  qualificationResults: QualificationMatchResult[];
  
  // 전체 추천도
  overallRecommendation: 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_ELIGIBLE';
  
  // 매칭 점수 (정렬용)
  matchingScore: number;
  
  // 요약 메시지
  summary: string;
  
  // 다음 단계 가이드
  nextSteps: string[];
}

// 자격 검사를 위한 헬퍼 인터페이스들
export interface EligibilityChecker {
  // 기본 자격 검사
  checkBasicEligibility(
    user: UserQualification,
    requirements: BasicRequirements
  ): CheckResult;

  // 소득 기준 검사
  checkIncomeEligibility(
    user: UserQualification,
    incomeStandard: IncomeRequirement,
    baseIncome: number
  ): CheckResult;

  // 자산 기준 검사
  checkAssetEligibility(
    user: UserQualification,
    assetStandard: AssetRequirement
  ): CheckResult;

  // 청약통장 요건 검사
  checkSubscriptionEligibility(
    user: UserQualification,
    subscriptionReq: SubscriptionRequirement
  ): CheckResult;

  // 거주지역 우선공급 자격 검사
  checkRegionalPriority(
    user: UserQualification,
    housingLocation: string,
    regionalPriority: RegionalPriorityInfo
  ): RegionalPriorityResult;
}

// 기본 요건
export interface BasicRequirements {
  minAge?: number;
  maxAge?: number;
  marriageRequired?: boolean;
  marriagePeriodRestriction?: number; // 신혼부부용 (개월)
  childrenRequired?: boolean;
  minChildren?: number;
  firstTimeHomebuyerRequired?: boolean;
  housingOwnershipRestriction?: {
    maxCurrentHouses: number;
    maxPreviousHouses: number;
  };
}

// 소득 요건
export interface IncomeRequirement {
  standardPercentage: number; // 기준소득 대비 퍼센트 (예: 100, 120)
  dualIncomePercentage?: number; // 맞벌이 기준 퍼센트
  isDualIncomeConsidered: boolean;
}

// 자산 요건
export interface AssetRequirement {
  maxRealEstate?: number;
  maxVehicle?: number;
  maxFinancialAssets?: number;
  maxTotalAssets?: number;
}

// 청약통장 요건
export interface SubscriptionRequirement {
  required: boolean;
  minSubscriptionPeriod?: number; // 개월
  minDepositCount?: number;
  minDepositAmount?: number;
  allowedAccountTypes?: string[];
}

// 지역 우선공급 정보
export interface RegionalPriorityInfo {
  housingLocation: string; // 공급위치 (시/군/구)
  localCityRatio?: number; // 해당 시/군 우선공급 비율
  localProvinceRatio?: number; // 해당 도 우선공급 비율
  otherRegionRatio?: number; // 기타지역 비율
}

// 지역 우선공급 결과
export interface RegionalPriorityResult {
  priorityLevel: 'LOCAL_CITY' | 'LOCAL_PROVINCE' | 'OTHER_REGION';
  priorityRatio: number; // 해당하는 우선공급 비율
  isEligible: boolean;
  reason: string;
}

// 검사 결과
export interface CheckResult {
  isEligible: boolean;
  reason: string;
  score?: number; // 점수 (우선순위 계산용)
  additionalInfo?: string;
}

// 매칭 설정
export interface MatchingConfig {
  // 점수 가중치
  weights: {
    eligibilityWeight: number; // 자격 충족 가중치
    competitionWeight: number; // 경쟁률 가중치 (낮을수록 높은 점수)
    priorityWeight: number; // 우선순위 가중치
    regionalWeight: number; // 지역 가중치
  };

  // 필터링 옵션
  filters: {
    onlyEligible: boolean; // 자격 충족하는 것만
    maxResults: number; // 최대 결과 수
    minRecommendationLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

// 통계 정보 (옵션)
export interface MatchingStatistics {
  totalApplicationsChecked: number;
  eligibleApplicationsCount: number;
  highRecommendationCount: number;
  mediumRecommendationCount: number;
  lowRecommendationCount: number;
  averageMatchingScore: number;
}