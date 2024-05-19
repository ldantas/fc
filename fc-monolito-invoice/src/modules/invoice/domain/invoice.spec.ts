import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "./invoice";
import Address from "./invoice-address";
import InvoiceItem from "./invoice-item";


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

describe("Invoice domain unit test", ()=>{
    it("should create an invoice item with specified id", async () => {
        const itemProps = {
            id: new Id("itemId 1"),
            name: "item1",
            price: 10
        }
        const item = new InvoiceItem(itemProps);
        
        expect(item.id.id).toBe(itemProps.id.id);
        expect(item.name).toBe(itemProps.name);
        expect(item.price).toBe(itemProps.price);        
    });

    it("should create an invoice item with auto id", async () => {
        const itemProps = {
            name: "item1",
            price: 10
        }
        const item = new InvoiceItem(itemProps);

        expect(item.id).toBeDefined();        
        expect(item.name).toBe(itemProps.name);
        expect(item.price).toBe(itemProps.price);        
    });

    it("should throw error if name is empty", async () => {
        const itemProps = {
            name: "",
            price: 10
        }
        expect(() => new InvoiceItem(itemProps)).toThrowError("Item Name is required");
    });
    it("should throw error if price is less than zero", async () => {
        const itemProps = {
            name: "Item 1",
            price: -1
        }
        expect(() => new InvoiceItem(itemProps)).toThrowError("Price must be greater than zero");
    });
    it("should throw error if price is equal to zero", async () => {
        const itemProps = {
            name: "Item 1",
            price: 0
        }
        expect(() => new InvoiceItem(itemProps)).toThrowError("Price must be greater than zero");
    });

    it("should create address without complement", async () => {
        const address = new Address(addressProps);
        expect(address.city).toBe(addressProps.city);
        expect(address.complement).toBeUndefined();
        expect(address.number).toBe(addressProps.number);
        expect(address.state).toBe(addressProps.state);
        expect(address.zipCode).toBe(addressProps.zipCode);
    });
    
    it("should create address with complement", async () => {
        const addressPropComplement = Object.assign({complement: "complement 1"}, addressProps);
        
        const address = new Address(addressPropComplement);
        expect(address.city).toBe(addressPropComplement.city);
        expect(address.complement).toBe(addressPropComplement.complement);
        expect(address.number).toBe(addressPropComplement.number);
        expect(address.state).toBe(addressPropComplement.state);
        expect(address.zipCode).toBe(addressPropComplement.zipCode);
    });


    it("should create an invoice", async () => {
        const invoiceName = "name1";
        const invoiceDocument = "document1";
        const address = new Address(addressProps);
        const items = [new InvoiceItem(item1Props), new InvoiceItem(item2Props)];

        const invoice = new Invoice({
            address: address,
            items: items,
            document: invoiceDocument,
            name: invoiceName,
        });

        expect(invoice.id).toBeDefined();
        expect(invoice.createdAt).toBeDefined();
        expect(invoice.updatedAt).toBeDefined();
        expect(invoice.name).toBe(invoiceName);
        expect(invoice.document).toBe(invoiceDocument);
        expect(invoice.items).toStrictEqual(items);
        expect(invoice.address).toStrictEqual(address);
    });

    it("should not create an invoice without items", async () => {
        const invoiceName = "name1";
        const invoiceDocument = "document1";
        const address = new Address(addressProps);
        const items:InvoiceItem[] = [];

        expect(()=>new Invoice({
            address: address,
            items: items,
            document: invoiceDocument,
            name: invoiceName,
        })).toThrowError("At least one Invoice Item is required.");
    });

    it("should calculate Invoice Total", async () => {
        const invoiceName = "name1";
        const invoiceDocument = "document1";
        const address = new Address(addressProps);
        const items = [new InvoiceItem(item1Props), new InvoiceItem(item2Props)];

        const invoice = new Invoice({
            address: address,
            items: items,
            document: invoiceDocument,
            name: invoiceName,
        });

        expect(invoice.total()).toBe(30);
    });

});