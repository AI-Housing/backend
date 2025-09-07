// 유저 자격 정보 스키마
export interface UserQualification {
  // 기본 개인정보
  personalInfo: {
    age: number;
    isMarried: boolean;
    marriageDate?: string; // 결혼일 (신혼부부 특별공급 등에 필요)
    isFirstTimeHomebuyer: boolean; // 생애최초 구입자 여부
    householdSize: number; // 세대원 수
  };

  // 자녀 정보
  children: {
    count: number; // 자녀 수
    minorCount: number; // 미성년 자녀 수
    hasNewborn?: boolean; // 신생아 특별공급 대상 여부
    newbornBirthDate?: string; // 신생아 출생일
  };

  // 부모 부양 정보
  elderlyParentSupport?: {
    isSupporting: boolean; // 직계존속 부양 여부
    supportPeriod?: string; // 부양기간
  };

  // 거주지 정보
  residence: {
    currentAddress: string; // 현재 거주지 (시/군/구)
    residencePeriod: number; // 거주기간 (개월)
    hasLocalConnection: boolean; // 지역 연고 여부
  };

  // 주택 보유 현황
  housingOwnership: {
    hasOwnedHouse: boolean; // 주택 보유 이력 여부
    currentHouseCount: number; // 현재 보유 주택 수
    previousHouseCount: number; // 과거 보유 주택 수
    lastSaleDate?: string; // 최근 주택 처분일
    houseValue?: number; // 보유 주택 가액 (천원)
  };

  // 청약통장 정보
  subscriptionAccount: {
    hasAccount: boolean;
    accountType?: 'HOUSING_SUBSCRIPTION' | 'YOUTH_HOUSING' | 'WORKER_HOUSING'; // 청약통장 종류
    subscriptionDate?: string; // 가입일
    subscriptionPeriod?: number; // 가입기간 (개월)
    depositCount?: number; // 납입횟수
    depositAmount?: number; // 예치금액 (천원)
    housingTypeLimit?: string; // 청약가능 주택형
  };

  // 소득 정보
  income: {
    // 본인 소득
    applicantIncome: number; // 월소득 (천원)
    applicantEmploymentType: 'EMPLOYEE' | 'SELF_EMPLOYED' | 'UNEMPLOYED';
    
    // 배우자 소득 (맞벌이 여부 판단용)
    spouseIncome?: number;
    spouseEmploymentType?: 'EMPLOYEE' | 'SELF_EMPLOYED' | 'UNEMPLOYED';
    
    // 세대 총 소득
    householdIncome: number; // 세대 월소득 (천원)
    annualIncome: number; // 연소득 (천원)
    
    isDualIncome: boolean; // 맞벌이 여부
  };

  // 자산 정보
  assets: {
    // 부동산 자산
    realEstate: number; // 부동산 총액 (천원)
    
    // 금융자산
    financialAssets: number; // 예금, 적금, 주식 등 (천원)
    
    // 자동차 자산
    vehicle: number; // 자동차 가액 (천원)
    
    // 총 자산
    totalAssets: number; // 총 자산 (천원)
  };

  // 특별공급 자격 관련
  specialQualifications: {
    // 기관추천 여부
    hasInstitutionalRecommendation: boolean;
    institutionType?: string;
    
    // 국가유공자 등 특별자격
    hasSpecialStatus: boolean;
    specialStatusType?: string;
    
    // 장애인 여부
    hasDisability: boolean;
    
    // 북한이탈주민 여부
    isNorthKoreanDefector: boolean;
  };

  // 이전 청약 이력
  subscriptionHistory: {
    hasWonBefore: boolean; // 이전 당첨 이력
    lastWinDate?: string; // 최근 당첨일
    rewinningRestrictionEndDate?: string; // 재당첨 제한 해제일
    hasAppliedRecently: boolean; // 최근 신청 이력
  };

  // 기타 제한사항
  restrictions: {
    hasOverseasResidence: boolean; // 해외거주 여부
    overseasPeriod?: number; // 해외거주 기간 (개월)
    hasCriminalRecord: boolean; // 범죄이력 여부 (일부 공고에서 제한)
  };

  // 우선순위 계산을 위한 점수 (시스템에서 자동 계산)
  priorityScore?: {
    childrenScore: number; // 자녀 수 점수
    elderlyParentScore: number; // 부모부양 점수
    localResidenceScore: number; // 지역거주 점수
    subscriptionPeriodScore: number; // 청약통장 가입기간 점수
    totalScore: number; // 총점
  };
}

// 매칭 결과를 위한 인터페이스
export interface QualificationMatchResult {
  supplyType: string; // 공급 유형
  isEligible: boolean; // 자격 충족 여부
  eligibilityReasons: string[]; // 자격 충족 이유
  ineligibilityReasons: string[]; // 자격 미충족 이유
  estimatedCompetition?: string; // 예상 경쟁률 (HIGH/MEDIUM/LOW)
  priorityRank?: number; // 우선순위 (해당하는 경우)
  recommendationLevel: 'HIGH' | 'MEDIUM' | 'LOW'; // 추천도
}