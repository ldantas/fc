import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("prod1", "Product 1", 10);
const product2 = new Product("prod2", "Product 2", 20);

const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([product1,product2])),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

const baseInput = {
}

describe("Unit test list product use case", () => {
    it("should list a product", async () => {
      const input = Object.assign({}, baseInput);
      const productRepository = MockRepository();
      const productFindUseCase = new ListProductUseCase(productRepository);
  
      const output = await productFindUseCase.execute(input);
  
      expect(output.products.length).toBe(2);
      expect(output.products[0].id).toBe(product1.id);
      expect(output.products[0].name).toBe(product1.name);
      expect(output.products[0].price).toBe(product1.price);
      expect(output.products[1].id).toBe(product2.id);
      expect(output.products[1].name).toBe(product2.name);
      expect(output.products[1].price).toBe(product2.price);

    });
  
    it("should return empty list", async () => {
      const input = Object.assign({}, baseInput);
      const productRepository = MockRepository();
      productRepository.findAll = jest.fn().mockReturnValue(Promise.resolve([]));

      const productFindUseCase = new ListProductUseCase(productRepository);
  
      const output = await productFindUseCase.execute(input);
      
      expect(output.products.length).toBe(0);
      
  });
  
});
  