-- 공급유형 및 조건 마스터 데이터
-- Housing Supply Type and Condition Master Data

-- ============================================================================
-- 1. 공급유형 카테고리 (대분류)
-- ============================================================================

INSERT INTO supply_categories (category_code, category_name, description, display_order) VALUES
('SPECIAL', '특별공급', '다자녀, 신혼부부 등 특별한 자격을 갖춘 세대를 위한 공급', 1),
('GENERAL', '일반공급', '일반적인 청약 조건을 만족하는 세대를 위한 공급', 2);

-- ============================================================================
-- 2. 공급유형 서브카테고리 (소분류)
-- ============================================================================

INSERT INTO supply_subcategories (
    category_id, subcategory_code, subcategory_name, description, display_order,
    is_special_supply, requires_income_standard, requires_asset_standard, 
    requires_subscription, requires_priority_ranking
) VALUES
-- 특별공급 유형들
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'MULTI_CHILD', '다자녀가구 특별공급', '미성년 자녀 3명 이상 또는 2명이면서 영유아 포함', 1,
    TRUE, TRUE, TRUE, TRUE, TRUE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'NEWLYWED', '신혼부부 특별공급', '혼인기간 7년 이내 또는 6세 이하 자녀를 둔 무주택세대구성원', 2,
    TRUE, TRUE, TRUE, TRUE, FALSE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'FIRST_TIME', '생애최초 특별공급', '생애최초로 주택을 구입하는 무주택세대구성원', 3,
    TRUE, TRUE, TRUE, TRUE, FALSE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'ELDERLY_PARENT', '노부모부양 특별공급', '만 65세 이상 직계존속을 3년 이상 부양하는 무주택세대구성원', 4,
    TRUE, TRUE, TRUE, TRUE, TRUE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'NEWBORN', '신생아 특별공급', '2021년 이후 출생아를 둔 무주택세대구성원', 5,
    TRUE, TRUE, TRUE, TRUE, FALSE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'INSTITUTIONAL', '기관추천 특별공급', '국가유공자, 장애인, 철거민 등 관련 기관에서 추천받은 자', 6,
    TRUE, FALSE, FALSE, TRUE, FALSE
),
(
    (SELECT id FROM supply_categories WHERE category_code = 'SPECIAL'),
    'PRE_APPLICATION', '사전청약 당첨자', '사전청약에서 당첨된 자', 7,
    TRUE, FALSE, FALSE, FALSE, FALSE
),

-- 일반공급 유형
(
    (SELECT id FROM supply_categories WHERE category_code = 'GENERAL'),
    'GENERAL', '일반공급', '특별공급 외의 일반적인 청약 자격을 갖춘 세대', 1,
    FALSE, FALSE, FALSE, TRUE, TRUE
);

-- ============================================================================
-- 3. 조건 카테고리
-- ============================================================================

INSERT INTO condition_categories (category_code, category_name, description, data_type, display_order) VALUES
('AGE', '나이', '연령 관련 조건', 'NUMBER', 1),
('MARRIAGE', '혼인', '결혼 관련 조건', 'BOOLEAN', 2),
('MARRIAGE_PERIOD', '혼인기간', '결혼 기간 관련 조건', 'NUMBER', 3),
('CHILDREN', '자녀', '자녀 수 관련 조건', 'NUMBER', 4),
('CHILDREN_AGE', '자녀나이', '자녀 나이 관련 조건', 'NUMBER', 5),
('HOUSING_OWNERSHIP', '주택보유', '주택 보유 관련 조건', 'BOOLEAN', 6),
('HOUSING_COUNT', '보유주택수', '보유 주택 수 관련 조건', 'NUMBER', 7),
('RESIDENCE_PERIOD', '거주기간', '거주 기간 관련 조건', 'NUMBER', 8),
('SUBSCRIPTION_PERIOD', '청약가입기간', '청약통장 가입 기간 관련 조건', 'NUMBER', 9),
('DEPOSIT_COUNT', '납입횟수', '청약통장 납입 횟수 관련 조건', 'NUMBER', 10),
('INCOME', '소득', '소득 관련 조건', 'NUMBER', 11),
('ASSETS', '자산', '자산 관련 조건', 'NUMBER', 12),
('SPECIAL_STATUS', '특별자격', '국가유공자, 장애인 등 특별 자격', 'BOOLEAN', 13),
('ELDERLY_SUPPORT', '노부모부양', '직계존속 부양 관련 조건', 'BOOLEAN', 14),
('NEWBORN', '신생아', '신생아 관련 조건', 'BOOLEAN', 15);

