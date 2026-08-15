import { useState } from "react";
import { ScrollText } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { IAuditLog } from "@/types/auditLog";
import { AuditLogDetailsDialog } from "./auditLogDetailsDialog";
import { useAuditLogs } from "@/hooks/useAuditLog";
import { AUDIT_ACTION_LABELS, AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from "@/config/auditLogConfig";

export const AuditLogList = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const [entityType, setEntityType] = useState("all");
  const [action, setAction] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);

  const { data, isLoading } = useAuditLogs({
    page,
    size,
    sortField: "createdAt",
    sortOrder: "desc",
    filters: {
      entityType: entityType !== "all" ? entityType : undefined,
      action: action !== "all" ? action : undefined,
      from: from || undefined,
      to: to || undefined,
    },
  });

  const logs = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading && !data) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando auditoria...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ScrollText className="size-4" />
          ADMINISTRAÇÃO
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Auditoria</h1>
        <p className="text-sm text-muted-foreground">
          Histórico de alterações realizadas no sistema.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">Todas as entidades</option>
          {AUDIT_ENTITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">Todas as ações</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {AUDIT_ACTION_LABELS[a]}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
          className="h-9 w-auto"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
          className="h-9 w-auto"
        />
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>IP</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>{log.userName ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.ipAddress ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {logs.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhum registro de auditoria encontrado.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Itens por página
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border bg-background px-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/50"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Próxima
        </Button>
      </div>

      <AuditLogDetailsDialog
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
