import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(10);
    
  });
  it("should note create a product with empty name", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "",
        price: 10,
      });
    expect(response.status).toBe(400);    
  });

  it("should note create a product with price below zero", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: -10,
      });
    expect(response.status).toBe(400);    
  });


  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    //Cria os produtos
    const response1 = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response1.status).toBe(201);

    const response2 = await request(app)
    .post("/product")
    .send({
      name: "Product 2",
      price: 20,
    });
    expect(response2.status).toBe(201);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
   
    const product1 = listResponse.body.products[0];
    expect(product1.id).toBeDefined();
    expect(product1.name).toBe("Product 1");
    expect(product1.price).toBe(10);
    const product2 = listResponse.body.products[1];
    expect(product2.id).toBeDefined();
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(20);   
  });

  it("should find a product", async () => {
    //Cria o produto
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(201);
    const newProductId = response.body.id;

    const findResponse = await request(app).get("/product/" + newProductId).send();

    expect(findResponse.status).toBe(200);
    expect(findResponse.body.id).toBe(newProductId);
    expect(findResponse.body.name).toBe("Product 1");
    expect(findResponse.body.price).toBe(10);   
  });

  it("should not find a product", async () => {
    const newProductId = "not_found_id";

    const findResponse = await request(app).get("/product/" + newProductId).send();

    expect(findResponse.status).toBe(404);   
  });

  it("should update a product", async () => {
    //Cria o produto
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(201);
    const newProductId = response.body.id;

    const updateInput = {
        name: "Product 1 Updated",
        price: 100
    }

    const updateResponse = await request(app).put("/product/" + newProductId).send(updateInput);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.id).toBe(newProductId);
    expect(updateResponse.body.name).toBe("Product 1 Updated");
    expect(updateResponse.body.price).toBe(100);   
 

    //Double checks com um find
    const findResponse = await request(app).get("/product/" + newProductId).send();

    expect(findResponse.status).toBe(200);
    expect(findResponse.body.id).toBe(newProductId);
    expect(findResponse.body.name).toBe("Product 1 Updated");
    expect(findResponse.body.price).toBe(100);   
  });

  it("should not update a product not found", async () => {
    const newProductId = "id_not_exists";

    const updateInput = {
        name: "Product 1 Updated",
        price: 100
    }

    const updateResponse = await request(app).put("/product/" + newProductId).send(updateInput);
    expect(updateResponse.status).toBe(404);
  });

  it("should not update a product invalid name", async () => {
    //Cria os produtos
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(201);
    const newProductId = response.body.id;

    const updateInput = {
        name: "",
        price: 100
    }

    const updateResponse = await request(app).put("/product/" + newProductId).send(updateInput);
    expect(updateResponse.status).toBe(400);
   
  });

  it("should not update a product with price below zero", async () => {
    //Cria os produtos
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(201);
    const newProductId = response.body.id;

    const updateInput = {
        name: "Product 1 Update",
        price: -1
    }

    const updateResponse = await request(app).put("/product/" + newProductId).send(updateInput);
    expect(updateResponse.status).toBe(400);
   
  });

});
