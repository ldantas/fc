import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test update product use case", () => {
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
  
    it("should update a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUseCase(productRepository);
  
      const product = new Product("prod1", "Product 1", 10);
      await productRepository.create(product);

      //Verifica se gravou no BD
      const productModel = await ProductModel.findOne({ where: { id: product.id } });
      expect(productModel.toJSON()).toEqual({
        id: product.id,
        name: product.name,
        price: product.price
      });
      
      //Testa use case
      const input = {
        id: "prod1",
        name: "Product 1 Updated",
        price: 100
      };

      const result = await usecase.execute(input);

      //Verifica o output do use case
      expect(result).toEqual({
        id: expect.any(String),
        name: input.name,
        price: input.price
      });

      //Verifica se atualizou no BD
      const productModelUpdated = await ProductModel.findOne({ where: { id: result.id } });
      expect(productModelUpdated.toJSON()).toEqual({
        id: product.id,
        name: input.name,
        price: input.price
      });
    });

    it("should throw error if id not found", async () => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUseCase(productRepository);
  
      //Testa use case
      const input = {
        id: "prod_not_exists",
        name: "Product 1 Updated",
        price: 100
      };

      //Verifica o output do use case
      await expect(usecase.execute(input)).rejects.toThrowError(
        "Product not found"
      );

    });

  });
  