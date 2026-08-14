// src/providers/accessControlProvider.ts
import type { AccessControlProvider } from "@refinedev/core";

import { authService } from "../services/authService";

const CATALOG_RESOURCES = ["categories", "products", "suppliers"];
const MOVEMENT_RESOURCES = [
  "movements",
  "movements/entries",
  "movements/exits",
  "movements/adjustments",
  "movements/disposals",
];

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = authService.getRole();

    if (!role) {
      return { can: false, reason: "Não autenticado" };
    }

    if (role === "ADMIN") {
      return { can: true };
    }

    if (resource && CATALOG_RESOURCES.includes(resource)) {
      const isReadOnly = action === "list" || action === "show";
      return isReadOnly
        ? { can: true }
        : { can: false, reason: "Apenas leitura para este perfil" };
    }

    if (resource && MOVEMENT_RESOURCES.some((r) => resource.startsWith(r))) {
      if (role === "OPERATOR") {
        return { can: true };
      }
      const isReadOnly = action === "list" || action === "show";
      return isReadOnly
        ? { can: true }
        : { can: false, reason: "Perfil sem permissão para movimentações" };
    }

    if (resource === "receipt") {
      return role === "VIEWER"
        ? { can: false, reason: "Perfil sem permissão para recibos" }
        : { can: true };
    }

    const isReadOnly = action === "list" || action === "show";
    return { can: isReadOnly };
  },
};