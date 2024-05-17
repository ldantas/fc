import express, { Request, Response } from "express";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateProductUseCase(new ProductRepository());
    try {
      const createProductDto = {
        name: req.body.name,
        price: req.body.price,
      };
      const output = await usecase.execute(createProductDto);
      res.status(201).send(output);
    } catch (error) {
        mapResponseStatusCode(res, error);
    }
  });
  
  productRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository());
    const output = await usecase.execute({});
    res.send(output);
  });

  productRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new FindProductUseCase(new ProductRepository());
    try{
        const findProductDto = {id:req.params.id};
        const output = await usecase.execute(findProductDto);
        res.send(output);
    }catch(error){
        if (error instanceof Error && error.message == "Product not found"){
            res.status(404).send(error);
        } else {
            res.status(500).send(error);
        }
    }
  });

  productRoute.put("/:id", async (req: Request, res: Response) => {
    const usecase = new UpdateProductUseCase(new ProductRepository());
    try {
      const updateProductDto = {
        id: req.params.id,
        name: req.body.name,
        price: req.body.price,
      };
      const output = await usecase.execute(updateProductDto);
      res.status(200).send(output);
    } catch (error) {
        mapResponseStatusCode(res, error);
    }

  });

  function mapResponseStatusCode(res: Response, error: any) {
    let message;
    let status;
    if (error instanceof Error) message = error.message;
    switch (message) {
        case "Product not found":
            status = 404;
            break;
        case "Name is required":
        case "Price must be greater than zero":
            status = 400;
            break;
        default:
            status = 500;
    }
    res.status(status).send(error);
}
