export class CreateProductDto {
  productName: string;
  productPrice: number;
  productDescription?: string;
  categoryId: string;
}