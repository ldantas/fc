import { Sequelize } from "sequelize-typescript";
import AddressModel from "./invoice-address.model";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Address from "../domain/invoice-address";
import InvoiceItem from "../domain/invoice-item";
import Invoice from "../domain/invoice";

const addressProps = {
    street: "Street 1",
    number: "1",
    city: "city 1",
    state: "State 1",
    zipCode: "Zip1",
};
const item1Props = {
    name: "item1",
    price: 10
};
const item2Props = {
    name: "item2",
    price: 20
};


describe("InvoiceRepository test", () => {
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

    it("should generate an invoice", async () => {
        const repository = new InvoiceRepository();

        const address = new Address(addressProps);
        const items = [new InvoiceItem(item1Props)];
        const invoiceProps = {
            name: "name 1",
            document: "document 1",
            address: address,
            items: items,
        };
        const invoice = new Invoice(invoiceProps); 
        
        await repository.generate(invoice);

        const invoiceDB = await InvoiceModel.findOne({where:{id:invoice.id.id},  include: ["items","address"],});

        expect(invoiceDB).toBeDefined();
        expect(invoiceDB.toJSON()).toStrictEqual(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
                address: {
                    invoiceId: invoice.id.id,
                    street: address.street,
                    number: address.number,
                    complement: null,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                },
                items: [{
                    id: items[0].id.id,
                    invoiceId: invoice.id.id,
                    name: items[0].name,
                    price: items[0].price,
                }]
            }
        );
   });

    it("should find an invoice", async () => {
        const repository = new InvoiceRepository();

        const address = new Address(addressProps);
        const items = [new InvoiceItem(item1Props), new InvoiceItem(item2Props)];
        const invoiceProps = {
            name: "name 1",
            document: "document 1",
            address: address,
            items: items,
        };
        const invoice = new Invoice(invoiceProps); 
        
        await repository.generate(invoice);

        const foundInvoice = await repository.find(invoice.id.id);

        expect(foundInvoice).toBeDefined();
        expect(foundInvoice.id.id).toBe(invoice.id.id);
        expect(foundInvoice.name).toBe(invoice.name);
        expect(foundInvoice.address).toStrictEqual(invoice.address);
        expect(foundInvoice.items).toStrictEqual(invoice.items);
        expect(foundInvoice.createdAt).toStrictEqual(invoice.createdAt);
        expect(foundInvoice.updatedAt).toStrictEqual(invoice.updatedAt);
        expect(foundInvoice.total()).toBe(invoice.total());
        expect(foundInvoice.total()).toBe(30);


    });
   
});  