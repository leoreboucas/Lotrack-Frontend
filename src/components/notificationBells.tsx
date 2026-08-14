// src/components/notificationsBell.tsx
import { Bell, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExpiringLots } from "@/hooks/useExpiringLots";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const daysUntil = (date: string) => {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const NotificationsBell = () => {
  const { lots, isLoading } = useExpiringLots();
  const navigate = useNavigate();

  const hasAlerts = lots.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificações"
            className="relative text-muted-foreground hover:text-foreground"
          />
        }
      >
        <Bell />
        {hasAlerts && (
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Lotes próximos do vencimento</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {isLoading && (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Carregando...
          </p>
        )}

        {!isLoading && !hasAlerts && (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Nenhum lote próximo do vencimento.
          </p>
        )}

        {!isLoading &&
          lots.map((lot) => (
            <DropdownMenuItem
              key={lot.id}
              className="flex flex-col items-start gap-0.5"
              onClick={() => navigate(`/lots/show/${lot.id}`)}
            >
              <span className="font-medium">{lot.productName}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                Lote {lot.lotNumber} — vence em {formatDate(lot.expirationDate)}{" "}
                ({daysUntil(lot.expirationDate)}d)
              </span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