-- ============================================================================
-- 4. 조건 템플릿 (재사용 가능한 조건들)
-- ============================================================================

INSERT INTO condition_templates (
    category_id, condition_code, condition_name, condition_description,
    numeric_value, boolean_value, text_value, operator, display_order
) VALUES
-- 나이 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'AGE'),
    'MIN_AGE_19', '만 19세 이상', '신청자가 만 19세 이상이어야 함',
    19, NULL, NULL, '>=', 1
),

-- 혼인 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'MARRIAGE'),
    'MARRIED', '혼인 중', '혼인신고를 필한 배우자가 있는 상태',
    NULL, TRUE, NULL, '=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'MARRIAGE_PERIOD'),
    'MARRIED_WITHIN_7_YEARS', '혼인기간 7년 이내', '혼인신고일로부터 7년 이내',
    7, NULL, NULL, '<=', 1
),

-- 자녀 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'CHILDREN'),
    'CHILDREN_3_OR_MORE', '미성년 자녀 3명 이상', '미성년 자녀가 3명 이상',
    3, NULL, NULL, '>=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'CHILDREN'),
    'CHILDREN_2_WITH_INFANT', '자녀 2명 (영유아 포함)', '미성년 자녀 2명 중 영유아 포함',
    2, NULL, '영유아 포함', '=', 2
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'CHILDREN_AGE'),
    'CHILD_UNDER_6', '6세 이하 자녀', '6세 이하의 자녀가 있음',
    6, NULL, NULL, '<=', 1
),

-- 주택보유 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'HOUSING_OWNERSHIP'),
    'NO_HOUSE_OWNER', '무주택세대구성원', '세대구성원 전원이 주택을 소유하지 않음',
    NULL, FALSE, NULL, '=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'HOUSING_COUNT'),
    'MAX_1_HOUSE', '1주택 이하', '보유 주택이 1채 이하',
    1, NULL, NULL, '<=', 1
),

-- 거주기간 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'RESIDENCE_PERIOD'),
    'RESIDENCE_1_YEAR', '해당지역 1년 이상 거주', '해당 지역에 1년 이상 거주',
    12, NULL, NULL, '>=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'RESIDENCE_PERIOD'),
    'RESIDENCE_2_YEARS', '해당지역 2년 이상 거주', '해당 지역에 2년 이상 거주',
    24, NULL, NULL, '>=', 2
),

-- 청약통장 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'SUBSCRIPTION_PERIOD'),
    'SUBSCRIPTION_6_MONTHS', '청약통장 6개월 이상 가입', '청약통장에 6개월 이상 가입',
    6, NULL, NULL, '>=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'SUBSCRIPTION_PERIOD'),
    'SUBSCRIPTION_2_YEARS', '청약통장 2년 이상 가입', '청약통장에 2년 이상 가입',
    24, NULL, NULL, '>=', 2
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'DEPOSIT_COUNT'),
    'DEPOSIT_6_TIMES', '6회 이상 납입', '청약통장에 6회 이상 납입',
    6, NULL, NULL, '>=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'DEPOSIT_COUNT'),
    'DEPOSIT_24_TIMES', '24회 이상 납입', '청약통장에 24회 이상 납입',
    24, NULL, NULL, '>=', 2
),

-- 소득 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'INCOME'),
    'INCOME_120_PERCENT', '소득 120% 이하', '도시근로자 월평균소득 120% 이하',
    120, NULL, NULL, '<=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'INCOME'),
    'INCOME_130_PERCENT', '소득 130% 이하', '도시근로자 월평균소득 130% 이하',
    130, NULL, NULL, '<=', 2
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'INCOME'),
    'INCOME_140_PERCENT', '소득 140% 이하', '도시근로자 월평균소득 140% 이하',
    140, NULL, NULL, '<=', 3
),

