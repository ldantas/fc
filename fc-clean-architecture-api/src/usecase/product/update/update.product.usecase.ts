import Product from "../../../domain/product/entity/product";
import ProductInterface from "../../../domain/product/entity/product.interface";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export default class UpdateProductUseCase{
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
      this.productRepository = productRepository;
    }

    async execute(
        input: InputUpdateProductDto
      ): Promise<OutputUpdateProductDto> {
        const product = await this.productRepository.find(input.id);
        product.changeName(input.name);
        product.changePrice(input.price);
        await this.productRepository.update(product);
        return {
            id: product.id,
            name: product.name,
            price: product.price,
        }
      }

}