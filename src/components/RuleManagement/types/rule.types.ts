export type RuleStatus = "Active" | "Inactive";
export type RuleOperator = "equals" | "not_equals" | "greater_than" | "less_than";

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: string;
}

export interface ManagedRule {
  id: string;
  name: string;
  description: string;
  type: string;
  status: RuleStatus;
  action: string;
  conditions: RuleCondition[];
}
