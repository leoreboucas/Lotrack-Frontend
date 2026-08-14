import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/product";

type Props = {
  products: IProduct[];
  value: string;
  onChange: (productId: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const ProductCombobox = ({
  products,
  value,
  onChange,
  disabled,
  placeholder,
}: Props) => {
  const [open, setOpen] = useState(false);

  const selected = products.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between font-normal"
          />
        }
      >
        {selected
          ? `${selected.name} · SKU: ${selected.sku}`
          : (placeholder ?? "Selecione um produto")}
        <ChevronsUpDown className="size-4 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[--anchor-width] p-0" align="start">
        <Command
          filter={(itemValue, search) => {
            return itemValue.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder="Buscar por nome, SKU ou código de barras..." />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.sku} ${product.barcode ?? ""}`}
                  onSelect={() => {
                    onChange(product.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === product.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                      {product.barcode ? ` · ${product.barcode}` : ""}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
