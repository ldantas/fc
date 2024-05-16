import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test find product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should find a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new FindProductUseCase(productRepository);
  
      const productId = "prod1";
      const product = new Product(productId, "Product 1", 10);
      await productRepository.create(product);
  
      //Verifica se gravou no BD
      const productModel = await ProductModel.findOne({ where: { id: productId } });
      expect(productModel.toJSON()).toEqual({
        id: product.id,
        name: product.name,
        price: product.price
      });
      
      //Testa o use case
      const input = {
        id: productId,
      };

      const result = await usecase.execute(input);

      //Verifica o output do use case
      expect(result).toEqual({
        id: product.id,
        name: product.name,
        price: product.price
      });

    });
  
  it("should not find a product", async () => {
      const productRepository = new ProductRepository();
      const findProductUseCase = new FindProductUseCase(productRepository);
  
      const productId = "product_not_exists";
      
      //Testa o use case
      const input = {
        id: productId,
      };

      //Verifica o output do use case
      await expect(findProductUseCase.execute(input)).rejects.toThrowError(
        "Product not found"
      );

    });
      
});
  