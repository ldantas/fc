import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";


const product = new Product("prod1", "Product 1", 10);
const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(), //retorna void
    };
  };

const baseInput = {
    id: "prod1",
    name: "Product 1 update",
    price: 100,
}
  describe("Unit test update product use case", () => {
    it("should update a product", async () => {
      const input = Object.assign({}, baseInput);
      const productRepository = MockRepository();
      productRepository.find = jest.fn().mockReturnValue(Promise.resolve(product));

      const productCreateUseCase = new UpdateProductUseCase(productRepository);
  
      const output = await productCreateUseCase.execute(input);
  
      expect(output).toEqual({
        id: input.id,
        name: input.name,
        price: input.price
      });
    });
  
    it("should thrown an error when id is not found", async () => {
      const input = Object.assign({}, baseInput);
      const productRepository = MockRepository();
      productRepository.find = jest.fn().mockImplementation(() =>{
        throw Error("Product not found");
      }); 
      const productCreateUseCase = new UpdateProductUseCase(productRepository);
  
      input.name = "";
  
      await expect(productCreateUseCase.execute(input)).rejects.toThrow(
        "Product not found"
      );
    });
  
    });
  