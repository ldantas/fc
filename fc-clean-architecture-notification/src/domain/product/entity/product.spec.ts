import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const product = new Product("", "Product 1", 100);
    }).toThrowError("product: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const product = new Product("123", "", 100);
    }).toThrowError("product: Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      const product = new Product("123", "Name", -1);
    }).toThrowError("product: Price must be greater than zero");
  });

  it("should throw error when id and name are empty", () => {
    expect(() => {
      const product = new Product("", "", 100);
    }).toThrowError("product: Id is required,product: Name is required");
  });

  it("should throw error when id and name are empty and price is less than zero", () => {
    expect(() => {
      const product = new Product("", "", -100);
    }).toThrowError("product: Id is required,product: Name is required,product: Price must be greater than zero");
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should not change name", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changeName("");
    }).toThrowError("product: Name is required");
    expect(product.name).toBe("Product 1");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });
  it("should not change price", () => {
    const product = new Product("123", "Product 1", 100);
    expect(() => {
      product.changePrice(-150);
    }).toThrowError("product: Price must be greater than zero");
    //preço tem que estar inalterado
    expect(product.price).toBe(100);
  });
});
