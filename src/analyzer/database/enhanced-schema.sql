-- Enhanced PostgreSQL Database Schema for Housing Application Matching System
-- 공급유형 계층구조 및 조건 분리 설계

-- 기존 청약공고 메인 테이블 유지
CREATE TABLE housing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    announcement_date DATE,
    application_start_date DATE,
    application_end_date DATE,
    winner_announcement_date DATE,
    contract_date DATE,
    location VARCHAR(200) NOT NULL,
    detailed_address TEXT,
    housing_type VARCHAR(50) NOT NULL CHECK (housing_type IN ('PUBLIC_SALE', 'PRIVATE_SALE', 'PUBLIC_RENTAL')),
    developer VARCHAR(200),
    total_units INTEGER NOT NULL,
    pdf_file_path VARCHAR(500),
    raw_text TEXT,
    processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 공급유형 마스터 데이터 테이블 (계층구조)
-- ============================================================================

-- 공급유형 카테고리 (대분류)
CREATE TABLE supply_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(20) UNIQUE NOT NULL, -- 'SPECIAL', 'GENERAL'
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 공급유형 서브카테고리 (소분류)
CREATE TABLE supply_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES supply_categories(id) ON DELETE CASCADE,
    subcategory_code VARCHAR(20) UNIQUE NOT NULL, -- 'MULTI_CHILD', 'NEWLYWED', 'GENERAL' 등
    subcategory_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- 특별공급 여부
    is_special_supply BOOLEAN DEFAULT FALSE,
    
    -- 자격 요건 타입
    requires_income_standard BOOLEAN DEFAULT FALSE,
    requires_asset_standard BOOLEAN DEFAULT FALSE,
    requires_subscription BOOLEAN DEFAULT FALSE,
    requires_priority_ranking BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 공급유형별 실제 데이터 테이블
-- ============================================================================

-- 공급유형 (각 청약공고별 실제 공급 정보)
CREATE TABLE supply_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housing_application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES supply_subcategories(id),
    
    -- 기본 공급 정보
    units INTEGER NOT NULL,
    
    -- 메타 정보
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 조건 마스터 데이터 테이블
-- ============================================================================

-- 조건 카테고리 (나이, 결혼, 자녀, 주택보유 등)
CREATE TABLE condition_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(20) UNIQUE NOT NULL, -- 'AGE', 'MARRIAGE', 'CHILDREN', 'HOUSING' 등
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    data_type VARCHAR(20) NOT NULL DEFAULT 'STRING', -- 'NUMBER', 'BOOLEAN', 'DATE', 'STRING'
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 조건 템플릿 (재사용 가능한 조건들)
CREATE TABLE condition_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES condition_categories(id) ON DELETE CASCADE,
    condition_code VARCHAR(50) UNIQUE NOT NULL, -- 'NO_HOUSE_OWNER', 'MARRIED_WITHIN_7_YEARS' 등
    condition_name VARCHAR(200) NOT NULL,
    condition_description TEXT,
    
    -- 조건 값 (숫자, 불린 등)
    numeric_value DECIMAL(15,2),
    boolean_value BOOLEAN,
    text_value TEXT,
    
    -- 조건 연산자 ('>=', '<=', '=', 'BETWEEN' 등)
    operator VARCHAR(10) DEFAULT '=',
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 공급유형별 조건 매핑 테이블
-- ============================================================================

-- 공급유형별 조건 (실제 각 공급유형에 적용되는 조건들)
CREATE TABLE supply_type_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    condition_template_id UUID NOT NULL REFERENCES condition_templates(id),
    
    -- 해당 공급유형에서의 구체적인 값 (템플릿과 다를 수 있음)
    specific_numeric_value DECIMAL(15,2),
    specific_boolean_value BOOLEAN,
    specific_text_value TEXT,
    specific_operator VARCHAR(10),
    
    -- 조건 중요도 (필수, 가점 등)
    condition_type VARCHAR(20) DEFAULT 'REQUIRED' CHECK (condition_type IN ('REQUIRED', 'PREFERRED', 'BONUS')),
    
    -- 점수 (가점 조건의 경우)
    score_points INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 중복 방지
    UNIQUE(supply_type_id, condition_template_id)
);

-- ============================================================================
-- 기존 테이블들 (소득/자산/청약통장 요건) - 유지하되 supply_type_id 참조
-- ============================================================================

-- 청약통장 요건 테이블 (기존 유지)
CREATE TABLE subscription_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    subscription_period_months INTEGER,
    deposit_count INTEGER,
    deposit_amount BIGINT,
    housing_type_limit VARCHAR(100),
    account_types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 소득기준 테이블 (기존 유지)
CREATE TABLE income_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    standard_type VARCHAR(50) NOT NULL CHECK (standard_type IN ('PRIORITY', 'GENERAL', 'LOTTERY')),
    percentage INTEGER NOT NULL,
    dual_income_percentage INTEGER,
    ratio INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 자산기준 테이블 (기존 유지)
CREATE TABLE asset_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    max_real_estate BIGINT,
    max_vehicle BIGINT,
    max_financial_assets BIGINT,
    max_total_assets BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 기존 테이블들 (사용자, 매칭 등) - 변경 없음
-- ============================================================================

