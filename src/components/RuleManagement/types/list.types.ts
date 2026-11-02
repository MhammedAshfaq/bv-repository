export type ListType = "Allow List" | "Block List";

export interface ManagedList {
  id: string;
  name: string;
  description: string;
  type: ListType;
  items: string[];
}
