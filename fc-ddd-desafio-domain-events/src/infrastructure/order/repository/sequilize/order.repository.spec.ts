import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerId = "customer1";
    const customer = await generateTestCustomer(customerId);

    const productId = "product1"
    const product = await generateTestProduct(productId);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customerId,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: productId,
        },
      ],
    });
  });

  it("should find an order", async () => {
    //Cria o customer
    const customerId = "customer1";
    const customer = await generateTestCustomer(customerId);

    //Cria o product
    const productId = "product1"
    const product = await generateTestProduct(productId);

    //Criar os orderItens
    const orderItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      3
    );

    const order1 = new Order("o1", customerId, [orderItem1]);
    const order2 = new Order("o2", customerId, [orderItem2]);

    //Cria as orders
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    //Busca order1 baseado apenas no id
    const orderModel = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find(order1.id);

    //Verifica se o retorno do banco de dados é igual ao objeto order.
    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: foundOrder.total(),
      items: [
        {
          id: foundOrder.items[0].id,
          name: foundOrder.items[0].name,
          price: foundOrder.items[0].price,
          quantity: foundOrder.items[0].quantity,
          order_id: foundOrder.id,
          product_id: foundOrder.items[0].productId,
        },
      ],
    });


  });

  it("should find all orders", async () => {
    //Cria o customer
    const customerId = "customer1";
    const customer = await generateTestCustomer(customerId);

    //Cria o product
    const productId = "product1"
    const product = await generateTestProduct(productId);

    //Criar os orderItens
    const orderItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      3
    );

    const order1 = new Order("o1", customerId, [orderItem1]);
    const order2 = new Order("o2", customerId, [orderItem2]);

    //Cria as orders
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2] 

    expect(orders).toEqual(foundOrders);    
  });

  
  it("should update an order", async () => {
    /**
     * Como não foi especificado o que deveria ser alterado na Order,
     * foi implementado a possibilidade de alterar a quantidade de um item do pedido.
     * Optei por esse caminho já que a quantidade afeta tanto a OrderItem quanto o valor
     * total na Order
     */
    const customerId = "customer1";
    const customer = await generateTestCustomer(customerId);

    const productId = "product1"
    const product = await generateTestProduct(productId);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("o1", customerId, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderToChange = await orderRepository.find(order.id);
    
    //Presume-se que o create e find estejam funcionando, de acordo com os outros testes

    //Altera a order
    const newItemQuantity = 8
    orderToChange.items[0].changeQuantity(newItemQuantity);

    //efetiva
    await orderRepository.update(orderToChange);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(updatedOrderModel.toJSON()).toStrictEqual({
      id: orderToChange.id,
      customer_id: orderToChange.customerId,
      total: orderToChange.total(),
      items: [
        {
          id: orderToChange.items[0].id,
          name: orderToChange.items[0].name,
          price: orderToChange.items[0].price,
          quantity: newItemQuantity,
          order_id: orderToChange.id,
          product_id: orderToChange.items[0].productId,
        },
      ],
    });

  });
  
});

async function generateTestProduct(productId: string): Promise<Product> {
  const productRepository = new ProductRepository();
  const product = new Product(productId, `Product ${productId}`, 10);
  await productRepository.create(product);
  return product;
}

//Cria um customer com as informacoes baseadas no id
async function generateTestCustomer(id: string): Promise<Customer> {
  const customerRepository = new CustomerRepository();
  const customer = new Customer(id, `Customer ${id}`);
  const address = new Address(`Street ${id}`, 1, `Zipcode ${id}`, `City ${id}`);
  customer.changeAddress(address);
  await customerRepository.create(customer);
  return customer;
}

