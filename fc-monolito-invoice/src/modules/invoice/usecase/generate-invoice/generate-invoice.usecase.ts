import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import Address from "../../domain/invoice-address";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface{
    private _invoiceRepository: InvoiceGateway;

    constructor(repo: InvoiceGateway){
        this._invoiceRepository = repo;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        //Monta o objeto de domain        
        const address = new Address({
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,            
        })
        const items = input.items.map(item => {
             return new InvoiceItem({
                            id: new Id(item.id),
                            name: item.name,
                            price: item.price
            });
        });
        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: address,
            items: items,
        });

        //Efetiva a açao
        await this._invoiceRepository.generate(invoice);

        //monta o dto de retorno
        const output = {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total(),
        };
        return output;
    }

}