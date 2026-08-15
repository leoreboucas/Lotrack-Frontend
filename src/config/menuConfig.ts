import { ArrowRightLeft, Boxes, Package, ScrollText, Tags, Truck } from "lucide-react";

export const menuConfig = [
    {
    section: "Estoque",
    items: [
        { label: "Movimentações", path: "/", icon: ArrowRightLeft, resource: "movements" },
        { label: "Lotes", path: "/lots", icon: Boxes, resource: "lots" },
    ],
    },
  {
    section: "Cadastros",
    items: [
      { label: "Produtos", path: "/products", icon: Package, resource: "products" },
      { label: "Categorias", path: "/categories", icon: Tags, resource: "categories" },
      { label: "Fornecedores", path: "/suppliers", icon: Truck, resource: "suppliers" },
    ],
  },
  {
  section: "Administração",
  items: [
    { label: "Auditoria", path: "/audit-logs", icon: ScrollText, resource: "audit-logs" },
  ],
},
];