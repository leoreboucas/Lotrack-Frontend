export type ILot = {
  id: string;
  productId: string;
  productName: string;
  productUnitOfMeasure: string;
  supplierId: string;
  supplierName: string;
  lotNumber: string;
  initialQuantity: number;
  currentQuantity: number;
  unitCost: number;
  expirationDate: string;
  receivedAt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};