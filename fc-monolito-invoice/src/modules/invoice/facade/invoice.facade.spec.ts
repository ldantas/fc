import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import AddressModel from "../repository/invoice-address.model";

describe("InvoicFacade test", () => {
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

    it("should find an invoice by id",async () => {
        //cria a Invoice a ser encontrada:
        const invoiceProps = {
            id: "invoice_id_1",
            name: "invoice name 1",
            document: "invoice document 1",
            createdAt: new Date(),
            updatedAt: new Date(),
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
            invoiceId: invoiceProps.id
        }];
        await InvoiceModel.create({
            id: invoiceProps.id,
            name: invoiceProps.name,
            document: invoiceProps.document,
            address: {
                street: addressProps.street,
                number: addressProps.number,
                complement: addressProps.complement,
                city: addressProps.city,
                state: addressProps.state,
                zipCode: addressProps.zipCode,
            },
            items: itemsProps.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                invoiceId: item.invoiceId,
            })),
            createdAt: invoiceProps.createdAt,
            updatedAt: invoiceProps.updatedAt
        },
        {
            include: [{model: InvoiceItemModel},{model: AddressModel}]
        });

        
        //Busca a invoice através da facade        
        const invoiceFacade = InvoiceFacadeFactory.create();
        const invoiceDto = await invoiceFacade.find({
            id: invoiceProps.id
        });

        expect(invoiceDto.id).toBe(invoiceProps.id);
        expect(invoiceDto.name).toBe(invoiceProps.name);
        expect(invoiceDto.document).toBe(invoiceProps.document);
        expect(invoiceDto.address.street).toBe(addressProps.street);
        expect(invoiceDto.address.number).toBe(addressProps.number);
        expect(invoiceDto.address.complement).toBe(addressProps.complement);
        expect(invoiceDto.address.city).toBe(addressProps.city);
        expect(invoiceDto.address.state).toBe(addressProps.state);
        expect(invoiceDto.address.zipCode).toBe(addressProps.zipCode);
        expect(invoiceDto.items[0].id).toBe(itemsProps[0].id);
        expect(invoiceDto.items[0].name).toBe(itemsProps[0].name);
        expect(invoiceDto.items[0].price).toBe(itemsProps[0].price);
        expect(invoiceDto.total).toBe(itemsProps[0].price);
        expect(invoiceDto.createdAt).toStrictEqual(invoiceProps.createdAt);

    });

    it("should not find an invoice by id",async () => {
        //Busca a invoice através do usecase        
        const invoiceFacade = InvoiceFacadeFactory.create();
         
        await expect(invoiceFacade.find({id: "not_exists"})).rejects.toThrowError("Invoice not found.");
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
        const invoiceFacade = InvoiceFacadeFactory.create();
        const invoiceOutputDto = await invoiceFacade.generate(invoiceInputDto);

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
