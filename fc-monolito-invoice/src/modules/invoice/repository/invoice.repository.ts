import { number } from "yup";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import AddressModel from "./invoice-address.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import Address from "../domain/invoice-address";

export default class InvoiceRepository implements InvoiceGateway{
    async find(id: string): Promise<Invoice> {
        const invoiceModel = await InvoiceModel.findOne({where:{id:id},  include: ["items","address"],});
        if(!invoiceModel){
            throw new Error("Invoice not found.");
        }
        const address = new Address({
            street: invoiceModel.address.street,
            number: invoiceModel.address.number,
            complement: invoiceModel.address.complement,
            city: invoiceModel.address.city,
            state: invoiceModel.address.state,
            zipCode: invoiceModel.address.zipCode,            
        })

        const items = invoiceModel.items.map(item => {
             return new InvoiceItem({
                            id: new Id(item.id),
                            name: item.name,
                            price: item.price
            });
        });

        const invoice = new Invoice({
            id: new Id(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: address,
            items: items,
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt
        });

        return invoice;
    }
    
    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
                invoiceId: invoice.id.id,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        },
        {
            include: [{model: InvoiceItemModel},{model: AddressModel}]
        });

    }
    
}