import ProductValidatorFactory from "./product.validator.factory";

describe("Product Validator factory unit test", () => {
    it("should create a product validator", () => {
      const validator = ProductValidatorFactory.create();
      expect(validator).toBeDefined();
    });
  });
  