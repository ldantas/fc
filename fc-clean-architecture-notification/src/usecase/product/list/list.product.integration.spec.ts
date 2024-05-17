import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

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
  
    it("should list the products", async () => {
      const productRepository = new ProductRepository();
      const usecase = new ListProductUseCase(productRepository);
  
      const productId1 = "prod1";
      const product1 = new Product(productId1, "Product 1", 10);
      await productRepository.create(product1);
      //Verifica se gravou no BD product1
      const productModel1 = await ProductModel.findOne({ where: { id: productId1 } });
      expect(productModel1.toJSON()).toEqual({
        id: product1.id,
        name: product1.name,
        price: product1.price
      });
  
      const productId2 = "prod2";
      const product2 = new Product(productId2, "Product 2", 20);
      await productRepository.create(product2);
      //Verifica se gravou no BD product1
      const productModel2 = await ProductModel.findOne({ where: { id: productId2 } });
      expect(productModel2.toJSON()).toEqual({
        id: product2.id,
        name: product2.name,
        price: product2.price
      });
 
      
      //Testa o use case
      const input = {};

      const result = await usecase.execute(input);

      //Verifica o output do use case
      expect(result.products.length).toBe(2);
      result.products.forEach((product: { id: any; name: any; price: any; }) => {
        expect([product1.id, product2.id]).toContain(product.id);
        expect([product1.name, product2.name]).toContain(product.name);
        expect([product1.price, product2.price]).toContain(product.price);
      });


    });
  
  it("should not find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);
      //Testa o use case
      const input = {};
      const result = await usecase.execute(input);
      //Verifica o output do use case
      expect(result.products.length).toBe(0);
  });
      
});
  