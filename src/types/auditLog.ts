// src/types/auditLog.ts
export type AuditAction = "CREATE" | "UPDATE" | "DEACTIVATE"; 

export type IAuditLog = {
  id: string;
  userId: string | null;
  userName: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};