-- 지역 우선공급 테이블 (기존 유지)
CREATE TABLE regional_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housing_application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    local_city_ratio INTEGER,
    local_province_ratio INTEGER,
    other_region_ratio INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 소득기준표 (전국 기준) (기존 유지)
CREATE TABLE national_income_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    household_size INTEGER NOT NULL,
    standard_100 BIGINT NOT NULL,
    standard_120 BIGINT,
    standard_130 BIGINT,
    standard_140 BIGINT,
    standard_200 BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, household_size)
);

-- 사용자 테이블 (기존 유지)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 자격정보 테이블 (기존 유지)
CREATE TABLE user_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 기존 컬럼들 그대로 유지
    age INTEGER NOT NULL,
    is_married BOOLEAN NOT NULL DEFAULT FALSE,
    marriage_date DATE,
    is_first_time_homebuyer BOOLEAN NOT NULL DEFAULT FALSE,
    household_size INTEGER NOT NULL DEFAULT 1,
    children_count INTEGER DEFAULT 0,
    minor_children_count INTEGER DEFAULT 0,
    has_newborn BOOLEAN DEFAULT FALSE,
    newborn_birth_date DATE,
    supports_elderly_parent BOOLEAN DEFAULT FALSE,
    elderly_support_period_months INTEGER,
    current_address VARCHAR(200) NOT NULL,
    residence_period_months INTEGER NOT NULL,
    has_local_connection BOOLEAN DEFAULT FALSE,
    has_owned_house BOOLEAN NOT NULL DEFAULT FALSE,
    current_house_count INTEGER DEFAULT 0,
    previous_house_count INTEGER DEFAULT 0,
    last_house_sale_date DATE,
    house_value BIGINT,
    applicant_income BIGINT NOT NULL,
    applicant_employment_type VARCHAR(20) CHECK (applicant_employment_type IN ('EMPLOYEE', 'SELF_EMPLOYED', 'UNEMPLOYED')),
    spouse_income BIGINT DEFAULT 0,
    spouse_employment_type VARCHAR(20) CHECK (spouse_employment_type IN ('EMPLOYEE', 'SELF_EMPLOYED', 'UNEMPLOYED')),
    household_income BIGINT NOT NULL,
    annual_income BIGINT NOT NULL,
    is_dual_income BOOLEAN DEFAULT FALSE,
    real_estate_assets BIGINT DEFAULT 0,
    financial_assets BIGINT DEFAULT 0,
    vehicle_assets BIGINT DEFAULT 0,
    total_assets BIGINT DEFAULT 0,
    has_institutional_recommendation BOOLEAN DEFAULT FALSE,
    institution_type VARCHAR(100),
    has_special_status BOOLEAN DEFAULT FALSE,
    special_status_type VARCHAR(100),
    has_disability BOOLEAN DEFAULT FALSE,
    is_north_korean_defector BOOLEAN DEFAULT FALSE,
    has_won_before BOOLEAN DEFAULT FALSE,
    last_win_date DATE,
    rewinning_restriction_end_date DATE,
    has_applied_recently BOOLEAN DEFAULT FALSE,
    has_overseas_residence BOOLEAN DEFAULT FALSE,
    overseas_residence_months INTEGER DEFAULT 0,
    has_criminal_record BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 청약통장 정보 테이블 (기존 유지)
CREATE TABLE user_subscription_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_qualification_id UUID NOT NULL REFERENCES user_qualifications(id) ON DELETE CASCADE,
    has_account BOOLEAN NOT NULL DEFAULT FALSE,
    account_type VARCHAR(50) CHECK (account_type IN ('HOUSING_SUBSCRIPTION', 'YOUTH_HOUSING', 'WORKER_HOUSING')),
    subscription_date DATE,
    subscription_period_months INTEGER,
    deposit_count INTEGER,
    deposit_amount BIGINT,
    housing_type_limit VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 매칭 결과 테이블 (기존 유지)
CREATE TABLE matching_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_qualification_id UUID NOT NULL REFERENCES user_qualifications(id) ON DELETE CASCADE,
    housing_application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    overall_recommendation VARCHAR(20) NOT NULL CHECK (overall_recommendation IN ('HIGH', 'MEDIUM', 'LOW', 'NOT_ELIGIBLE')),
    matching_score DECIMAL(5,2),
    summary TEXT,
    next_steps TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 공급유형별 자격 결과 테이블 (기존 유지)
CREATE TABLE supply_type_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matching_result_id UUID NOT NULL REFERENCES matching_results(id) ON DELETE CASCADE,
    supply_type_id UUID NOT NULL REFERENCES supply_types(id), -- supply_type 테이블 참조로 변경
    is_eligible BOOLEAN NOT NULL,
    eligibility_reasons TEXT[],
    ineligibility_reasons TEXT[],
    estimated_competition VARCHAR(20) CHECK (estimated_competition IN ('HIGH', 'MEDIUM', 'LOW')),
    priority_rank INTEGER,
    recommendation_level VARCHAR(20) NOT NULL CHECK (recommendation_level IN ('HIGH', 'MEDIUM', 'LOW')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 우선순위 점수 테이블 (기존 유지)
CREATE TABLE priority_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_qualification_id UUID NOT NULL REFERENCES user_qualifications(id) ON DELETE CASCADE,
    children_score INTEGER DEFAULT 0,
    elderly_parent_score INTEGER DEFAULT 0,
    local_residence_score INTEGER DEFAULT 0,
    subscription_period_score INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);