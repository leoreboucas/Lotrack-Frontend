export interface ISupplier {
  id: string;
  name: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
