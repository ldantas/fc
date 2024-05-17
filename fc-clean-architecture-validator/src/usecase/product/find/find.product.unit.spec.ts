import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("prod1", "Product 1", 10);

const MockRepository = () => {
    return {
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };

const baseInput = {
  id: product.id
}

describe("Unit test find product use case", () => {
    it("should find a product", async () => {
      const input = Object.assign({}, baseInput);
      const productRepository = MockRepository();
      const productFindUseCase = new FindProductUseCase(productRepository);
  
      const output = await productFindUseCase.execute(input);
  
      expect(output).toEqual({
        id: product.id,
        name: product.name,
        price: product.price
      });
    });
  
    it("should not find a product", async () => {
      const input = Object.assign({}, baseInput);
      input.id = "id_not_exists";
  
      const productRepository = MockRepository();
      productRepository.find.mockImplementation(() => {
        throw new Error("Product not found");
      });
  
      const productFindUseCase = new FindProductUseCase(productRepository);

      await expect(productFindUseCase.execute(input)).rejects.toThrow(
        "Product not found"
      );
    });
  
});
  