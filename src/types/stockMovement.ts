export type StockMovementType = "ENTRY" | "EXIT" | "DISPOSAL" | "ADJUSTMENT";

export type StockMovementDirection = "INCREASE" | "DECREASE" | null;

export interface IStockMovement {
  id: string;
  type: StockMovementType;
  direction: StockMovementDirection;
  productId: string;
  productName: string;
  productUnitOfMeasure: string;
  productSku: string;
  productBarcode: string;
  totalQuantity: number;
  reason: string | null;
  userId: string;
  userName: string;
  createdAt: string;
}
