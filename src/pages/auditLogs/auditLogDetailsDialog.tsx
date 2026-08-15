import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IAuditLog } from "@/types/auditLog";

type Props = {
  log: IAuditLog | null;
  onClose: () => void;
};

export const AuditLogDetailsDialog = ({ log, onClose }: Props) => {
  return (
    <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da alteração</DialogTitle>
        </DialogHeader>

        {log && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                Valores anteriores
              </p>
              <pre className="max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
                {log.oldValues ? JSON.stringify(log.oldValues, null, 2) : "—"}
              </pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                Valores novos
              </p>
              <pre className="max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
                {log.newValues ? JSON.stringify(log.newValues, null, 2) : "—"}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
