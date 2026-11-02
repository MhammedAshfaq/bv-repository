import { useEffect, useState } from "react";
import { Button } from "../../Button/Button";
import { Input } from "../../Input/Input";
import { Dropdown, type DropdownOption } from "../../Dropdown/Dropdown";
import type { ManagedRule, RuleCondition, RuleOperator, RuleStatus } from "../types/rule.types";

export type RuleFormAction = "create" | "update";

interface RuleFormProps {
  action: RuleFormAction;
  rule?: ManagedRule;
  onSubmit: (rule: Omit<ManagedRule, "id">) => void;
  onCancel: () => void;
}

const fields = ["Age", "Country", "Amount", "Customer Type"];
const operators: DropdownOption[] = [
  { label: "Equals", value: "equals" }, { label: "Not Equals", value: "not_equals" },
  { label: "Greater Than", value: "greater_than" }, { label: "Less Than", value: "less_than" },
];

export function RuleForm({ action, rule, onSubmit, onCancel }: RuleFormProps) {
  const [name, setName] = useState(rule?.name ?? "");
  const [description, setDescription] = useState(rule?.description ?? "");
  const [type, setType] = useState(rule?.type ?? "Validation");
  const [status, setStatus] = useState<RuleStatus>(rule?.status ?? "Active");
  const [selectedAction, setSelectedAction] = useState(rule?.action ?? "Approve");
  const [conditions, setConditions] = useState<RuleCondition[]>(rule?.conditions.length ? rule.conditions : [{ field: "Age", operator: "equals", value: "" }]);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(rule?.name ?? "");
    setDescription(rule?.description ?? "");
    setType(rule?.type ?? "Validation");
    setStatus(rule?.status ?? "Active");
    setSelectedAction(rule?.action ?? "Approve");
    setConditions(rule?.conditions.length ? rule.conditions : [{ field: "Age", operator: "equals", value: "" }]);
  }, [rule]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !description.trim() || conditions.some((condition) => !condition.value.trim())) {
      setError("Complete the rule name, description, and every condition value.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), description: description.trim(), type, status, action: selectedAction, conditions });
  }

  return (
    <form className="pui-form" onSubmit={submit}>
      <div className="pui-form-grid">
        <Input label="Rule Name" required value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Rule Description" required value={description} onChange={(event) => setDescription(event.target.value)} />
        <Dropdown label="Rule Type" value={type} onChange={(event) => setType(event.target.value)}
          options={["Validation", "Eligibility", "Risk"].map((value) => ({ label: value, value }))} />
        <Dropdown label="Status" value={status} onChange={(event) => setStatus(event.target.value as RuleStatus)}
          options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
        <Dropdown label="Action" value={selectedAction} onChange={(event) => setSelectedAction(event.target.value)}
          options={["Approve", "Reject", "Manual Review"].map((value) => ({ label: value, value }))} />
      </div>
      <div className="pui-section-heading"><h3>Conditions</h3>
        <Button type="button" variant="secondary" onClick={() => setConditions((current) => [...current, { field: "Age", operator: "equals", value: "" }])}>Add Condition</Button>
      </div>
      {conditions.map((condition, index) => (
        <div className="pui-condition" key={index}>
          <Dropdown id={`rule-condition-field-${index}`} label="Field" value={condition.field} options={fields.map((field) => ({ label: field, value: field }))}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, field: event.target.value } : item))} />
          <Dropdown id={`rule-condition-operator-${index}`} label="Operator" value={condition.operator} options={operators}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, operator: event.target.value as RuleOperator } : item))} />
          <Input id={`rule-condition-value-${index}`} label="Value" required value={condition.value}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} />
          <Button type="button" variant="danger" disabled={conditions.length === 1} onClick={() => setConditions((current) => current.filter((_, i) => i !== index))}>Remove</Button>
        </div>
      ))}
      {error && <p className="pui-error" role="alert">{error}</p>}
      <div className="pui-actions"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{action === "create" ? "Save Rule" : "Update Rule"}</Button></div>
    </form>
  );
}
