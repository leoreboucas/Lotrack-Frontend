import { useDelete, type BaseKey } from "@refinedev/core";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  resource: string;
  id: BaseKey;
  editPath: string;
};

export const RowActions = ({ resource, id, editPath }: Props) => {
  const { mutate, mutation } = useDelete();

  const remove = () => {
    if (
      window.confirm(
        "Deseja excluir este registro? Esta ação não poderá ser desfeita.",
      )
    ) {
      mutate({
        resource,
        id,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Ações" />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem render={<Link to={editPath} />}>
          <Pencil />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={remove}
          disabled={mutation.isPending}
        >
          <Trash2 />

          {mutation.isPending ? "Excluindo..." : "Excluir"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
