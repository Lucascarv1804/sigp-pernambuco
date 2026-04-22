import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto, ownerId: string) {
    const product = this.productRepository.create({
      ...createProductDto,
      category: { categoryId: createProductDto.categoryId },
      owner: { userId: ownerId },
    });
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['category', 'owner'] });
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { productId: id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return this.productRepository.remove(product);
  }
}