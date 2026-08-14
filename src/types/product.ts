export interface IProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  sku: string;
  barcode: string;
  minimumStock: number;
  unitOfMeasure: string;
}