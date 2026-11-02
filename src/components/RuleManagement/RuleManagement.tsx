import { useMemo, useState } from "react";
import { Button } from "../Button/Button";
import { Dropdown, type DropdownOption } from "../Dropdown/Dropdown";
import { useRuleManagement } from "./hooks/useRuleManagement";
import { RuleForm } from "./components/RuleForm";
import { ListForm } from "./components/ListForm";
import { RulesTable } from "./components/RulesTable";
import { ListsTable } from "./components/ListsTable";
import { DeleteConfirmation } from "./components/DeleteConfirmation";
import type { ManagedRule } from "./types/rule.types";

type Action = "" | "create" | "list" | "update" | "delete";

const actions: DropdownOption[] = [
  { label: "Choose an action…", value: "" },
  { label: "Create Rule", value: "create" },
  { label: "Add List", value: "list" },
  { label: "Update Rule", value: "update" },
  { label: "Delete Rule", value: "delete" },
];

export interface RuleManagementProps {
  title?: string;
}

export function RuleManagement({ title = "Rule Management" }: RuleManagementProps) {
  const { rules, setRules, lists, setLists, metrics } = useRuleManagement();
  const [action, setAction] = useState<Action>("");
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [message, setMessage] = useState("");
  const [pendingDeleteRule, setPendingDeleteRule] = useState<ManagedRule>();

  const selectedRule = rules.find((rule) => rule.id === selectedRuleId);
  const filteredRules = useMemo(() => rules.filter((rule) => {
    const matchesText = `${rule.id} ${rule.name} ${rule.description} ${rule.type}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || rule.status === statusFilter;
    return matchesText && matchesStatus;
  }), [rules, search, statusFilter]);

  function closeAction() {
    setAction("");
    setSelectedRuleId("");
  }

  function nextId(prefix: "RULE" | "LIST", ids: string[]) {
    let id = `${prefix}-${String(Date.now()).slice(-8)}`;
    let suffix = 1;
    while (ids.includes(id)) {
      id = `${prefix}-${String(Date.now()).slice(-8)}-${suffix++}`;
    }
    return id;
  }

  function createRule(rule: Omit<ManagedRule, "id">) {
    const id = nextId("RULE", rules.map((item) => item.id));
    setRules((current) => [{ ...rule, id }, ...current]);
    setMessage(`Rule "${rule.name}" was created successfully (${id}).`);
    closeAction();
  }

  function updateRule(rule: Omit<ManagedRule, "id">) {
    if (!selectedRule) return;
    setRules((current) => current.map((currentRule) => currentRule.id === selectedRule.id ? { ...rule, id: selectedRule.id } : currentRule));
    setMessage(`Rule "${rule.name}" was updated successfully.`);
    closeAction();
  }

  function deleteRule() {
    if (!pendingDeleteRule) return;
    setRules((current) => current.filter((rule) => rule.id !== pendingDeleteRule.id));
    setMessage(`Rule "${pendingDeleteRule.name}" was deleted.`);
    setPendingDeleteRule(undefined);
    closeAction();
  }

  return (
    <main className="pui-rule-management">
      <header className="pui-dashboard-header">
        <div><p className="pui-eyebrow">Platform controls</p><h1>{title}</h1>
          <p className="pui-subtitle">Create, review, and manage reusable decision rules and lists.</p></div>
        <div className="pui-action-picker">
          <Dropdown label="Actions" value={action} options={actions} onChange={(event) => {
            setAction(event.target.value as Action);
            setSelectedRuleId("");
            setMessage("");
          }} />
        </div>
      </header>

      {message && <div className="pui-success" role="status">{message}<button aria-label="Dismiss message" onClick={() => setMessage("")}>×</button></div>}

      <section className="pui-metrics" aria-label="Dashboard summary">
        <article className="pui-metric"><span>Total Rules</span><strong>{metrics.totalRules}</strong></article>
        <article className="pui-metric"><span>Active Rules</span><strong>{metrics.activeRules}</strong></article>
        <article className="pui-metric"><span>Inactive Rules</span><strong>{metrics.inactiveRules}</strong></article>
        <article className="pui-metric"><span>Total Lists</span><strong>{metrics.totalLists}</strong></article>
      </section>

      {action === "create" && <section className="pui-panel pui-action-panel"><h2>Create Rule</h2><RuleForm action="create" onSubmit={createRule} onCancel={closeAction} /></section>}
      {action === "list" && <section className="pui-panel pui-action-panel"><h2>Add List</h2><ListForm onSubmit={(list) => {
        const id = nextId("LIST", lists.map((item) => item.id));
        setLists((current) => [{ ...list, id }, ...current]);
        setMessage(`List "${list.name}" was created successfully (${id}).`);
        closeAction();
      }} onCancel={closeAction} /></section>}
      {action === "update" && <section className="pui-panel pui-action-panel"><h2>Update Rule</h2>
        {rules.length === 0 ? <p className="pui-empty">There are no rules to update.</p> : <>
          <Dropdown label="Select Rule" value={selectedRuleId} options={[{ label: "Choose a rule…", value: "" }, ...rules.map((rule) => ({ label: `${rule.id} — ${rule.name}`, value: rule.id }))]} onChange={(event) => setSelectedRuleId(event.target.value)} />
          {selectedRule && <RuleForm key={selectedRule.id} action="update" rule={selectedRule} onSubmit={updateRule} onCancel={closeAction} />}
        </>}
      </section>}
      {action === "delete" && <section className="pui-panel pui-action-panel"><h2>Delete Rule</h2>
        {rules.length === 0 ? <p className="pui-empty">There are no rules to delete.</p> : <>
          <Dropdown label="Select Rule" value={selectedRuleId} options={[{ label: "Choose a rule…", value: "" }, ...rules.map((rule) => ({ label: `${rule.id} — ${rule.name}`, value: rule.id }))]} onChange={(event) => setSelectedRuleId(event.target.value)} />
          {selectedRule && <div className="pui-delete-preview"><strong>{selectedRule.name}</strong><span>{selectedRule.id} · {selectedRule.type} · {selectedRule.status}</span><p>{selectedRule.description}</p><Button variant="danger" onClick={() => setPendingDeleteRule(selectedRule)}>Delete Rule</Button></div>}
        </>}
      </section>}

      <section className="pui-panel">
        <div className="pui-table-heading"><div><h2>Rules</h2><p>{filteredRules.length} of {rules.length} rules</p></div>
          <div className="pui-filters"><input className="pui-control" aria-label="Search rules" placeholder="Search rules…" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="pui-control" aria-label="Filter rules by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All statuses</option><option>Active</option><option>Inactive</option>
            </select></div>
        </div>
        <RulesTable rules={filteredRules} />
      </section>
      <section className="pui-panel"><div className="pui-table-heading"><div><h2>Lists</h2><p>{lists.length} lists</p></div></div><ListsTable lists={lists} /></section>
      <DeleteConfirmation rule={pendingDeleteRule} onConfirm={deleteRule} onCancel={() => setPendingDeleteRule(undefined)} />
    </main>
  );
}
