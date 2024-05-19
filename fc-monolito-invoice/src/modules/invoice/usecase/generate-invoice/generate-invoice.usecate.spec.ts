import { CreatedAt, Sequelize } from "sequelize-typescript";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceItemModel from "../../repository/invoice-item.model";
import AddressModel from "../../repository/invoice-address.model";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import InvoiceRepository from "../../repository/invoice.repository";
import Invoice from "../../domain/invoice";

describe("GenerateInvoiceUseCase test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([InvoiceModel, InvoiceItemModel, AddressModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should generate an invoice ",async () => {
        const invoiceProps = {
            name: "invoice name 1",
            document: "invoice document 1",
        };
        const addressProps = {
            street: "street 1",
            number: "1234",
            complement: "complement 1",
            city: "city 1",
            state: "state 1",
            zipCode: "zip1",
        };
        const itemsProps = [{
            id: "item_id_1",
            name: "item 1",
            price: 1,
        }];
        const invoiceInputDto = {
            name: invoiceProps.name,
            document: invoiceProps.document,
            street: addressProps.street,
            number: addressProps.number,
            complement: addressProps.complement,
            city: addressProps.city,
            state: addressProps.state,
            zipCode: addressProps.zipCode,
            items: itemsProps.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
        };

        
        //Busca a invoice através do usecase        
        const repo = new InvoiceRepository();
        const findUsecase = new GenerateInvoiceUseCase(repo);
        const invoiceOutputDto = await findUsecase.execute(invoiceInputDto);

        expect(invoiceOutputDto.id).toBeDefined();
        expect(invoiceOutputDto.name).toBe(invoiceProps.name);
        expect(invoiceOutputDto.document).toBe(invoiceProps.document);
        expect(invoiceOutputDto.street).toBe(addressProps.street);
        expect(invoiceOutputDto.number).toBe(addressProps.number);
        expect(invoiceOutputDto.complement).toBe(addressProps.complement);
        expect(invoiceOutputDto.city).toBe(addressProps.city);
        expect(invoiceOutputDto.state).toBe(addressProps.state);
        expect(invoiceOutputDto.zipCode).toBe(addressProps.zipCode);
        expect(invoiceOutputDto.items[0].id).toBe(itemsProps[0].id);
        expect(invoiceOutputDto.items[0].name).toBe(itemsProps[0].name);
        expect(invoiceOutputDto.items[0].price).toBe(itemsProps[0].price);
        expect(invoiceOutputDto.total).toBe(itemsProps[0].price);

    });


});
