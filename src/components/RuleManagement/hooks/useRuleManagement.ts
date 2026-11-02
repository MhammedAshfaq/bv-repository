import { useMemo, useState } from "react";
import { dummyLists } from "../data/dummyLists";
import { dummyRules } from "../data/dummyRules";
import type { ManagedList } from "../types/list.types";
import type { ManagedRule } from "../types/rule.types";

export function useRuleManagement() {
  const [rules, setRules] = useState<ManagedRule[]>(dummyRules);
  const [lists, setLists] = useState<ManagedList[]>(dummyLists);

  const metrics = useMemo(() => ({
    totalRules: rules.length,
    activeRules: rules.filter((rule) => rule.status === "Active").length,
    inactiveRules: rules.filter((rule) => rule.status === "Inactive").length,
    totalLists: lists.length,
  }), [rules, lists]);

  return { rules, setRules, lists, setLists, metrics };
}