-- 특별자격 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'SPECIAL_STATUS'),
    'NATIONAL_MERIT', '국가유공자', '국가보훈처에서 국가유공자로 인정받은 자',
    NULL, TRUE, NULL, '=', 1
),
(
    (SELECT id FROM condition_categories WHERE category_code = 'SPECIAL_STATUS'),
    'DISABLED_PERSON', '장애인', '장애인복지법에 따른 장애인',
    NULL, TRUE, NULL, '=', 2
),

-- 노부모부양 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'ELDERLY_SUPPORT'),
    'SUPPORT_ELDERLY_3_YEARS', '직계존속 3년 이상 부양', '만 65세 이상 직계존속을 3년 이상 부양',
    3, NULL, NULL, '>=', 1
),

-- 신생아 관련
(
    (SELECT id FROM condition_categories WHERE category_code = 'NEWBORN'),
    'NEWBORN_2021_AFTER', '2021년 이후 출생아', '2021년 1월 1일 이후 출생한 자녀',
    NULL, TRUE, '2021년 이후', '=', 1
);

-- ============================================================================
-- 5. 공급유형별 기본 조건 매핑 (예시 - 실제 공고에서는 동적으로 생성)
-- ============================================================================
-- 이 부분은 실제 PDF 파싱 시 동적으로 생성되므로 여기서는 템플릿만 제공

-- ============================================================================
-- 6. 인덱스 생성
-- ============================================================================

-- 카테고리 관련 인덱스
CREATE INDEX idx_supply_subcategories_category ON supply_subcategories(category_id);
CREATE INDEX idx_supply_subcategories_code ON supply_subcategories(subcategory_code);
CREATE INDEX idx_supply_subcategories_special ON supply_subcategories(is_special_supply);

-- 조건 관련 인덱스
CREATE INDEX idx_condition_templates_category ON condition_templates(category_id);
CREATE INDEX idx_condition_templates_code ON condition_templates(condition_code);
CREATE INDEX idx_supply_type_conditions_supply_type ON supply_type_conditions(supply_type_id);
CREATE INDEX idx_supply_type_conditions_template ON supply_type_conditions(condition_template_id);
CREATE INDEX idx_supply_type_conditions_type ON supply_type_conditions(condition_type);

-- 공급유형 관련 인덱스
CREATE INDEX idx_supply_types_housing_application ON supply_types(housing_application_id);
CREATE INDEX idx_supply_types_subcategory ON supply_types(subcategory_id);
CREATE INDEX idx_supply_types_available ON supply_types(is_available);

-- ============================================================================
-- 7. 뷰 생성 (조회 편의성을 위해)
-- ============================================================================

-- 공급유형별 전체 정보 뷰
CREATE VIEW supply_types_with_details AS
SELECT 
    st.id,
    st.housing_application_id,
    ha.title as housing_title,
    sc.category_name,
    ssc.subcategory_code,
    ssc.subcategory_name,
    ssc.description,
    st.units,
    st.is_available,
    ssc.is_special_supply,
    ssc.requires_income_standard,
    ssc.requires_asset_standard,
    ssc.requires_subscription,
    ssc.requires_priority_ranking
FROM supply_types st
JOIN supply_subcategories ssc ON st.subcategory_id = ssc.id
JOIN supply_categories sc ON ssc.category_id = sc.id
JOIN housing_applications ha ON st.housing_application_id = ha.id;

-- 공급유형별 조건 상세 뷰
CREATE VIEW supply_type_conditions_with_details AS
SELECT 
    stc.id,
    stc.supply_type_id,
    ssc.subcategory_name,
    cc.category_name as condition_category,
    ct.condition_name,
    ct.condition_description,
    COALESCE(stc.specific_numeric_value, ct.numeric_value) as numeric_value,
    COALESCE(stc.specific_boolean_value, ct.boolean_value) as boolean_value,
    COALESCE(stc.specific_text_value, ct.text_value) as text_value,
    COALESCE(stc.specific_operator, ct.operator) as operator,
    stc.condition_type,
    stc.score_points
FROM supply_type_conditions stc
JOIN condition_templates ct ON stc.condition_template_id = ct.id
JOIN condition_categories cc ON ct.category_id = cc.id
JOIN supply_types st ON stc.supply_type_id = st.id
JOIN supply_subcategories ssc ON st.subcategory_id = ssc.id;