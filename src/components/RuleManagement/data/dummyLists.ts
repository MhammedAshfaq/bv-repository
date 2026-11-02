import type { ManagedList } from "../types/list.types";

export const dummyLists: ManagedList[] = [
  { id: "LIST-001", name: "Supported Countries", description: "Countries available for onboarding", type: "Allow List", items: ["US", "GB", "CA"] },
  { id: "LIST-002", name: "Restricted Accounts", description: "Accounts blocked from transactions", type: "Block List", items: ["AC-1002", "AC-1008"] },
  { id: "LIST-003", name: "Trusted Merchants", description: "Pre-approved merchant identifiers", type: "Allow List", items: ["MER-200", "MER-315"] },
];
