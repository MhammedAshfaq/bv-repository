import { useState } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

export type RuleOperator = "equals" | "not_equals" | "greater_than" | "less_than";

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: string;
}

export interface RuleBuilderValue {
  id: string;
  name: string;
  description: string;
  conditions: RuleCondition[];
}

export interface RuleBuilderProps {
  onSave: (rule: RuleBuilderValue) => void;
}

export function RuleBuilder({ onSave }: RuleBuilderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState<RuleCondition[]>([
    { field: "age", operator: "greater_than", value: "" },
  ]);
  const [error, setError] = useState("");

  function save() {
    if (!name.trim() || conditions.some((condition) => !condition.field || !condition.value.trim())) {
      setError("Enter a rule name and complete every condition.");
      return;
    }
    setError("");
    onSave({
      id: `RULE-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      conditions,
    });
  }

  return (
    <div className="pui-stack">
      <Input label="Rule name" value={name} onChange={(event) => setName(event.target.value)} />
      <Input label="Rule description" value={description} onChange={(event) => setDescription(event.target.value)} />
      <h3>Conditions</h3>
      {conditions.map((condition, index) => (
        <div className="pui-condition" key={index}>
          <select className="pui-control" aria-label="Condition field" value={condition.field}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, field: event.target.value } : item))}>
            {["age", "country", "amount", "customer_type"].map((field) => <option key={field} value={field}>{field}</option>)}
          </select>
          <select className="pui-control" aria-label="Condition operator" value={condition.operator}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, operator: event.target.value as RuleOperator } : item))}>
            <option value="equals">Equals</option>
            <option value="not_equals">Not equals</option>
            <option value="greater_than">Greater than</option>
            <option value="less_than">Less than</option>
          </select>
          <input className="pui-control" aria-label="Condition value" value={condition.value}
            onChange={(event) => setConditions((current) => current.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} />
          <Button variant="secondary" type="button" aria-label="Remove condition"
            disabled={conditions.length === 1}
            onClick={() => setConditions((current) => current.filter((_, i) => i !== index))}>Remove</Button>
        </div>
      ))}
      <div className="pui-actions">
        <Button type="button" variant="secondary" onClick={() => setConditions((current) => [...current, { field: "age", operator: "equals", value: "" }])}>Add condition</Button>
        <Button type="button" onClick={save}>Save rule</Button>
      </div>
      {error && <p className="pui-error" role="alert">{error}</p>}
    </div>
  );
}
