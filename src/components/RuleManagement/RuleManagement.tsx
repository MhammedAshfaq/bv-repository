import { useMemo, useState } from "react";
import { Button } from "../Button/Button";
import { useRuleManagement } from "./hooks/useRuleManagement";
import { RuleForm } from "./components/RuleForm";
import { ListForm } from "./components/ListForm";
import { RulesTable } from "./components/RulesTable";
import { ListsTable } from "./components/ListsTable";
import { DeleteConfirmation } from "./components/DeleteConfirmation";
import type { ManagedList } from "./types/list.types";
import type { ManagedRule } from "./types/rule.types";

type View = "rules" | "lists";
type FormMode =
  | { kind: "create-rule" }
  | { kind: "edit-rule"; item: ManagedRule }
  | { kind: "create-list" }
  | { kind: "edit-list"; item: ManagedList };
type PendingDelete =
  | { kind: "rule"; item: ManagedRule }
  | { kind: "list"; item: ManagedList };

export interface RuleManagementProps {
  title?: string;
}

export function RuleManagement({ title = "Rule Management" }: RuleManagementProps) {
  const { rules, setRules, lists, setLists, metrics } = useRuleManagement();
  const [view, setView] = useState<View>("rules");
  const [formMode, setFormMode] = useState<FormMode>();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [message, setMessage] = useState("");

  const filteredRules = useMemo(() => rules.filter((rule) => {
    const matchesText = `${rule.id} ${rule.name} ${rule.description} ${rule.type}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || rule.status === statusFilter;
    return matchesText && matchesStatus;
  }), [rules, search, statusFilter]);
  const filteredLists = useMemo(() => lists.filter((list) =>
    `${list.id} ${list.name} ${list.description} ${list.type} ${list.items.join(" ")}`.toLowerCase().includes(search.toLowerCase()),
  ), [lists, search]);

  function showView(nextView: View) {
    setView(nextView);
    setFormMode(undefined);
    setSearch("");
    setMessage("");
  }

  function openCreateRule() {
    setView("rules");
    setFormMode({ kind: "create-rule" });
    setMessage("");
  }

  function openCreateList() {
    setView("lists");
    setFormMode({ kind: "create-list" });
    setMessage("");
  }

  function nextId(prefix: "RULE" | "LIST", ids: string[]) {
    const timestamp = String(Date.now()).slice(-8);
    let id = `${prefix}-${timestamp}`;
    let suffix = 1;
    while (ids.includes(id)) id = `${prefix}-${timestamp}-${suffix++}`;
    return id;
  }

  function saveRule(rule: Omit<ManagedRule, "id">) {
    if (formMode?.kind === "edit-rule") {
      const { id } = formMode.item;
      setRules((current) => current.map((item) => item.id === id ? { ...rule, id } : item));
      setMessage(`Rule "${rule.name}" was updated successfully.`);
    } else {
      const id = nextId("RULE", rules.map((item) => item.id));
      setRules((current) => [{ ...rule, id }, ...current]);
      setMessage(`Rule "${rule.name}" was created successfully (${id}).`);
    }
    setFormMode(undefined);
  }

  function saveList(list: Omit<ManagedList, "id">) {
    if (formMode?.kind === "edit-list") {
      const { id } = formMode.item;
      setLists((current) => current.map((item) => item.id === id ? { ...list, id } : item));
      setMessage(`List "${list.name}" was updated successfully.`);
    } else {
      const id = nextId("LIST", lists.map((item) => item.id));
      setLists((current) => [{ ...list, id }, ...current]);
      setMessage(`List "${list.name}" was created successfully (${id}).`);
    }
    setFormMode(undefined);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "rule") {
      setRules((current) => current.filter((rule) => rule.id !== pendingDelete.item.id));
      setMessage(`Rule "${pendingDelete.item.name}" was deleted.`);
    } else {
      setLists((current) => current.filter((list) => list.id !== pendingDelete.item.id));
      setMessage(`List "${pendingDelete.item.name}" was deleted.`);
    }
    setPendingDelete(undefined);
  }

  const formTitle = formMode?.kind === "create-rule" ? "Create Rule"
    : formMode?.kind === "edit-rule" ? "Edit Rule"
      : formMode?.kind === "create-list" ? "Add List"
        : formMode?.kind === "edit-list" ? "Edit List" : "";

  return (
    <main className="pui-rule-management">
      <header className="pui-dashboard-header">
        <div>
          <p className="pui-eyebrow">Platform controls</p>
          <h1>{title}</h1>
          <p className="pui-subtitle">Create, review, and manage reusable decision rules and lists.</p>
        </div>
      </header>

      {message && <div className="pui-success" role="status">{message}<button aria-label="Dismiss message" onClick={() => setMessage("")}>×</button></div>}

      <section className="pui-metrics" aria-label="Dashboard summary">
        <article className="pui-metric"><span>Total Rules</span><strong>{metrics.totalRules}</strong></article>
        <article className="pui-metric"><span>Active Rules</span><strong>{metrics.activeRules}</strong></article>
        <article className="pui-metric"><span>Inactive Rules</span><strong>{metrics.inactiveRules}</strong></article>
        <article className="pui-metric"><span>Total Lists</span><strong>{metrics.totalLists}</strong></article>
      </section>

      <div className="pui-workspace">
        <aside className="pui-sidebar" aria-label="Rule management navigation">
          <p className="pui-sidebar-label">Manage</p>
          <button className={`pui-nav-item ${view === "rules" ? "is-active" : ""}`} onClick={() => showView("rules")}>Rule Listing <span>{rules.length}</span></button>
          <button className={`pui-nav-item ${view === "lists" ? "is-active" : ""}`} onClick={() => showView("lists")}>List Listing <span>{lists.length}</span></button>
          <div className="pui-sidebar-divider" />
          <p className="pui-sidebar-label">Create new</p>
          <button className="pui-nav-item pui-nav-create" onClick={openCreateRule}>＋ Create Rule</button>
          <button className="pui-nav-item pui-nav-create" onClick={openCreateList}>＋ Add List</button>
        </aside>

        <div className="pui-content">
          {formMode && <section className="pui-panel pui-action-panel">
            <h2>{formTitle}</h2>
            {(formMode.kind === "create-rule" || formMode.kind === "edit-rule") &&
              <RuleForm key={formMode.kind === "edit-rule" ? formMode.item.id : "new-rule"}
                action={formMode.kind === "create-rule" ? "create" : "update"}
                rule={formMode.kind === "edit-rule" ? formMode.item : undefined}
                onSubmit={saveRule} onCancel={() => setFormMode(undefined)} />}
            {(formMode.kind === "create-list" || formMode.kind === "edit-list") &&
              <ListForm key={formMode.kind === "edit-list" ? formMode.item.id : "new-list"}
                action={formMode.kind === "create-list" ? "create" : "update"}
                list={formMode.kind === "edit-list" ? formMode.item : undefined}
                onSubmit={saveList} onCancel={() => setFormMode(undefined)} />}
          </section>}

          {view === "rules" ? <section className="pui-panel">
            <div className="pui-table-heading">
              <div><h2>Rule Listing</h2><p>{filteredRules.length} of {rules.length} rules</p></div>
              <div className="pui-filters">
                <input className="pui-control" aria-label="Search rules" placeholder="Search rules…" value={search} onChange={(event) => setSearch(event.target.value)} />
                <select className="pui-control" aria-label="Filter rules by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option>All statuses</option><option>Active</option><option>Inactive</option>
                </select>
                <Button onClick={openCreateRule}>Create Rule</Button>
              </div>
            </div>
            <RulesTable rules={filteredRules}
              onEdit={(rule) => { setFormMode({ kind: "edit-rule", item: rule }); setMessage(""); }}
              onDelete={(rule) => setPendingDelete({ kind: "rule", item: rule })} />
          </section> : <section className="pui-panel">
            <div className="pui-table-heading">
              <div><h2>List Listing</h2><p>{filteredLists.length} of {lists.length} lists</p></div>
              <div className="pui-filters">
                <input className="pui-control" aria-label="Search lists" placeholder="Search lists…" value={search} onChange={(event) => setSearch(event.target.value)} />
                <Button onClick={openCreateList}>Add List</Button>
              </div>
            </div>
            <ListsTable lists={filteredLists}
              onEdit={(list) => { setFormMode({ kind: "edit-list", item: list }); setMessage(""); }}
              onDelete={(list) => setPendingDelete({ kind: "list", item: list })} />
          </section>}
        </div>
      </div>

      <DeleteConfirmation item={pendingDelete?.item} itemType={pendingDelete?.kind ?? "rule"}
        onConfirm={confirmDelete} onCancel={() => setPendingDelete(undefined)} />
    </main>
  );
}
