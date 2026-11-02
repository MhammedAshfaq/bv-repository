import type { ManagedRule } from "../types/rule.types";

export const dummyRules: ManagedRule[] = [
  { id: "RULE-001", name: "Age Validation", description: "Validate customer age", type: "Validation", status: "Active", action: "Approve", conditions: [{ field: "Age", operator: "greater_than", value: "18" }] },
  { id: "RULE-002", name: "Country Restriction", description: "Restrict unsupported countries", type: "Eligibility", status: "Active", action: "Reject", conditions: [{ field: "Country", operator: "not_equals", value: "XX" }] },
  { id: "RULE-003", name: "Transaction Limit", description: "Validate transaction amount", type: "Validation", status: "Inactive", action: "Manual Review", conditions: [{ field: "Amount", operator: "less_than", value: "10000" }] },
  { id: "RULE-004", name: "Customer Eligibility", description: "Check customer eligibility", type: "Eligibility", status: "Active", action: "Approve", conditions: [{ field: "Customer Type", operator: "equals", value: "Retail" }] },
  { id: "RULE-005", name: "Risk Assessment", description: "Check customer risk score", type: "Risk", status: "Active", action: "Manual Review", conditions: [{ field: "Amount", operator: "less_than", value: "5000" }] },
];
