import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  //Desafio
  it("should throw error if change quantity to less then zero", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      item.changeQuantity(-1);
    }).toThrowError("New quantity must be greater than 0");
  });

  it("should throw error if change quantity to equal zero", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      item.changeQuantity(0);
    }).toThrowError("New quantity must be greater than 0");
  });

  it("should change the quantity", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
    expect(item.quantity).toBe(1);

    item.changeQuantity(10);
    expect(item.quantity).toBe(10);
  });

  it("should throw error if the new item is undefined", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      let newItem = null;
      order.addItem(newItem);

    }).toThrowError("Item is required");
  });

  it("should merge item quantity if another item with same product and price exists", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
    const order = new Order("o1", "c1", [item]);

    let newItem = new OrderItem("i2", "Item 2", 100, "p1", 3);
    order.addItem(newItem);
    expect(order.items.length).toBe(1);
    expect(order.items[0].quantity).toBe(4);
  });

  it("should add a new item if another item with same product and different price exists", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
    const order = new Order("o1", "c1", [item]);

    let newItem = new OrderItem("i2", "Item 2", 300, "p1", 3);
    order.addItem(newItem);
    expect(order.items.length).toBe(2);
    
  });

  it("should add a new item if different product", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
    const order = new Order("o1", "c1", [item]);

    let newItem = new OrderItem("i2", "Item 2", 100, "p2", 3);
    order.addItem(newItem);
    expect(order.items.length).toBe(2);
  });

});
