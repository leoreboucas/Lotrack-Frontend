import type { ReactNode } from "react";
import { useCan } from "@refinedev/core";

type Props = {
  resource: string;
  action: string;
  children: ReactNode;
};

export const CanAccess = ({ resource, action, children }: Props) => {
  const { data, isLoading } = useCan({ resource, action });

  if (isLoading || !data?.can) return null;

  return <>{children}</>;
};
