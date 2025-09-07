// Entity imports
import { HousingApplication } from './housing-application.entity';
import { SupplyCategory } from './supply-category.entity';
import { SupplySubcategory } from './supply-subcategory.entity';
import { SupplyType } from './supply-type.entity';
import { ConditionCategory } from './condition-category.entity';
import { ConditionTemplate } from './condition-template.entity';
import { SupplyTypeCondition } from './supply-type-condition.entity';
import { User } from './user.entity';
import { UserQualification } from './user-qualification.entity';
import { UserSubscriptionAccount } from './user-subscription-account.entity';
import { MatchingResult } from './matching-result.entity';
import { SupplyTypeQualification } from './supply-type-qualification.entity';
import { SubscriptionRequirement } from './subscription-requirement.entity';
import { IncomeStandard } from './income-standard.entity';
import { AssetStandard } from './asset-standard.entity';
import { RegionalPriority } from './regional-priority.entity';
import { PriorityScore } from './priority-score.entity';
import { NationalIncomeStandard } from './national-income-standard.entity';

// Entity exports for easy importing
export { HousingApplication, HousingType, ProcessingStatus } from './housing-application.entity';
export { SupplyCategory } from './supply-category.entity';
export { SupplySubcategory } from './supply-subcategory.entity';
export { SupplyType } from './supply-type.entity';
export { ConditionCategory, DataType } from './condition-category.entity';
export { ConditionTemplate } from './condition-template.entity';
export { SupplyTypeCondition, ConditionType } from './supply-type-condition.entity';
export { User } from './user.entity';
export { UserQualification, EmploymentType } from './user-qualification.entity';
export { UserSubscriptionAccount, AccountType } from './user-subscription-account.entity';
export { MatchingResult, RecommendationLevel } from './matching-result.entity';
export { SupplyTypeQualification, CompetitionLevel, QualificationRecommendationLevel } from './supply-type-qualification.entity';
export { SubscriptionRequirement } from './subscription-requirement.entity';
export { IncomeStandard, StandardType } from './income-standard.entity';
export { AssetStandard } from './asset-standard.entity';
export { RegionalPriority } from './regional-priority.entity';
export { PriorityScore } from './priority-score.entity';
export { NationalIncomeStandard } from './national-income-standard.entity';

// Array of all entities for TypeORM configuration
export const entities = [
  HousingApplication,
  SupplyCategory,
  SupplySubcategory,
  SupplyType,
  ConditionCategory,
  ConditionTemplate,
  SupplyTypeCondition,
  User,
  UserQualification,
  UserSubscriptionAccount,
  MatchingResult,
  SupplyTypeQualification,
  SubscriptionRequirement,
  IncomeStandard,
  AssetStandard,
  RegionalPriority,
  PriorityScore,
  NationalIncomeStandard,
];