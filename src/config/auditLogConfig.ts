export const AUDIT_ACTIONS = ["CREATE", "UPDATE", "DEACTIVATE"] as const;

export const AUDIT_ENTITY_TYPES = [
  "Product",
  "Category",
  "Supplier",
] as const;

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DEACTIVATE: "Inativação",
};