export class CreateServiceDto {
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
}

export class UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}
