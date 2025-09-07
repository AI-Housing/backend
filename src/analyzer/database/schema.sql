-- PostgreSQL Database Schema for Housing Application Matching System

-- 청약공고 메인 테이블
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

-- 공급유형 테이블
CREATE TABLE supply_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housing_application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    supply_type VARCHAR(50) NOT NULL CHECK (supply_type IN (
        'PRE_APPLICATION', 'INSTITUTIONAL_RECOMMENDATION', 'MULTI_CHILD_FAMILY',
        'NEWLYWED', 'FIRST_TIME_HOMEBUYER', 'ELDERLY_PARENT_SUPPORT', 
        'NEWBORN', 'GENERAL'
    )),
    units INTEGER NOT NULL,
    conditions TEXT[],
    first_priority_conditions TEXT[],
    second_priority_conditions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 청약통장 요건 테이블
CREATE TABLE subscription_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    subscription_period_months INTEGER,
    deposit_count INTEGER,
    deposit_amount BIGINT, -- 천원 단위
    housing_type_limit VARCHAR(100),
    account_types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 소득기준 테이블
CREATE TABLE income_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    standard_type VARCHAR(50) NOT NULL CHECK (standard_type IN ('PRIORITY', 'GENERAL', 'LOTTERY')),
    percentage INTEGER NOT NULL, -- 100, 120, 130 등
    dual_income_percentage INTEGER,
    ratio INTEGER NOT NULL, -- 공급비율 (70, 20, 10 등)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 자산기준 테이블
CREATE TABLE asset_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supply_type_id UUID NOT NULL REFERENCES supply_types(id) ON DELETE CASCADE,
    max_real_estate BIGINT, -- 천원 단위
    max_vehicle BIGINT,
    max_financial_assets BIGINT,
    max_total_assets BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 지역 우선공급 테이블
CREATE TABLE regional_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housing_application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    local_city_ratio INTEGER, -- 해당 시/군 우선공급 비율
    local_province_ratio INTEGER, -- 해당 도 우선공급 비율
    other_region_ratio INTEGER, -- 기타 지역 비율
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 소득기준표 (전국 기준)
CREATE TABLE national_income_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    household_size INTEGER NOT NULL,
    standard_100 BIGINT NOT NULL, -- 100% 기준 (천원)
    standard_120 BIGINT,
    standard_130 BIGINT,
    standard_140 BIGINT,
    standard_200 BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, household_size)
);

-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 자격정보 테이블
CREATE TABLE user_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 개인정보
    age INTEGER NOT NULL,
    is_married BOOLEAN NOT NULL DEFAULT FALSE,
    marriage_date DATE,
    is_first_time_homebuyer BOOLEAN NOT NULL DEFAULT FALSE,
    household_size INTEGER NOT NULL DEFAULT 1,
    
    -- 자녀정보
    children_count INTEGER DEFAULT 0,
    minor_children_count INTEGER DEFAULT 0,
    has_newborn BOOLEAN DEFAULT FALSE,
    newborn_birth_date DATE,
    
    -- 부모부양정보
    supports_elderly_parent BOOLEAN DEFAULT FALSE,
    elderly_support_period_months INTEGER,
    
    -- 거주지정보
    current_address VARCHAR(200) NOT NULL,
    residence_period_months INTEGER NOT NULL,
    has_local_connection BOOLEAN DEFAULT FALSE,
    
    -- 주택보유현황
    has_owned_house BOOLEAN NOT NULL DEFAULT FALSE,
    current_house_count INTEGER DEFAULT 0,
    previous_house_count INTEGER DEFAULT 0,
    last_house_sale_date DATE,
    house_value BIGINT, -- 천원 단위
    
    -- 소득정보
    applicant_income BIGINT NOT NULL, -- 월소득 (천원)
    applicant_employment_type VARCHAR(20) CHECK (applicant_employment_type IN ('EMPLOYEE', 'SELF_EMPLOYED', 'UNEMPLOYED')),
    spouse_income BIGINT DEFAULT 0,
    spouse_employment_type VARCHAR(20) CHECK (spouse_employment_type IN ('EMPLOYEE', 'SELF_EMPLOYED', 'UNEMPLOYED')),
    household_income BIGINT NOT NULL,
    annual_income BIGINT NOT NULL,
    is_dual_income BOOLEAN DEFAULT FALSE,
    
    -- 자산정보
    real_estate_assets BIGINT DEFAULT 0,
    financial_assets BIGINT DEFAULT 0,
    vehicle_assets BIGINT DEFAULT 0,
    total_assets BIGINT DEFAULT 0,
    
    -- 특별자격
    has_institutional_recommendation BOOLEAN DEFAULT FALSE,
    institution_type VARCHAR(100),
    has_special_status BOOLEAN DEFAULT FALSE,
    special_status_type VARCHAR(100),
    has_disability BOOLEAN DEFAULT FALSE,
    is_north_korean_defector BOOLEAN DEFAULT FALSE,
    
    -- 청약이력
    has_won_before BOOLEAN DEFAULT FALSE,
    last_win_date DATE,
    rewinning_restriction_end_date DATE,
    has_applied_recently BOOLEAN DEFAULT FALSE,
    
    -- 제한사항
    has_overseas_residence BOOLEAN DEFAULT FALSE,
    overseas_residence_months INTEGER DEFAULT 0,
    has_criminal_record BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 청약통장 정보 테이블
CREATE TABLE user_subscription_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_qualification_id UUID NOT NULL REFERENCES user_qualifications(id) ON DELETE CASCADE,
    has_account BOOLEAN NOT NULL DEFAULT FALSE,
    account_type VARCHAR(50) CHECK (account_type IN ('HOUSING_SUBSCRIPTION', 'YOUTH_HOUSING', 'WORKER_HOUSING')),
    subscription_date DATE,
    subscription_period_months INTEGER,
    deposit_count INTEGER,
    deposit_amount BIGINT, -- 천원 단위
    housing_type_limit VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 매칭 결과 테이블
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

-- 공급유형별 자격 결과 테이블
CREATE TABLE supply_type_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matching_result_id UUID NOT NULL REFERENCES matching_results(id) ON DELETE CASCADE,
    supply_type VARCHAR(50) NOT NULL,
    is_eligible BOOLEAN NOT NULL,
    eligibility_reasons TEXT[],
    ineligibility_reasons TEXT[],
    estimated_competition VARCHAR(20) CHECK (estimated_competition IN ('HIGH', 'MEDIUM', 'LOW')),
    priority_rank INTEGER,
    recommendation_level VARCHAR(20) NOT NULL CHECK (recommendation_level IN ('HIGH', 'MEDIUM', 'LOW')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 우선순위 점수 테이블
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