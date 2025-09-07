-- PostgreSQL Indexes and Constraints for Housing Application Matching System

-- ============================================================================
-- 기본 인덱스 (성능 최적화)
-- ============================================================================

-- 청약공고 테이블 인덱스
CREATE INDEX idx_housing_applications_location ON housing_applications(location);
CREATE INDEX idx_housing_applications_housing_type ON housing_applications(housing_type);
CREATE INDEX idx_housing_applications_dates ON housing_applications(application_start_date, application_end_date);
CREATE INDEX idx_housing_applications_processed ON housing_applications(processed);
CREATE INDEX idx_housing_applications_created_at ON housing_applications(created_at DESC);

-- 공급유형 테이블 인덱스
CREATE INDEX idx_supply_types_housing_application ON supply_types(housing_application_id);
CREATE INDEX idx_supply_types_type ON supply_types(supply_type);
CREATE INDEX idx_supply_types_units ON supply_types(units DESC);

-- 사용자 관련 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_qualifications_user_id ON user_qualifications(user_id);
CREATE INDEX idx_user_qualifications_location ON user_qualifications(current_address);
CREATE INDEX idx_user_qualifications_income ON user_qualifications(household_income);
CREATE INDEX idx_user_qualifications_assets ON user_qualifications(total_assets);

-- 청약통장 정보 인덱스
CREATE INDEX idx_subscription_accounts_user_qualification ON user_subscription_accounts(user_qualification_id);
CREATE INDEX idx_subscription_accounts_type ON user_subscription_accounts(account_type);
CREATE INDEX idx_subscription_accounts_period ON user_subscription_accounts(subscription_period_months DESC);

-- 매칭 결과 인덱스
CREATE INDEX idx_matching_results_user ON matching_results(user_qualification_id);
CREATE INDEX idx_matching_results_housing ON matching_results(housing_application_id);
CREATE INDEX idx_matching_results_recommendation ON matching_results(overall_recommendation);
CREATE INDEX idx_matching_results_score ON matching_results(matching_score DESC);
CREATE INDEX idx_matching_results_created_at ON matching_results(created_at DESC);

-- 공급유형별 자격 결과 인덱스
CREATE INDEX idx_supply_type_qualifications_matching_result ON supply_type_qualifications(matching_result_id);
CREATE INDEX idx_supply_type_qualifications_type ON supply_type_qualifications(supply_type);
CREATE INDEX idx_supply_type_qualifications_eligible ON supply_type_qualifications(is_eligible);
CREATE INDEX idx_supply_type_qualifications_recommendation ON supply_type_qualifications(recommendation_level);

-- ============================================================================
-- 복합 인덱스 (성능 최적화)
-- ============================================================================

-- 청약공고 검색용 복합 인덱스
CREATE INDEX idx_housing_applications_search ON housing_applications(location, housing_type, processed, application_end_date);

-- 사용자 자격 검색용 복합 인덱스
CREATE INDEX idx_user_qualifications_basic ON user_qualifications(age, is_married, children_count, household_size);
CREATE INDEX idx_user_qualifications_financial ON user_qualifications(household_income, total_assets, is_dual_income);
CREATE INDEX idx_user_qualifications_housing ON user_qualifications(has_owned_house, current_house_count, is_first_time_homebuyer);

-- 매칭 성능 향상용 복합 인덱스
CREATE INDEX idx_matching_user_housing ON matching_results(user_qualification_id, housing_application_id, created_at DESC);

-- ============================================================================
-- 외래키 제약조건 (이미 스키마에서 정의되었지만 명시적으로 나열)
-- ============================================================================

-- supply_types -> housing_applications
-- subscription_requirements -> supply_types
-- income_standards -> supply_types
-- asset_standards -> supply_types
-- regional_priorities -> housing_applications
-- user_qualifications -> users
-- user_subscription_accounts -> user_qualifications
-- matching_results -> user_qualifications, housing_applications
-- supply_type_qualifications -> matching_results
-- priority_scores -> user_qualifications

-- ============================================================================
-- 성능 최적화를 위한 추가 제약조건
-- ============================================================================

-- 중복 방지 제약조건
CREATE UNIQUE INDEX idx_unique_supply_type_per_housing ON supply_types(housing_application_id, supply_type);
CREATE UNIQUE INDEX idx_unique_regional_priority_per_housing ON regional_priorities(housing_application_id);
CREATE UNIQUE INDEX idx_unique_user_qualification_per_user ON user_qualifications(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_unique_subscription_account_per_qualification ON user_subscription_accounts(user_qualification_id);
CREATE UNIQUE INDEX idx_unique_priority_score_per_qualification ON priority_scores(user_qualification_id);

-- ============================================================================
-- 파티셔닝 (대용량 데이터 처리용 - 옵션)
-- ============================================================================

-- 연도별 파티셔닝 (매칭 결과가 많아질 경우)
-- CREATE TABLE matching_results_y2024 PARTITION OF matching_results 
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- ============================================================================
-- 트리거 함수 (updated_at 자동 업데이트)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_housing_applications_updated_at 
    BEFORE UPDATE ON housing_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_qualifications_updated_at 
    BEFORE UPDATE ON user_qualifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 뷰 (자주 사용하는 조인 쿼리 최적화)
-- ============================================================================

-- 청약공고와 공급유형을 조인한 뷰
CREATE VIEW housing_applications_with_supply_types AS
SELECT 
    ha.id as housing_id,
    ha.title,
    ha.location,
    ha.housing_type,
    ha.total_units,
    ha.application_start_date,
    ha.application_end_date,
    st.supply_type,
    st.units as supply_units,
    st.conditions
FROM housing_applications ha
LEFT JOIN supply_types st ON ha.id = st.housing_application_id
WHERE ha.processed = true;

-- 사용자 자격과 청약통장 정보를 조인한 뷰
CREATE VIEW user_qualifications_with_subscription AS
SELECT 
    uq.*,
    usa.has_account,
    usa.account_type,
    usa.subscription_period_months,
    usa.deposit_count,
    usa.deposit_amount
FROM user_qualifications uq
LEFT JOIN user_subscription_accounts usa ON uq.id = usa.user_qualification_id;

-- 매칭 결과 상세 뷰
CREATE VIEW matching_results_detailed AS
SELECT 
    mr.id as matching_id,
    mr.overall_recommendation,
    mr.matching_score,
    mr.summary,
    mr.created_at as matched_at,
    ha.title as housing_title,
    ha.location,
    ha.application_end_date,
    u.name as user_name,
    u.email as user_email,
    COUNT(stq.id) as eligible_supply_types_count
FROM matching_results mr
JOIN housing_applications ha ON mr.housing_application_id = ha.id
JOIN user_qualifications uq ON mr.user_qualification_id = uq.id
LEFT JOIN users u ON uq.user_id = u.id
LEFT JOIN supply_type_qualifications stq ON mr.id = stq.matching_result_id AND stq.is_eligible = true
GROUP BY mr.id, ha.title, ha.location, ha.application_end_date, u.name, u.email;

-- ============================================================================
-- 통계용 뷰
-- ============================================================================

-- 청약공고 통계
CREATE VIEW housing_application_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    housing_type,
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE processed = true) as processed_applications,
    AVG(total_units) as avg_units
FROM housing_applications
GROUP BY DATE_TRUNC('month', created_at), housing_type;

-- 매칭 결과 통계
CREATE VIEW matching_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    overall_recommendation,
    COUNT(*) as match_count,
    AVG(matching_score) as avg_score
FROM matching_results
GROUP BY DATE_TRUNC('day', created_at), overall_recommendation;