export type LivingSpace = 'small' | 'medium' | 'large';

export type ActivityLevel = 'low' | 'medium' | 'high';

export type ExperienceLevel = 'none' | 'some' | 'experienced';

export type TimeAvailable = 'less_than_2h' | '2_to_4h' | 'more_than_4h';

export type HouseholdType = 'alone' | 'family_no_kids' | 'family_with_kids' | 'elderly';

export interface SurveyAnswers {
  livingSpace: LivingSpace;
  activityLevel: ActivityLevel;
  experience: ExperienceLevel;
  timeAvailable: TimeAvailable;
  householdType: HouseholdType;
}

